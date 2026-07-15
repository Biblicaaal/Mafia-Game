import { spawn } from 'node:child_process';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const OUT = path.join(ROOT, 'video-output', 'territory-expansion-reel');
const FRAMES = path.join(OUT, 'frames');
const WIDTH = 720;
const HEIGHT = 1280;
const FPS = 12;
const DEBUG_PORT = 9224;
const GAME_URL = 'http://127.0.0.1:4175/';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getJson(url) {
  return new Promise((resolve, reject) => {
    const request = http.get(url, (response) => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => { body += chunk; });
      response.on('end', () => {
        try { resolve(JSON.parse(body)); } catch (error) { reject(error); }
      });
    });
    request.on('error', reject);
    request.setTimeout(1500, () => request.destroy(new Error('CDP request timed out')));
  });
}

async function waitForTarget() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const targets = await getJson(`http://127.0.0.1:${DEBUG_PORT}/json/list`);
      const page = targets.find((target) => target.type === 'page');
      if (page?.webSocketDebuggerUrl) return page;
    } catch {}
    await sleep(250);
  }
  throw new Error('Chrome DevTools target did not become available.');
}

class CdpClient {
  constructor(url) {
    this.socket = new WebSocket(url);
    this.nextId = 1;
    this.pending = new Map();
  }

  async connect() {
    await new Promise((resolve, reject) => {
      this.socket.addEventListener('open', resolve, { once: true });
      this.socket.addEventListener('error', reject, { once: true });
    });
    this.socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (!message.id || !this.pending.has(message.id)) return;
      const { resolve, reject } = this.pending.get(message.id);
      this.pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result || {});
    });
  }

  call(method, params = {}) {
    const id = this.nextId++;
    const promise = new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
    this.socket.send(JSON.stringify({ id, method, params }));
    return promise;
  }

  close() { this.socket.close(); }
}

let cdp;
let frameNumber = 0;

async function evaluate(expression, awaitPromise = true) {
  const result = await cdp.call('Runtime.evaluate', {
    expression,
    awaitPromise,
    returnByValue: true,
    userGesture: true,
  });
  if (result.exceptionDetails) {
    const description = result.exceptionDetails.exception?.description || result.exceptionDetails.text;
    throw new Error(`Page evaluation failed: ${description}`);
  }
  return result.result?.value;
}

async function screenshot() {
  const result = await cdp.call('Page.captureScreenshot', {
    format: 'jpeg',
    quality: 90,
    fromSurface: true,
    captureBeyondViewport: false,
  });
  frameNumber += 1;
  const filename = `frame_${String(frameNumber).padStart(5, '0')}.jpg`;
  await writeFile(path.join(FRAMES, filename), Buffer.from(result.data, 'base64'));
}

async function hold(seconds, tick) {
  const frames = Math.max(1, Math.round(seconds * FPS));
  for (let frame = 0; frame < frames; frame += 1) {
    if (tick) await tick(frame / Math.max(1, frames - 1), frame);
    await screenshot();
    await sleep(Math.max(0, Math.round(1000 / FPS) - 8));
  }
}

async function caption(title, subtitle = '') {
  await evaluate(`window.__reelCaption(${JSON.stringify(title)}, ${JSON.stringify(subtitle)})`);
}

async function clearCaption() {
  await evaluate('window.__reelCaption("", "")');
}

async function prepareGame() {
  await evaluate(`(async function(){
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
    for(let i=0;i<100;i++){
      if(window.state && typeof render==='function' && window.DeskDonStreetCampaign) break;
      await wait(100);
    }
    if(!window.state) throw new Error('Game state was not initialized');

    document.querySelectorAll('.new-order-delivery,.extortion-overlay,#reel-caption').forEach(el=>el.remove());
    state.day=0;
    state.time='6:00 AM';
    state.timeMinuteOfDay=360;
    state.timeMoving=false;
    state.timeDrawerOpen=false;
    state.timeSpeed=1;
    state.stopReason='';
    state.choiceEventsDisabled=true;
    state.sidebarCollapsed=true;
    state.integratedOrders=[];
    state.messages=[];
    state.latestMessageId='';
    state.selectedMessageId='';
    state.pendingOrderPresentationId='';
    state.protectedBusinesses={};
    state.extortionState={};
    state.collectionEnvelopes=[];
    state.collectionLedger=[];
    state.extortionTutorialSeen=true;
    state.extortionEncounter=null;
    state.playerMovement=null;
    state.playerAction=null;
    if(state.organizationFinance) state.organizationFinance.coffers=0;
    if(!state.campaign) state.campaign={};
    state.campaign.initialIntegratedOrderSent=true;
    state.campaign.lastTerritoryExtortionCheckDay=0;
    state.campaign.lastLocationScoutCheckDay=0;
    state.campaign.territoryExtortionWeeks={0:2};
    state.campaign.territoryExtortionWeekLimits={0:2};
    state.campaign.locationScoutWeeks={0:1};
    state.tab='City';
    state.mapMode='district';
    const safe=findPlayerSafehouse();
    if(safe){
      state.selected=safe.districtId;
      state.playerLocation={districtId:safe.districtId,parcelId:safe.parcel.id,position:centroid(safe.parcel.polygon)};
      state.playerSpawnInitialized=true;
      state.district3d={enabled:true,districtId:safe.districtId,seed:(state.district3d&&state.district3d.seed)||0,enteringName:''};
    }
    render();
    await wait(1600);
    const root=document.getElementById('district-three-root');
    if(root&&window.DeskDon3D){
      window.DeskDon3D.resetCamera(root);
      window.DeskDon3D.cameraView(root,'top');
      window.dispatchEvent(new Event('resize'));
    }

    const style=document.createElement('style');
    style.id='reel-capture-style';
    style.textContent=\`
      #reel-caption{position:fixed;z-index:2147483000;left:50%;top:88px;width:min(610px,calc(100vw - 54px));transform:translateX(-50%) translateY(-18px);opacity:0;pointer-events:none;text-align:center;transition:opacity .28s ease,transform .38s cubic-bezier(.2,.8,.2,1);font-family:Georgia,serif;color:#f8dfa0;text-shadow:0 3px 13px #000,0 1px 0 #000;}
      #reel-caption.show{opacity:1;transform:translateX(-50%) translateY(0)}
      #reel-caption b{display:inline-block;padding:10px 18px 8px;border:1px solid rgba(229,174,54,.7);background:linear-gradient(180deg,rgba(58,30,12,.92),rgba(20,11,7,.88));box-shadow:0 0 0 3px rgba(0,0,0,.32),0 10px 32px rgba(0,0,0,.48);font-size:31px;line-height:1;letter-spacing:.07em;text-transform:uppercase}
      #reel-caption span{display:block;margin:10px auto 0;color:#f4ead0;font-family:Arial,sans-serif;font-weight:700;font-size:17px;letter-spacing:.055em;text-transform:uppercase;text-shadow:0 2px 8px #000}
      .app-side{opacity:.94}
      .district-dossier,.district-three-debug-label,.district-three-version-label,.district-three-fps-label,.district-debug-panel,.fps-counter{display:none!important}
    \`;
    document.head.appendChild(style);
    const caption=document.createElement('div');
    caption.id='reel-caption';
    caption.innerHTML='<b></b><span></span>';
    document.body.appendChild(caption);
    window.__reelCaption=function(title,subtitle){
      const root=document.getElementById('reel-caption');
      root.querySelector('b').textContent=title||'';
      root.querySelector('span').textContent=subtitle||'';
      root.classList.toggle('show',!!title);
    };
    return {safehouse:safe&&safe.parcel.id,district:state.selected};
  })()`);
}

async function focus(parcelId) {
  await evaluate(`(function(){
    const root=document.getElementById('district-three-root');
    const p=parcelInDistrict(${JSON.stringify(parcelId)},state.selected);
    if(root&&p&&window.DeskDon3D) window.DeskDon3D.focusParcel(root,p.id,centroid(p.polygon));
  })()`);
}

async function runShowcase() {
  await prepareGame();
  await caption('Friday, February 27', 'A new week begins in Moretti territory');
  await hold(2.1);
  await clearCaption();
  await hold(0.5);

  await evaluate(`(function(){
    const l=layout(district(state.selected));
    const candidates=[];
    (l.blocks||[]).forEach(function(block){(block.parcels||[]).forEach(function(p){
      if(!p||p.isFamilyEstate||p.isPlayerSafehouse)return;
      if(String(p.category||'').toLowerCase()!=='commercial')return;
      if((state.protectedBusinesses||{})[p.id])return;
      if(typeof isParcelInMafiaExtortionRange==='function'&&!isParcelInMafiaExtortionRange(p))return;
      candidates.push(p);
    });});
    const target=candidates[0];
    if(!target) throw new Error('No expandable territory target was available');
    const label=target.mainBuildingName||target.displayName||target.locationName||target.label||target.subtype||'Commercial Business';
    const crew=state.crewAssignment||{};
    const order={id:'reel-territory-extortion',type:'territoryExtortion',title:'Collect Protection',status:'offered',mandatory:true,issuerId:crew.superiorId||'',issuerName:crew.superiorName||'The Family',capoId:crew.capoId||'',assignedDay:state.day,acceptDeadlineDay:state.day+1,completionDeadlineDay:state.day+3,deadlineDay:state.day+3,reward:14,districtId:state.selected,target:{districtId:state.selected,parcelId:target.id,label:label,name:label},scout:{districtId:state.selected,parcelId:target.id,label:label},result:''};
    window.__reelOrder=order;
    window.DeskDonStreetCampaign.issueOrder(order);
  })()`);
  await hold(3.0);

  await evaluate(`(function(){const el=document.querySelector('.new-order-envelope');if(el)el.click();})()`);
  await hold(1.2);
  await caption('Orders from the Family', 'Expand protection into the next block');
  await hold(1.6);
  await clearCaption();

  await evaluate(`(function(){
    const accept=document.querySelector('[data-integrated="acceptOrder"]');
    if(!accept)throw new Error('Inbox accept control was not rendered');
    accept.click();
  })()`);
  await hold(1.5);
  const targetId = await evaluate('window.__reelOrder.target.parcelId');
  await focus(targetId);
  await caption('The target', 'Reach the business and pressure its owner');
  await hold(2.4);
  await clearCaption();

  await evaluate(`(function(){
    const p=parcelInDistrict(window.__reelOrder.target.parcelId,window.__reelOrder.target.districtId);
    state.playerLocation={districtId:state.selected,parcelId:p.id,position:centroid(p.polygon)};
    state.playerMovement=null;
    window.__reelTarget=p;
    openExtortionQte(p);
  })()`);
  await hold(1.4);
  await caption('Hold. Build pressure. Release.', 'Gray pays once · White pays weekly · Black pays the most');
  await hold(2.2);
  await clearCaption();
  await evaluate(`(function(){
    const e=state.extortionEncounter;
    e.introPlaying=false;
    e.chargeDurationMs=850;
    e.charging=true;
    e.chargeStartedAt=Date.now();
    e.chargeProgress=0;
    paintExtortionCharge();
  })()`);
  await hold(0.86);
  await evaluate(`(function(){
    const e=state.extortionEncounter;
    e.charging=false;
    e.chargeProgress=.885;
    e.releaseProgress=.885;
    resolveExtortionQte(.885);
  })()`);
  await hold(2.2);
  await caption('Protection established', 'A weekly envelope now belongs to the Family');
  await hold(1.5);
  await clearCaption();
  await evaluate('resolveExtortionQte()');
  await hold(0.8);

  await evaluate(`(function(){
    const first=window.__reelTarget;
    const candidates=[];
    (layout(district(state.selected)).blocks||[]).forEach(function(block){(block.parcels||[]).forEach(function(p){
      if(!p||p.id===first.id||p.isFamilyEstate||p.isPlayerSafehouse)return;
      if(String(p.category||'').toLowerCase()==='commercial'&&!(state.protectedBusinesses||{})[p.id])candidates.push(p);
    });});
    candidates.sort(function(a,b){
      const ac=centroid(a.polygon),bc=centroid(b.polygon),fc=centroid(first.polygon);
      return Math.hypot(ac.x-fc.x,ac.y-fc.y)-Math.hypot(bc.x-fc.x,bc.y-fc.y);
    }).slice(0,2);
    window.__reelExtras=candidates.slice(0,2);
  })()`);

  for (let index = 0; index < 2; index += 1) {
    const extraId = await evaluate(`window.__reelExtras[${index}]&&window.__reelExtras[${index}].id`);
    if (!extraId) continue;
    await focus(extraId);
    await caption(index === 0 ? 'Another door. Another envelope.' : 'The block falls in line', 'Territory expands business by business');
    await hold(1.25);
    await evaluate(`(function(){
      const p=window.__reelExtras[${index}];
      const weekly=Math.max(8,Math.round((p.propertyValue||1000)*.004*1.2));
      state.extortionState[p.id]={mood:'Extorted',weeklyDue:weekly,lastCollectedDay:state.day,collectorCut:.2,mafiaCut:.8,result:'white',protected:true};
      state.protectedBusinesses[p.id]={family:'player',color:'#ff1d1d',weeklyDue:weekly,lastCollectedDay:state.day,collectorCut:.2,mafiaCut:.8,result:'white'};
      updateMountedRacketVisuals();
    })()`);
    await hold(1.05);
    await clearCaption();
  }

  await evaluate(`(function(){
    state.day=2;
    state.time='8:00 AM';
    state.timeMinuteOfDay=480;
    Object.keys(state.protectedBusinesses||{}).forEach(function(id){state.protectedBusinesses[id].lastCollectedDay=-6;});
    updateMountedRacketVisuals();
    refreshLiveTimeUI(true);
    const root=document.getElementById('district-three-root');
    if(root&&window.DeskDon3D){window.DeskDon3D.resetCamera(root);window.DeskDon3D.cameraView(root,'top');}
  })()`);
  await caption('Sunday morning', 'Protected businesses prepare their tribute');
  await hold(2.8);
  await clearCaption();

  for (const idExpression of ['window.__reelTarget.id', 'window.__reelExtras[0]&&window.__reelExtras[0].id', 'window.__reelExtras[1]&&window.__reelExtras[1].id']) {
    const id = await evaluate(idExpression);
    if (!id) continue;
    await focus(id);
    await hold(0.65);
    await evaluate(`(function(){const p=parcelInDistrict(${JSON.stringify(id)},state.selected);if(p)collectRacketFromParcel(p);})()`);
    await hold(0.7);
  }
  await caption('Sunday envelopes collected', '20% for the collector · 80% for the Family');
  await hold(2.0);
  await clearCaption();

  await evaluate(`(function(){
    const estate=findFamilyEstate();
    window.__reelEstate=estate;
    if(estate){
      state.playerLocation={districtId:estate.districtId,parcelId:estate.parcel.id,position:centroid(estate.parcel.polygon)};
      const root=document.getElementById('district-three-root');
      if(root&&window.DeskDon3D)window.DeskDon3D.focusParcel(root,estate.parcel.id,centroid(estate.parcel.polygon));
    }
  })()`);
  await hold(1.2);
  await caption('Back to the Estate', 'Deliver the Family share and close the week');
  await hold(1.4);
  await evaluate('deliverCollectionToEstate()');
  await hold(1.8);
  await clearCaption();

  await evaluate(`(function(){
    state.day=7;state.time='6:00 AM';state.timeMinuteOfDay=360;
    if(window.__reelOrder){window.__reelOrder.status='completed';window.__reelOrder.result='Protection job reported. Territory expanded.';}
    const root=document.getElementById('district-three-root');
    if(root&&window.DeskDon3D){window.DeskDon3D.resetCamera(root);window.DeskDon3D.cameraView(root,'top');}
    if(typeof refreshIntegratedOverlays==='function')refreshIntegratedOverlays();
    refreshLiveTimeUI(true);
  })()`);
  await caption('A new week begins', 'More territory. More envelopes. More power.');
  await hold(2.5);
  await clearCaption();
  await hold(0.5);
}

async function main() {
  await rm(OUT, { recursive: true, force: true });
  await mkdir(FRAMES, { recursive: true });
  const profile = path.join(OUT, 'chrome-profile');
  await mkdir(profile, { recursive: true });

  const chrome = spawn(CHROME, [
    '--headless=new',
    `--remote-debugging-port=${DEBUG_PORT}`,
    `--user-data-dir=${profile}`,
    `--window-size=${WIDTH},${HEIGHT}`,
    '--force-device-scale-factor=1',
    '--hide-scrollbars',
    '--autoplay-policy=no-user-gesture-required',
    '--ignore-gpu-blocklist',
    '--enable-webgl',
    '--disable-background-timer-throttling',
    '--disable-renderer-backgrounding',
    '--disable-backgrounding-occluded-windows',
    GAME_URL,
  ], { stdio: 'ignore', windowsHide: true });

  try {
    const target = await waitForTarget();
    cdp = new CdpClient(target.webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.call('Page.enable');
    await cdp.call('Runtime.enable');
    await cdp.call('Emulation.setDeviceMetricsOverride', {
      width: WIDTH,
      height: HEIGHT,
      deviceScaleFactor: 1,
      mobile: false,
      screenWidth: WIDTH,
      screenHeight: HEIGHT,
    });
    await cdp.call('Page.navigate', { url: GAME_URL });
    await sleep(3500);
    await runShowcase();
    await writeFile(path.join(OUT, 'capture.json'), JSON.stringify({
      width: WIDTH,
      height: HEIGHT,
      fps: FPS,
      frameCount: frameNumber,
      durationSeconds: Number((frameNumber / FPS).toFixed(3)),
      createdAt: new Date().toISOString(),
    }, null, 2));
    process.stdout.write(`Captured ${frameNumber} frames (${(frameNumber / FPS).toFixed(1)}s) to ${FRAMES}\n`);
  } finally {
    if (cdp) cdp.close();
    chrome.kill();
  }
}

main().catch((error) => {
  console.error(error.stack || error.message || error);
  process.exitCode = 1;
});
