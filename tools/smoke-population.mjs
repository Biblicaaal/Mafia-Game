import { spawn } from 'node:child_process';
import http from 'node:http';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
function json(url) {
  return new Promise((resolve, reject) => {
    const request = http.get(url, (response) => {
      let body = '';
      response.on('data', (chunk) => { body += chunk; });
      response.on('end', () => { try { resolve(JSON.parse(body)); } catch (error) { reject(error); } });
    });
    request.on('error', reject);
  });
}
class Cdp {
  constructor(url) { this.ws = new WebSocket(url); this.id = 1; this.pending = new Map(); this.errors = []; }
  async open() {
    await new Promise((resolve, reject) => { this.ws.onopen = resolve; this.ws.onerror = reject; });
    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.method === 'Runtime.exceptionThrown') this.errors.push(message.params.exceptionDetails.text || 'Runtime exception');
      if (!message.id || !this.pending.has(message.id)) return;
      const pending = this.pending.get(message.id); this.pending.delete(message.id);
      message.error ? pending.reject(new Error(message.error.message)) : pending.resolve(message.result || {});
    };
  }
  call(method, params = {}) {
    const id = this.id++;
    const result = new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
    this.ws.send(JSON.stringify({ id, method, params }));
    return result;
  }
  async eval(expression) {
    const result = await this.call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result?.value;
  }
}

const debugPort = 9300 + Math.floor(Math.random() * 300);
const profilePath = await mkdtemp(join(tmpdir(), 'desk-don-population-'));
const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new', `--remote-debugging-port=${debugPort}`, `--user-data-dir=${profilePath}`, '--no-first-run', '--no-default-browser-check',
  '--window-size=1280,900', '--ignore-gpu-blocklist', '--enable-webgl', 'http://127.0.0.1:4175/'
], { windowsHide: true, stdio: 'ignore' });
chrome.unref();

try {
  let target;
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try { target = (await json(`http://127.0.0.1:${debugPort}/json/list`)).find((item) => item.type === 'page'); } catch {}
    if (target) break;
    await sleep(250);
  }
  if (!target) throw new Error('No Chrome target');
  const cdp = new Cdp(target.webSocketDebuggerUrl);
  await cdp.open();
  await cdp.call('Runtime.enable');
  await sleep(6500);
  const report = await cdp.eval(`(function(){
    if(!window.DeskDonPopulation)return{ok:false,error:'Population API missing'};
    var pop=window.DeskDonPopulation.ensure();
    var payload=typeof currentTimePayload==='function'?currentTimePayload():{};
    var originalMinute=state.timeMinuteOfDay;
    state.timeMinuteOfDay=510;var morningPayload=currentTimePayload();
    state.timeMinuteOfDay=1020;var eveningPayload=currentTimePayload();
    state.timeMinuteOfDay=1380;var nightPayload=currentTimePayload();
    state.timeMinuteOfDay=originalMinute;
    var rendererMounted=!!document.querySelector('#district-three-root canvas');
    var saveOk=true,saveError='',saveBytes=0;
    try{saveGame();saveBytes=(localStorage.getItem('desk-don-demo')||'').length;}catch(error){saveOk=false;saveError=error.message;}
    state.tab='Family';state.familySubtab='People Index';render();
    document.querySelectorAll('.new-order-delivery').forEach(function(element){element.remove();});
    var family=typeof ensureFamilyPhase2==='function'?ensureFamilyPhase2():{};
    var linked=(family.bloodFamily&&family.bloodFamily.members||[]).concat(family.mafiaFamily&&family.mafiaFamily.members||[]).filter(function(person){return!!person.populationPersonId;}).length;
    var owners=Object.keys(pop.buildingOwners||{}),ownerMissing=owners.filter(function(id){return!pop.peopleById[pop.buildingOwners[id]];}),followOrder=(state.integratedOrders||[]).find(function(order){return order.type==='follow';});
    var boss=pop.people.find(function(person){return person.mafiaRank==='Boss';});
    var bartender=pop.people.find(function(person){return person.job&&person.job.title==='Bartender';});
    var main=document.querySelector('.main'),dossier=document.querySelector('.world-person-dossier');
    return{ok:true,version:pop.version,people:pop.people.length,households:pop.households.length,owners:owners.length,ownerMissing:ownerMissing.length,employed:pop.people.filter(function(person){return person.job&&person.job.careerId!=='unemployed'&&person.job.careerId!=='student';}).length,familyLinked:linked,followTargetLinked:!!(followOrder&&followOrder.target&&pop.peopleById[followOrder.target.id]),pedestrians:(payload.populationAgents||[]).length,cars:(payload.populationVehicles||[]).length,morning:{pedestrians:(morningPayload.populationAgents||[]).length,cars:(morningPayload.populationVehicles||[]).length},evening:{pedestrians:(eveningPayload.populationAgents||[]).length,cars:(eveningPayload.populationVehicles||[]).length},night:{pedestrians:(nightPayload.populationAgents||[]).length,cars:(nightPayload.populationVehicles||[]).length},peopleIndexVisible:!!document.querySelector('.world-people-index'),personRows:document.querySelectorAll('.world-person-row').length,peopleIndexOverflow:{main:main&&{client:main.clientHeight,scroll:main.scrollHeight,overflow:getComputedStyle(main).overflowY},dossier:dossier&&{client:dossier.clientHeight,scroll:dossier.scrollHeight,overflow:getComputedStyle(dossier).overflowY}},lampsEnabled:!!(payload.streetInfrastructure&&payload.streetInfrastructure.lamps),trafficSignalsEnabled:!!(payload.streetInfrastructure&&payload.streetInfrastructure.trafficSignals),economy:{boss:boss&&{income:boss.job.weeklyIncome,cash:boss.money},bartender:bartender&&{income:bartender.job.weeklyIncome,cash:bartender.money}},rendererMounted:rendererMounted,saveOk:saveOk,saveError:saveError,saveBytes:saveBytes};
  })()`);
  report.search = await cdp.eval(`(async function(){var input=document.querySelector('[data-world-search]');if(!input)return{present:false};input.focus();input.value='an';input.dispatchEvent(new Event('input',{bubbles:true}));await new Promise(function(resolve){setTimeout(resolve,110);});return{present:true,focusKept:document.activeElement===input,value:input.value,matches:document.querySelector('[data-world-match-count]')&&document.querySelector('[data-world-match-count]').textContent,renderedRows:document.querySelectorAll('.world-person-row').length};})()`);
  report.boot = await cdp.eval(`(function(){var nav=performance.getEntriesByType('navigation')[0],root=document.getElementById('district-three-root');return{loadMs:nav&&Math.round(nav.loadEventEnd-nav.startTime),domReadyMs:nav&&Math.round(nav.domContentLoadedEventEnd-nav.startTime),population:window.DeskDonPopulation&&window.DeskDonPopulation.bootTiming,renderer:root&&{sceneMs:Number(root.dataset.rendererSceneMs||0),mountMs:Number(root.dataset.rendererMountMs||0)}};})()`);
  const peopleShot = await cdp.call('Page.captureScreenshot', { format: 'png', fromSurface: true });
  await writeFile('C:\\Users\\Juanma\\Documents\\Mafia Game\\population-people-index.png', Buffer.from(peopleShot.data, 'base64'));
  report.performance = await cdp.eval(`(async function(){
    state.tab='City';state.mapMode='district';render();
    await new Promise(function(resolve){setTimeout(resolve,1200);});
    async function sample(speed){
      setTimeSpeed(speed);if(!state.timeMoving)startMovingTime();
      await new Promise(function(resolve){setTimeout(resolve,350);});
      return new Promise(function(resolve){var began=performance.now(),last=began,frames=0,maxGap=0;function frame(now){frames++;maxGap=Math.max(maxGap,now-last);last=now;if(now-began<1400)requestAnimationFrame(frame);else resolve({fps:Math.round(frames*1000/(now-began)),maxFrameGap:Math.round(maxGap*10)/10,walkers:(currentTimePayload().populationAgents||[]).length,cars:(currentTimePayload().populationVehicles||[]).length});}requestAnimationFrame(frame);});
    }
    var result={oneX:await sample(1),fourX:await sample(40),tenX:await sample(100),fiftyX:await sample(500)};
    stopMovingTime('Population performance test complete.');updateMountedDistrictTime();
    return result;
  })()`);
  const rendererStats = await cdp.eval(`(function(){var root=document.getElementById('district-three-root');return root?{lamps:Number(root.dataset.streetLampCount||0),localLights:Number(root.dataset.streetLocalLightCount||0),permanentLights:Number(root.dataset.streetPermanentLightCount||0),dynamicLights:Number(root.dataset.streetDynamicLightCount||0),shadowLights:Number(root.dataset.streetShadowLightCount||0),boundaryRejected:Number(root.dataset.streetLampBoundaryRejected||0),decals:Number(root.dataset.streetLampDecalCount||0),contaminatedStreets:Number(root.dataset.streetContaminatedStreetCount||0),buildingWindows:Number(root.dataset.streetBuildingWindowCount||0),litWindows:Number(root.dataset.streetLitWindowCount||0),overnightWindows:Number(root.dataset.streetOvernightWindowCount||0),storefronts:Number(root.dataset.streetStorefrontCount||0),doors:Number(root.dataset.streetBuildingDoorCount||0),doubleDoors:Number(root.dataset.streetDoubleDoorCount||0),garageDoors:Number(root.dataset.streetGarageDoorCount||0),maxLampsPerStreet:Number(root.dataset.streetMaxLampsPerStreet||0),mappedMaterials:Number(root.dataset.streetLightMappedMaterials||0),sceneMs:Number(root.dataset.rendererSceneMs||0),mountMs:Number(root.dataset.rendererMountMs||0)}:null;})()`);
  report.lampStats = rendererStats&&{lamps:rendererStats.lamps,localLights:rendererStats.localLights,permanentLights:rendererStats.permanentLights,dynamicLights:rendererStats.dynamicLights,shadowLights:rendererStats.shadowLights,boundaryRejected:rendererStats.boundaryRejected,decals:rendererStats.decals,contaminatedStreets:rendererStats.contaminatedStreets,buildingWindows:rendererStats.buildingWindows,litWindows:rendererStats.litWindows,overnightWindows:rendererStats.overnightWindows,storefronts:rendererStats.storefronts,doors:rendererStats.doors,doubleDoors:rendererStats.doubleDoors,garageDoors:rendererStats.garageDoors,maxLampsPerStreet:rendererStats.maxLampsPerStreet,mappedMaterials:rendererStats.mappedMaterials};
  report.boot.renderer = rendererStats&&{sceneMs:rendererStats.sceneMs,mountMs:rendererStats.mountMs};
  await sleep(500);
  const shot = await cdp.call('Page.captureScreenshot', { format: 'png', fromSurface: true });
  await writeFile('C:\\Users\\Juanma\\Documents\\Mafia Game\\population-smoke.png', Buffer.from(shot.data, 'base64'));
  await cdp.eval(`(function(){state.tab='City';state.mapMode='district';state.time='Night';state.timeMinuteOfDay=1380;render();document.querySelectorAll('.new-order-delivery').forEach(function(element){element.remove();});})()`);
  await sleep(2800);
  const nightShot = await cdp.call('Page.captureScreenshot', { format: 'png', fromSurface: true });
  await writeFile('C:\\Users\\Juanma\\Documents\\Mafia Game\\population-city-night.png', Buffer.from(nightShot.data, 'base64'));
  await cdp.call('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 560, y: 430, deltaX: 0, deltaY: -1150 });
  await sleep(900);
  const closeNightShot = await cdp.call('Page.captureScreenshot', { format: 'png', fromSurface: true });
  await writeFile('C:\\Users\\Juanma\\Documents\\Mafia Game\\population-city-night-close.png', Buffer.from(closeNightShot.data, 'base64'));
  await cdp.call('Input.dispatchMouseEvent', { type: 'mousePressed', x: 560, y: 430, button: 'right', buttons: 2, clickCount: 1 });
  await cdp.call('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 560, y: 180, button: 'right', buttons: 2 });
  await cdp.call('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 560, y: 180, button: 'right', buttons: 0, clickCount: 1 });
  await sleep(500);
  report.cameraOcclusion = await cdp.eval(`(function(){var root=document.getElementById('district-three-root');return{blockers:Number(root&&root.dataset.cameraOccluderCount||0)};})()`);
  const occlusionShot = await cdp.call('Page.captureScreenshot', { format: 'png', fromSurface: true });
  await writeFile('C:\\Users\\Juanma\\Documents\\Mafia Game\\population-camera-occlusion.png', Buffer.from(occlusionShot.data, 'base64'));
  await cdp.call('Input.dispatchMouseEvent', { type: 'mousePressed', x: 560, y: 180, button: 'right', buttons: 2, clickCount: 1 });
  await cdp.call('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 560, y: 430, button: 'right', buttons: 2 });
  await cdp.call('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 560, y: 430, button: 'right', buttons: 0, clickCount: 1 });
  await sleep(350);
  report.nightClosePerformance = await cdp.eval(`(async function(){
    setTimeSpeed(1);if(!state.timeMoving)startMovingTime();
    await new Promise(function(resolve){setTimeout(resolve,300);});
    var result=await new Promise(function(resolve){var began=performance.now(),last=began,frames=0,maxGap=0;function frame(now){frames++;maxGap=Math.max(maxGap,now-last);last=now;if(now-began<1200)requestAnimationFrame(frame);else resolve({fps:Math.round(frames*1000/(now-began)),maxFrameGap:Math.round(maxGap*10)/10});}requestAnimationFrame(frame);});
    stopMovingTime('Night lighting performance test complete.');updateMountedDistrictTime();return result;
  })()`);
  await cdp.eval(`(function(){state.time='Evening';state.timeMinuteOfDay=1110;state.timeMoving=false;render();document.querySelectorAll('.new-order-delivery').forEach(function(element){element.remove();});})()`);
  await sleep(2200);
  const duskCloseShot = await cdp.call('Page.captureScreenshot', { format: 'png', fromSurface: true });
  await writeFile('C:\\Users\\Juanma\\Documents\\Mafia Game\\population-city-dusk-close.png', Buffer.from(duskCloseShot.data, 'base64'));
  report.windowSchedule = await cdp.eval(`(async function(){
    var samples={};
    for(const minute of [1020,1080,1140,1290,1380,1439,0,120,360,375]){
      state.timeMinuteOfDay=minute;state.timeMoving=false;updateMountedDistrictTime();
      await new Promise(function(resolve){requestAnimationFrame(function(){requestAnimationFrame(resolve);});});
      var root=document.getElementById('district-three-root');
      samples[minute]={active:Number(root&&root.dataset.streetActiveWindowCount||0),lightingMinute:Number(root&&root.dataset.streetLightingMinute||0)};
    }
    return samples;
  })()`);
  await cdp.eval(`(function(){state.time='Night';state.timeMinuteOfDay=120;state.timeMoving=false;updateMountedDistrictTime();})()`);
  await sleep(500);
  const overnightCloseShot = await cdp.call('Page.captureScreenshot', { format: 'png', fromSurface: true });
  await writeFile('C:\\Users\\Juanma\\Documents\\Mafia Game\\population-city-overnight-close.png', Buffer.from(overnightCloseShot.data, 'base64'));
  report.runtimeErrors = cdp.errors;
  console.log(JSON.stringify(report, null, 2));
  cdp.ws.close();
} finally {
  chrome.kill();
  await sleep(250);
  await rm(profilePath, { recursive: true, force: true });
}
