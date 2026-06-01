'use strict';
var tabs=['Dashboard','Calendar','Inbox','City','District','Crew','Tasks','Opportunities','Fronts','Rackets','Rivals'];
var mapDistricts={dockside:{island:'West Island',label:'Dockside',points:'92,438 164,400 220,418 230,530 184,614 96,584 76,505',cx:150,cy:518},riverside:{island:'West Island',label:'Riverside',points:'76,214 124,136 214,150 252,252 220,418 164,400 96,354',cx:158,cy:278},south_yards:{island:'West Island',label:'South Yards',points:'214,150 292,192 324,286 304,392 230,530 220,418 252,252',cx:265,cy:326},little_italy:{island:'Central Island',label:'Little Italy',points:'410,172 526,148 628,190 632,300 516,320 404,286',cx:514,cy:226},financial:{island:'Central Island',label:'Financial',points:'404,286 516,320 632,300 666,430 636,586 514,632 410,586',cx:536,cy:456},old_town:{island:'Central Island',label:'Old Town',points:'354,246 410,172 404,286 410,586 366,640 328,532 334,374',cx:374,cy:424},midtown:{island:'Central Island',label:'Midtown',points:'636,586 666,430 632,300 706,322 738,444 716,548 686,620',cx:682,cy:466},ironworks:{island:'North Island',label:'Ironworks',points:'770,136 866,100 988,124 1034,194 982,284 858,294 762,232',cx:896,cy:196},railhead:{island:'North Island',label:'Railhead',points:'762,232 858,294 982,284 1030,350 996,434 872,428 762,354',cx:896,cy:354},uptown:{island:'East Island',label:'Uptown',points:'776,486 900,452 1008,492 1018,604 904,646 782,604',cx:900,cy:546},garden_heights:{island:'East Island',label:'Garden',points:'1008,492 1102,534 1076,664 1010,716 904,646 1018,604',cx:1014,cy:612},airport:{island:'East Island',label:'Airport',points:'782,604 904,646 1010,716 930,784 786,742 724,664',cx:866,cy:696}};
var islandMasses=['M70 210 L118 128 L190 138 L228 158 L294 194 L330 282 L314 398 L268 512 L190 626 L96 592 L70 514 L48 444 L92 416 L72 354 L54 276 Z','M350 244 L408 166 L526 142 L632 184 L714 320 L746 444 L720 550 L686 626 L620 596 L516 638 L410 590 L365 642 L326 536 L332 374 Z','M768 134 L864 98 L990 120 L1040 194 L986 286 L1036 350 L1000 438 L872 432 L760 354 L758 232 Z','M776 486 L902 448 L1012 490 L1106 532 L1078 666 L1008 720 L930 786 L786 744 L722 664 L780 604 Z'];
var mapBridges=['M306 352 L350 330','M308 514 L332 502','M704 322 L760 286','M714 540 L778 570','M1000 438 L1030 492'];
var mapCityName='New Bordeaux Bay';
var islandNames=['Westhaven Island','Central Crown','North Iron Isle','East Garden Isle'];
var rawDistricts=[['dockside','Dockside',44,52,61,20,48,8,38],['riverside','Riverside',67,49,55,16,61,9,29],['south_yards','South Yards',35,41,70,31,36,11,35],['little_italy','Little Italy',58,44,72,34,46,18,24],['financial','Financial Ward',88,76,35,8,74,4,18],['old_town','Old Town',52,47,63,22,51,10,26],['midtown','Midtown',73,58,49,14,68,6,22],['ironworks','Ironworks',39,38,68,27,43,13,42],['railhead','Railhead',46,43,66,25,48,7,37],['uptown','Uptown',82,66,41,11,71,3,21],['garden_heights','Garden Heights',79,63,38,10,76,2,16],['airport','Municipal Airport',69,71,44,9,70,1,19]];
var state={family:'Moretti Family',mapName:mapCityName,islandNames:islandNames.slice(),tab:'Dashboard',mapMode:'city',day:0,time:'Morning',selected:'dockside',dirty:12000,clean:3500,heat:12,police:18,stopReason:'Paused manually',zoom:1,pan:{x:0,y:0},selectedBlock:'',selectedParcel:'',districts:rawDistricts.map(function(a){return{id:a[0],name:a[1],wealth:a[2],police:a[3],corruption:a[4],fear:a[5],order:a[6],control:a[7],rival:a[8]};}),messages:[{title:'Welcome to the desk',type:'Report',day:0,time:'Morning',importance:'important',read:false,body:'Assign crew to work, press Continue, and the simulation stops when something important needs the Don.'},{title:'Backroom Gambling',type:'Opportunity',day:0,time:'Morning',importance:'normal',read:false,body:'A closed social club hosts dice games after midnight. Could become a weekly racket.'}],tasks:[{title:'Scout Potential Racket',status:'active',progress:1,required:3,districtId:'dockside',endDay:2,result:''}],crew:[['Grace Moretti','capo','available','Loy 83 - Vio 54 - Int 80 - Cha 76 - Stl 65 - planner, hard bargain'],['Sal Vitale','soldier','available','Loy 70 - Vio 72 - Int 51 - Cha 48 - Stl 60 - steady hands'],['Marta Bellini','associate','available','Loy 74 - Vio 30 - Int 82 - Cha 79 - Stl 58 - smooth talker, keeps books'],['Nicky Russo','soldier','available','Loy 62 - Vio 81 - Int 42 - Cha 44 - Stl 54 - feared, short fuse']],opportunities:[{title:'Backroom Gambling',type:'racket',districtId:'dockside',value:'$850-$1,400/wk',risk:'medium'}],fronts:[['Bellini Laundry','Owned - Little Italy','Clean $450/wk - Capacity $1,200 - Suspicion 18'],['Harbor Fish Market','Unowned - Dockside','Clean $300/wk - Capacity $800 - Suspicion 22']],rackets:[['Numbers Game','Dockside','$600-$950/wk - Heat +3']],rivals:[['O’Hara Outfit','Known - Vendetta 18 - Income 42','Dockside pressure, union contacts'],['The Vipers','Unknown - Vendetta 8 - Income 21','Street-level muscle, limited intel']]};
var families=[{id:'moretti',name:'Moretti Family',short:'M',color:'#bfc7d8',home:'player'},{id:'valente',name:'Valente Crew',short:'V',color:'#c3a46e',home:'rival'},{id:'ohara',name:'O’Hara Outfit',short:'O',color:'#7fa07a',home:'rival'},{id:'kuroda',name:'Kuroda Syndicate',short:'K',color:'#9b7aa8',home:'rival'}];
var timeBlocks=['Morning','Afternoon','Evening','Night'],layouts={};
function seeded(seed){var value=2166136261;seed=String(seed);for(var i=0;i<seed.length;i++){value^=seed.charCodeAt(i);value=Math.imul(value,16777619);}return function(){value+=0x6D2B79F5;var t=value;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
function district(id){return state.districts.find(function(x){return x.id===id;})||state.districts[0];}
function parsePoints(s){return s.split(' ').map(function(p){var xy=p.split(',').map(Number);return{x:xy[0],y:xy[1]};});}
function dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y);}function lerp(a,b,t){return{x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t};}function clamp(v,min,max){return Math.max(min,Math.min(max,v));}
function signedArea(poly){return poly.reduce(function(sum,p,i){var n=poly[(i+1)%poly.length];return sum+p.x*n.y-n.x*p.y;},0)/2;}function area(poly){return Math.abs(signedArea(poly));}
function bounds(poly){return poly.reduce(function(b,p){return{minX:Math.min(b.minX,p.x),maxX:Math.max(b.maxX,p.x),minY:Math.min(b.minY,p.y),maxY:Math.max(b.maxY,p.y)};},{minX:Infinity,maxX:-Infinity,minY:Infinity,maxY:-Infinity});}
function centroid(poly){var sa=signedArea(poly);if(Math.abs(sa)<.01){return poly.reduce(function(a,p){return{x:a.x+p.x/poly.length,y:a.y+p.y/poly.length};},{x:0,y:0});}var c=poly.reduce(function(a,p,i){var n=poly[(i+1)%poly.length],f=p.x*n.y-n.x*p.y;return{x:a.x+(p.x+n.x)*f,y:a.y+(p.y+n.y)*f};},{x:0,y:0});return{x:c.x/(6*sa),y:c.y/(6*sa)};}
function cleanPoly(poly){var out=[];for(var i=0;i<poly.length;i++){var p=poly[i],last=out[out.length-1];if(!last||dist(last,p)>.8)out.push(p);}if(out.length>2&&dist(out[0],out[out.length-1])<.8)out.pop();return out;}
function path(poly){return poly&&poly.length?'M '+poly.map(function(p){return p.x.toFixed(1)+' '+p.y.toFixed(1);}).join(' L ')+' Z':'';}
function pointIn(pt,poly){var inside=false;for(var i=0,j=poly.length-1;i<poly.length;j=i++){var a=poly[i],b=poly[j];if(((a.y>pt.y)!==(b.y>pt.y))&&pt.x<((b.x-a.x)*(pt.y-a.y))/(b.y-a.y)+a.x)inside=!inside;}return inside;}
function pointOnSegment(p,a,b,eps){eps=eps||1.2;var cross=Math.abs((b.x-a.x)*(p.y-a.y)-(b.y-a.y)*(p.x-a.x));if(cross>eps)return false;var dot=(p.x-a.x)*(p.x-b.x)+(p.y-a.y)*(p.y-b.y);return dot<=eps;}
function pointInStrict(p,poly){for(var i=0;i<poly.length;i++){if(pointOnSegment(p,poly[i],poly[(i+1)%poly.length]))return false;}return pointIn(p,poly);}
function segmentsCross(a,b,c,d,eps){eps=eps||.01;function orient(p,q,r){return(q.x-p.x)*(r.y-p.y)-(q.y-p.y)*(r.x-p.x);}var o1=orient(a,b,c),o2=orient(a,b,d),o3=orient(c,d,a),o4=orient(c,d,b);if(Math.abs(o1)<eps&&pointOnSegment(c,a,b))return false;if(Math.abs(o2)<eps&&pointOnSegment(d,a,b))return false;if(Math.abs(o3)<eps&&pointOnSegment(a,c,d))return false;if(Math.abs(o4)<eps&&pointOnSegment(b,c,d))return false;return(o1>eps)!==(o2>eps)&&(o3>eps)!==(o4>eps);}
function bboxOverlap(a,b,pad){pad=pad||-.5;var A=bounds(a),B=bounds(b);return !(A.maxX+pad<B.minX||B.maxX+pad<A.minX||A.maxY+pad<B.minY||B.maxY+pad<A.minY);}function polysOverlap(a,b){if(!a.length||!b.length||!bboxOverlap(a,b))return false;for(var i=0;i<a.length;i++)if(pointInStrict(a[i],b))return true;for(var j=0;j<b.length;j++)if(pointInStrict(b[j],a))return true;for(i=0;i<a.length;i++)for(j=0;j<b.length;j++)if(segmentsCross(a[i],a[(i+1)%a.length],b[j],b[(j+1)%b.length]))return true;return false;}
function split(poly,axis,at){function clip(low){var r=[];function val(p){return axis==='x'?p.x:p.y;}function inside(p){return low?val(p)<=at:val(p)>=at;}for(var i=0;i<poly.length;i++){var cur=poly[i],prev=poly[(i+poly.length-1)%poly.length],ci=inside(cur),pi=inside(prev);if(ci!==pi){var span=val(cur)-val(prev),t=Math.abs(span)<.001?0:(at-val(prev))/span;r.push({x:axis==='x'?at:prev.x+(cur.x-prev.x)*t,y:axis==='y'?at:prev.y+(cur.y-prev.y)*t});}if(ci)r.push(cur);}return cleanPoly(r);}return[clip(true),clip(false)];}
function clipBounds(poly,minX,maxX,minY,maxY){var c=split(poly,'x',minX)[1];c=split(c,'x',maxX)[0];c=split(c,'y',minY)[1];c=split(c,'y',maxY)[0];return cleanPoly(c);}function makeCuts(min,max,count,rand){var span=max-min,weights=Array.from({length:count},function(){return.65+rand()*.9;}),total=weights.reduce(function(s,v){return s+v;},0),cuts=[min],c=min;for(var i=0;i<weights.length;i++){c+=span*weights[i]/total;cuts.push(c);}cuts[cuts.length-1]=max;return cuts;}
function intersectConvex(subject,clipper){if(!subject.length||!clipper.length)return[];var ccw=signedArea(clipper)>0;function inside(p,a,b){var cross=(b.x-a.x)*(p.y-a.y)-(b.y-a.y)*(p.x-a.x);return ccw?cross>=-.01:cross<=.01;}function lineIntersect(s,e,a,b){var A1=e.y-s.y,B1=s.x-e.x,C1=A1*s.x+B1*s.y,A2=b.y-a.y,B2=a.x-b.x,C2=A2*a.x+B2*a.y,det=A1*B2-A2*B1;if(Math.abs(det)<.0001)return e;return{x:(B2*C1-B1*C2)/det,y:(A1*C2-A2*C1)/det};}var output=subject.slice();for(var j=0;j<clipper.length;j++){var a=clipper[j],b=clipper[(j+1)%clipper.length],input=output.slice();output=[];if(!input.length)break;var s=input[input.length-1];for(var i=0;i<input.length;i++){var e=input[i];if(inside(e,a,b)){if(!inside(s,a,b))output.push(lineIntersect(s,e,a,b));output.push(e);}else if(inside(s,a,b)){output.push(lineIntersect(s,e,a,b));}s=e;}output=cleanPoly(output);}return cleanPoly(output);}
function outer(d){var fallbackKey=Object.keys(mapDistricts)[0]||'dockside';var src=parsePoints(mapDistricts[d.id]?mapDistricts[d.id].points:mapDistricts[fallbackKey].points);var b=bounds(src),w=b.maxX-b.minX,h=b.maxY-b.minY;var all=Object.keys(mapDistricts).map(function(k){return area(parsePoints(mapDistricts[k].points));});var mn=Math.min.apply(null,all),mx=Math.max.apply(null,all),norm=(area(src)-mn)/Math.max(1,mx-mn),target=145000+norm*165000,scale=Math.min(790/w,545/h,Math.sqrt(target/Math.max(1,area(src)))),sw=w*scale,sh=h*scale,ox=(800-sw)/2,oy=(560-sh)/2;return src.map(function(p){return{x:ox+(p.x-b.minX)*scale,y:oy+(p.y-b.minY)*scale};});}
function pointsToString(points){return points.map(function(p){return Math.round(p.x)+','+Math.round(p.y);}).join(' ');}function pushIntoEllipse(p,cx,cy,rx,ry){var nx=(p.x-cx)/rx,ny=(p.y-cy)/ry,m=Math.sqrt(nx*nx+ny*ny);if(m<=.96)return p;var scale=.96/m;return{x:cx+nx*rx*scale,y:cy+ny*ry*scale};}
function blobPath(cx,cy,rx,ry,rand){var pts=[],n=16+Math.floor(rand()*8),warp=rand()*Math.PI*2;for(var i=0;i<n;i++){var a=Math.PI*2*i/n,lobe=1+Math.sin(a*2+warp)*(.08+rand()*.04)+Math.sin(a*3+warp*.7)*(.04+rand()*.06),noise=.78+rand()*.42;pts.push({x:cx+Math.cos(a)*rx*lobe*noise,y:cy+Math.sin(a)*ry*lobe*noise});}return'M '+pts.map(function(p){return Math.round(p.x)+' '+Math.round(p.y);}).join(' L ')+' Z';}
function convexHull(points){if(points.length<=3)return points.slice();var pts=points.slice().sort(function(a,b){return a.x===b.x?a.y-b.y:a.x-b.x;});function cross(o,a,b){return(a.x-o.x)*(b.y-o.y)-(a.y-o.y)*(b.x-o.x);}var lower=[];for(var i=0;i<pts.length;i++){while(lower.length>=2&&cross(lower[lower.length-2],lower[lower.length-1],pts[i])<=0)lower.pop();lower.push(pts[i]);}var upper=[];for(i=pts.length-1;i>=0;i--){while(upper.length>=2&&cross(upper[upper.length-2],upper[upper.length-1],pts[i])<=0)upper.pop();upper.push(pts[i]);}upper.pop();lower.pop();return lower.concat(upper);}
function outwardOffsetPoint(p,c,amount){
  var dx=p.x-c.x,dy=p.y-c.y,len=Math.max(1,Math.hypot(dx,dy));
  return{x:p.x+dx/len*amount,y:p.y+dy/len*amount};
}
function edgeMidpointOutward(p,next,c,amount,noise,rand){
  var mid=lerp(p,next,.5),mdx=mid.x-c.x,mdy=mid.y-c.y,ml=Math.max(1,Math.hypot(mdx,mdy));
  var tangent={x:next.x-p.x,y:next.y-p.y},tl=Math.max(1,Math.hypot(tangent.x,tangent.y));
  var wave=(rand()-.5)*noise;
  return{x:mid.x+mdx/ml*amount+(-tangent.y/tl)*wave,y:mid.y+mdy/ml*amount+(tangent.x/tl)*wave};
}
function coastlineFromParent(parentPoly,rand){
  var poly=cleanPoly(parentPoly),c=centroid(poly),coast=[];
  for(var i=0;i<poly.length;i++){
    var p=poly[i],next=poly[(i+1)%poly.length];
    coast.push(outwardOffsetPoint(p,c,24+rand()*8));
    var edgeLen=dist(p,next);
    if(edgeLen>95){
      coast.push(edgeMidpointOutward(p,next,c,22+rand()*7,8,rand));
    }
  }
  // Safety pass: ensure every parent vertex sits well inside the coastline.
  for(var guard=0;guard<4;guard++){
    var missing=poly.filter(function(p){return !pointIn(p,coast)&&!coast.some(function(cp){return dist(cp,p)<10;});});
    if(!missing.length)break;
    missing.forEach(function(p){coast.push(outwardOffsetPoint(p,c,30+rand()*8));});
    coast=convexHull(coast.concat(poly.map(function(p){return outwardOffsetPoint(p,c,18);}))); 
  }
  return'M '+cleanPoly(coast).map(function(p){return Math.round(p.x)+' '+Math.round(p.y);}).join(' L ')+' Z';
}
function coastlineFromDistricts(polys,rand){
  var all=[];
  polys.forEach(function(poly){poly.forEach(function(p){all.push(p);});});
  if(!all.length)return'';
  // Use a convex safety shell from the final district geometry. It is less concave,
  // but guarantees the visible coast never underlaps the district border.
  var shell=convexHull(all),c=centroid(shell),coast=[];
  for(var i=0;i<shell.length;i++){
    var p=shell[i],next=shell[(i+1)%shell.length];
    coast.push(outwardOffsetPoint(p,c,26+rand()*8));
    if(dist(p,next)>100)coast.push(edgeMidpointOutward(p,next,c,22+rand()*8,10,rand));
  }
  return'M '+cleanPoly(coast).map(function(p){return Math.round(p.x)+' '+Math.round(p.y);}).join(' L ')+' Z';
}
function nearestPointsBetweenPolys(a,b){var best=null,bestD=Infinity;for(var i=0;i<a.length;i++)for(var j=0;j<b.length;j++){var d=dist(a[i],b[j]);if(d<bestD){bestD=d;best={a:a[i],b:b[j],d:d};}}return best;}
function parseSvgPathPolygon(pathText){
  var nums=String(pathText).match(/-?[0-9]+(?:[.][0-9]+)?/g)||[];
  var pts=[];
  for(var i=0;i<nums.length-1;i+=2)pts.push({x:Number(nums[i]),y:Number(nums[i+1])});
  return cleanPoly(pts);
}
function segmentIntersectsPolygon(a,b,poly){
  if(!poly||poly.length<3)return false;
  if(pointIn(lerp(a,b,.5),poly))return true;
  for(var i=0;i<poly.length;i++){
    if(segmentsCross(a,b,poly[i],poly[(i+1)%poly.length],.01))return true;
  }
  return false;
}
function bridgeCrossesIsland(a,b,islandItems,fromIndex,toIndex){
  var coastPolys=(typeof islandMasses!=='undefined'?islandMasses:[]).map(parseSvgPathPolygon);
  for(var i=0;i<islandItems.length;i++){
    if(i===fromIndex||i===toIndex)continue;
    var parent=islandItems[i]&&islandItems[i].parent;
    var coast=coastPolys[i];
    if(segmentIntersectsPolygon(a,b,coast)||segmentIntersectsPolygon(a,b,parent))return true;
  }
  return false;
}
function bridgeEndpointOnSameIslandLand(a,b,islandItems,index){
  var parent=islandItems[index]&&islandItems[index].parent;
  if(!parent)return false;
  for(var t=.18;t<.82;t+=.16){
    var p=lerp(a,b,t);
    if(pointIn(p,parent))return true;
  }
  return false;
}
function bridgeEndpointsTooClose(a,b,existingSegments){
  for(var i=0;i<existingSegments.length;i++){
    var s=existingSegments[i];
    if(dist(a,s.a)<34||dist(a,s.b)<34||dist(b,s.a)<34||dist(b,s.b)<34)return true;
  }
  return false;
}
function bridgeCrossesBridge(a,b,existingSegments){
  for(var i=0;i<existingSegments.length;i++){
    var s=existingSegments[i];
    if(segmentsCross(a,b,s.a,s.b,.01))return true;
  }
  return false;
}
function bridgeCurvePath(a,b,rand,label){
  var mid=lerp(a,b,.5),dx=b.x-a.x,dy=b.y-a.y,len=Math.max(1,Math.hypot(dx,dy));
  var local=seeded('bridge-'+Math.round(a.x)+'-'+Math.round(a.y)+'-'+Math.round(b.x)+'-'+Math.round(b.y)+'-'+(label||''));
  var useCurve=local()>.28;
  if(!useCurve)return{d:'M '+Math.round(a.x)+' '+Math.round(a.y)+' L '+Math.round(b.x)+' '+Math.round(b.y),control:mid,curved:false};
  var bend=(local()>.5?1:-1)*Math.min(38,len*(.06+local()*.08));
  var slide=(local()-.5)*Math.min(30,len*.12);
  var c={x:mid.x+(-dy/len)*bend+(dx/len)*slide,y:mid.y+(dx/len)*bend+(dy/len)*slide};
  return{d:'M '+Math.round(a.x)+' '+Math.round(a.y)+' Q '+Math.round(c.x)+' '+Math.round(c.y)+' '+Math.round(b.x)+' '+Math.round(b.y),control:c,curved:true};
}
function sampleBridgeCurve(a,b,curve){
  if(!curve||!curve.curved)return[{a:a,b:b}];
  var parts=[],prev=a;
  for(var t=.14;t<=1;t+=.14){var q1=lerp(a,curve.control,t),q2=lerp(curve.control,b,t),p=lerp(q1,q2,t);parts.push({a:prev,b:p});prev=p;}
  return parts;
}
function bridgeCurveCrossesIsland(a,b,curve,islandItems,fromIndex,toIndex){
  var parts=sampleBridgeCurve(a,b,curve);
  return parts.some(function(seg){return bridgeCrossesIsland(seg.a,seg.b,islandItems,fromIndex,toIndex);});
}
function bridgeCurveCrossesExisting(a,b,curve,existingSegments){
  var parts=sampleBridgeCurve(a,b,curve);
  return parts.some(function(seg){return bridgeCrossesBridge(seg.a,seg.b,existingSegments);});
}
function safeBridgePath(pair,islandItems,fromIndex,toIndex,rand,existingSegments){
  existingSegments=existingSegments||[];
  if(!pair)return false;
  if(bridgeEndpointsTooClose(pair.a,pair.b,existingSegments))return false;
  if(bridgeCrossesBridge(pair.a,pair.b,existingSegments))return false;
  if(bridgeCrossesIsland(pair.a,pair.b,islandItems,fromIndex,toIndex))return false;
  if(bridgeEndpointOnSameIslandLand(pair.a,pair.b,islandItems,fromIndex)||bridgeEndpointOnSameIslandLand(pair.b,pair.a,islandItems,toIndex))return false;
  var curve=bridgeCurvePath(pair.a,pair.b,rand,'main');
  if(bridgeCurveCrossesIsland(pair.a,pair.b,curve,islandItems,fromIndex,toIndex))curve=bridgeCurvePath(pair.a,pair.b,rand,'straight');
  if(bridgeCurveCrossesIsland(pair.a,pair.b,curve,islandItems,fromIndex,toIndex)||bridgeCurveCrossesExisting(pair.a,pair.b,curve,existingSegments))return false;
  return {path:curve.d,segment:{a:pair.a,b:pair.b}};
}
function rectUnionPolygon(rects){
  var edgeMap={};
  function edgeKey(a,b){return a.x+','+a.y+'|'+b.x+','+b.y;}
  function reverseKey(a,b){return b.x+','+b.y+'|'+a.x+','+a.y;}
  function addEdge(a,b){
    var k=edgeKey(a,b),rk=reverseKey(a,b);
    if(edgeMap[rk])delete edgeMap[rk];
    else edgeMap[k]={a:a,b:b};
  }
  rects.forEach(function(r){
    var p1={x:r.x0,y:r.y0},p2={x:r.x1,y:r.y0},p3={x:r.x1,y:r.y1},p4={x:r.x0,y:r.y1};
    addEdge(p1,p2);addEdge(p2,p3);addEdge(p3,p4);addEdge(p4,p1);
  });
  var keys=Object.keys(edgeMap);
  if(!keys.length)return[];
  var starts={};
  keys.forEach(function(k){var e=edgeMap[k],sk=e.a.x+','+e.a.y;if(!starts[sk])starts[sk]=[];starts[sk].push(k);});
  var first=edgeMap[keys[0]],poly=[first.a],cur=first.b;
  delete edgeMap[keys[0]];
  var guard=0;
  while(guard++<800){
    if(cur.x===poly[0].x&&cur.y===poly[0].y)break;
    poly.push(cur);
    var sk=cur.x+','+cur.y,options=starts[sk]||[],nextKey=false;
    for(var i=0;i<options.length;i++){if(edgeMap[options[i]]){nextKey=options[i];break;}}
    if(!nextKey)break;
    cur=edgeMap[nextKey].b;
    delete edgeMap[nextKey];
  }
  return cleanPoly(poly);
}

function makeDistrictPoly(x0,y0,x1,y1,island,rand){
  return cleanPoly([
    {x:x0,y:y0},
    {x:x1,y:y0},
    {x:x1,y:y1},
    {x:x0,y:y1}
  ]);
}

function islandInteriorPolygon(cfg,rand){
  var n=10+Math.floor(rand()*11);
  var pts=[];
  var warp=rand()*Math.PI*2;
  for(var i=0;i<n;i++){
    var a=Math.PI*2*i/n;
    var major=Math.sin(a*2+warp)*(.10+rand()*.06);
    var minor=Math.sin(a*5+warp*.6)*(.05+rand()*.05);
    var bite=rand()>.82?-(.10+rand()*.14):0;
    var wobble=clamp(.80+major+minor+bite+rand()*.22,.58,1.14);
    pts.push({x:cfg.cx+Math.cos(a)*cfg.rx*.76*wobble,y:cfg.cy+Math.sin(a)*cfg.ry*.76*wobble});
  }
  return cleanPoly(pts);
}

function splitWithBand(poly,axis,at,kinkOffset){
  var b=bounds(poly);
  if(axis==='x'){
    var yMid=b.minY+(b.maxY-b.minY)*.5;
    var leftTop=clipBounds(poly,b.minX,at,b.minY,yMid);
    var leftBot=clipBounds(poly,b.minX,at+kinkOffset,yMid,b.maxY);
    var rightTop=clipBounds(poly,at,b.maxX,b.minY,yMid);
    var rightBot=clipBounds(poly,at+kinkOffset,b.maxX,yMid,b.maxY);
    return [mergePieces([leftTop,leftBot]),mergePieces([rightTop,rightBot])];
  }
  var xMid=b.minX+(b.maxX-b.minX)*.5;
  var topLeft=clipBounds(poly,b.minX,xMid,b.minY,at);
  var topRight=clipBounds(poly,xMid,b.maxX,b.minY,at+kinkOffset);
  var botLeft=clipBounds(poly,b.minX,xMid,at,b.maxY);
  var botRight=clipBounds(poly,xMid,b.maxX,at+kinkOffset,b.maxY);
  return [mergePieces([topLeft,topRight]),mergePieces([botLeft,botRight])];
}
function mergePieces(pieces){
  pieces=pieces.filter(function(p){return p&&p.length>=3&&area(p)>1;});
  if(!pieces.length)return[];
  var pts=[];pieces.forEach(function(p){p.forEach(function(v){pts.push(v);});});
  return convexHull(pts);
}
function splitDistrictPoly(poly,rand){
  var b=bounds(poly);
  var w=b.maxX-b.minX;
  var h=b.maxY-b.minY;
  var vertical=w>=h;
  if(rand()>.55)vertical=!vertical;
  var axis=vertical?'x':'y';
  var at=vertical?b.minX+w*(.34+rand()*.32):b.minY+h*(.34+rand()*.32);

  function valid(parts,coverageMin){
    if(!parts||parts.length!==2)return false;
    parts=parts.filter(function(p){return p&&p.length>=3&&area(p)>1800;});
    if(parts.length!==2)return false;
    if(parts[0].length>20||parts[1].length>20)return false;
    if(!districtShapeOk(parts[0])||!districtShapeOk(parts[1]))return false;
    if(polysOverlap(parts[0],parts[1]))return false;
    var totalArea=area(parts[0])+area(parts[1]);
    if(totalArea<area(poly)*coverageMin)return false;
    return parts;
  }

  // Try a stepped shared cut first for a less perfect administrative border.
  for(var attempt=0;attempt<5;attempt++){
    var kink=(rand()-.5)*Math.min(vertical?w:h,.12*Math.max(w,h));
    var stepped=valid(splitWithBand(poly,axis,at,kink),.88);
    if(stepped)return stepped;
  }

  // Guaranteed fallback: exact complementary split, no gaps, no overlap.
  for(attempt=0;attempt<12;attempt++){
    at=vertical?b.minX+w*(.28+rand()*.44):b.minY+h*(.28+rand()*.44);
    var straight=valid(split(poly,axis,at),.995);
    if(straight)return straight;
  }
  return false;
}

function variedDistrictCells(cfg,rand){
  var parent=islandInteriorPolygon(cfg,rand);
  var target=3+Math.floor(rand()*3);
  var districts=[parent];
  var guard=0;
  while(districts.length<target&&guard++<140){
    var largestIndex=0;
    for(var i=1;i<districts.length;i++){
      if(area(districts[i])>area(districts[largestIndex]))largestIndex=i;
    }
    var candidate=districts[largestIndex];
    var splitResult=false;
    for(var tries=0;tries<24&&!splitResult;tries++){ 
      splitResult=splitDistrictPoly(candidate,rand);
    }
    if(!splitResult){
      // Last-resort split on the largest district using its dominant axis.
      var cb=bounds(candidate),axis=(cb.maxX-cb.minX)>=(cb.maxY-cb.minY)?'x':'y',mid=axis==='x'?(cb.minX+cb.maxX)/2:(cb.minY+cb.maxY)/2;
      splitResult=split(candidate,axis,mid).filter(function(p){return districtShapeOk(p);});
      if(splitResult.length!==2)break;
    }
    districts.splice(largestIndex,1,splitResult[0],splitResult[1]);
  }
  var result=districts.map(function(poly){
    poly=cleanPoly(poly);
    var b=bounds(poly);
    return{poly:poly,x0:b.minX,y0:b.minY,x1:b.maxX,y1:b.maxY};
  }).filter(function(d){
    return districtShapeOk(d.poly);
  });
  result.parent=parent;
  return result;
}

function makeIslandConfigs(islandCount,rand){
  var configs=[];
  var kinds=['main','long','compact','peninsula','islet'];
  var angle=-.18+rand()*.36;
  var step=330+rand()*70;
  var origin={x:240+rand()*80,y:310+rand()*90};
  for(var idx=0;idx<islandCount;idx++){
    var along=idx*step;
    var lateral=(idx%2===0?-1:1)*(70+rand()*70);
    var cfg={
      cx:origin.x+Math.cos(angle)*along-Math.sin(angle)*lateral,
      cy:origin.y+Math.sin(angle)*along+Math.cos(angle)*lateral,
      rx:165+rand()*105,
      ry:170+rand()*120,
      kind:kinds[Math.floor(rand()*kinds.length)]
    };
    if(cfg.kind==='long'){if(rand()>.5)cfg.rx*=1.34;else cfg.ry*=1.34;}
    if(cfg.kind==='compact'){cfg.rx*=.82;cfg.ry*=.82;}
    if(cfg.kind==='islet'){cfg.rx*=.68;cfg.ry*=.68;}
    configs.push(cfg);
  }
  for(var pass=0;pass<20;pass++){
    for(var i=0;i<configs.length;i++){
      for(var j=i+1;j<configs.length;j++){
        var a=configs[i],b=configs[j];
        var minGap=(Math.max(a.rx,a.ry)+Math.max(b.rx,b.ry))*.82+70;
        var d=dist(a,b);
        if(d<minGap){
          var dx=(b.cx-a.cx)/Math.max(1,d),dy=(b.cy-a.cy)/Math.max(1,d);
          var push=(minGap-d)*.5;
          a.cx-=dx*push;a.cy-=dy*push;
          b.cx+=dx*push;b.cy+=dy*push;
        }
      }
    }
  }
  var minX=Math.min.apply(null,configs.map(function(c){return c.cx-c.rx;}));
  var maxX=Math.max.apply(null,configs.map(function(c){return c.cx+c.rx;}));
  var minY=Math.min.apply(null,configs.map(function(c){return c.cy-c.ry;}));
  var maxY=Math.max.apply(null,configs.map(function(c){return c.cy+c.ry;}));
  var safePad=44;
  var targetW=1120-safePad*2,targetH=820-safePad*2;
  var scale=Math.min(targetW/Math.max(1,maxX-minX),targetH/Math.max(1,maxY-minY));
  configs.forEach(function(c){
    c.cx=(c.cx-minX)*scale+safePad;
    c.cy=(c.cy-minY)*scale+safePad;
    c.rx*=scale;
    c.ry*=scale;
  });
  return configs;
}
function transformIslandItem(item,dx,dy,scale){
  function tp(p){return{x:p.x*scale+dx,y:p.y*scale+dy};}
  item.parent=item.parent.map(tp);
  item.districts=item.districts.map(function(poly){return poly.map(tp);});
  return item;
}
function repelIslandItems(items){
  for(var pass=0;pass<26;pass++){
    for(var i=0;i<items.length;i++){
      for(var j=i+1;j<items.length;j++){
        var a=items[i],b=items[j],ca=centroid(a.parent),cb=centroid(b.parent);
        var ba=bounds(expandPolygon(a.parent,52,'repel-a-'+pass)),bb=bounds(expandPolygon(b.parent,52,'repel-b-'+pass));
        var ra=Math.max(ba.maxX-ba.minX,ba.maxY-ba.minY)*.5;
        var rb=Math.max(bb.maxX-bb.minX,bb.maxY-bb.minY)*.5;
        var d=dist(ca,cb),needed=ra+rb+14;
        if(d<needed){
          var dx=(cb.x-ca.x)/Math.max(1,d),dy=(cb.y-ca.y)/Math.max(1,d),push=(needed-d)*.54;
          transformIslandItem(a,-dx*push,-dy*push,1);
          transformIslandItem(b,dx*push,dy*push,1);
        }
      }
    }
  }
  return items;
}
function fitIslandItemsToView(items){
  var pts=[];
  items.forEach(function(item){
    var coast=expandPolygon(item.parent,50,'fit-coast');
    coast.forEach(function(p){pts.push(p);});
  });
  if(!pts.length)return items;
  var b=bounds(pts),pad=38;
  var scale=Math.min((1120-pad*2)/Math.max(1,b.maxX-b.minX),(820-pad*2)/Math.max(1,b.maxY-b.minY));
  var contentW=(b.maxX-b.minX)*scale,contentH=(b.maxY-b.minY)*scale;
  var dx=(1120-contentW)/2-b.minX*scale;
  var dy=(820-contentH)/2-b.minY*scale;
  return items.map(function(item){return transformIslandItem(item,dx,dy,scale);});
}
function pick(arr,rand){return arr[Math.floor(rand()*arr.length)];}
function makeMapCityName(rand){
  var prefixes=['New','Port','Saint','Old','North','South','East','West','Grand','Black','Red','Silver','Crown','Iron','Liberty','Ash'];
  var roots=['Bordeaux','Moreau','Valence','Rocca','Bellmont','Marino','Kingsport','Gravesend','Locke','Bayside','Aurelia','Harbor','Foundry','Rook','Vesper','Caldera'];
  var suffixes=['Bay','City','Harbor','Basin','Sound','Point','Port','Borough','Keys','Reach'];
  return pick(prefixes,rand)+' '+pick(roots,rand)+' '+pick(suffixes,rand);
}
function makeIslandName(rand,index,used){
  used=used||{};
  var first=['Saint','Crown','Iron','Fox','Raven','Ash','Harbor','Garden','Union','Marble','Red','Black','Silver','Old','King','Viper','Coal','Ferry'];
  var second=['Isle','Island','Bank','Reach','Key','Cay','Point','Shoal','Ward','Landing','Hook','Crest'];
  for(var i=0;i<40;i++){
    var name=pick(first,rand)+' '+pick(second,rand);
    if(!used[name]){used[name]=true;return name;}
  }
  return 'Island '+(index+1);
}
function makeDistrictName(rand,profile,usedNames){
  usedNames=usedNames||{};
  var coastal=['Harbor','Wharf','Quay','Bay','Dock','Pier','Landing','Tide','Canal','Ferry','Marina','Shore','Cove','Salt'];
  var industrial=['Iron','Foundry','Mill','Rail','Union','Factory','Brick','Coal','Steel','Yard','Works','Grain','Freight','Depot','Forge'];
  var wealthy=['Grand','Golden','Crown','Kings','Queens','Emerald','Marble','Oak','Cedar','Garden','Park','Heights','Estate','Vista','Silver'];
  var old=['Old','Saint','Fort','New','Lower','Upper','East','West','North','South','Little','Red','Black','White','Grey','Market'];
  var gritty=['Crow','Wolf','Viper','Rook','Ash','Shadow','Raven','Fox','Smoke','Grave'];
  var roots=['Gate','Haven','Field','Cross','Bridge','Ford','Market','Point','Crest','View','Hill','Bank','Yard','Square','Row','Bend','Grove','Ridge','Station','Plaza','Junction','Ward','Park','Pier','Docks','Works','Wharf'];
  var suffixes=['',' Heights',' Point',' Gardens',' Ward',' Quarter',' Commons',' Row',' Market',' Docks',' Yard',' Works',' Park',' Plaza',' Landing',' Wharf'];
  var pool=old.slice();
  if(profile==='coastal')pool=pool.concat(coastal,coastal,gritty);
  else if(profile==='industrial')pool=pool.concat(industrial,industrial,coastal,gritty);
  else if(profile==='wealthy')pool=pool.concat(wealthy,wealthy,old);
  else if(profile==='gritty')pool=pool.concat(gritty,gritty,industrial,coastal);
  else pool=pool.concat(coastal,industrial,wealthy,gritty);
  function attempt(){
    var format=Math.floor(rand()*7);
    var a=pick(pool,rand),b=pick(roots,rand),s=pick(suffixes,rand);
    if(format===0)return a+' '+b;
    if(format===1)return a+' '+b;
    if(format===2)return a+' '+pick(['Ward','Quarter','Market','Docks','Yard','Heights'],rand);
    if(format===3)return b+s;
    if(format===4)return pick(['Saint','Fort','Port','New','Old'],rand)+' '+a;
    if(format===5)return a+' '+pick(['Bend','Cross','Reach','End'],rand);
    return a+' '+b;
  }
  for(var i=0;i<60;i++){
    var name=attempt().split(' ').filter(Boolean).join(' ').trim();
    if(name.length>22)continue;
    if(!usedNames[name]){usedNames[name]=true;return name;}
  }
  var fallback='District '+(Object.keys(usedNames).length+1);
  usedNames[fallback]=true;
  return fallback;
}
function districtCompactness(poly){
  var b=bounds(poly),w=b.maxX-b.minX,h=b.maxY-b.minY;
  if(w<=0||h<=0)return 0;
  var slimness=Math.min(w,h)/Math.max(w,h);
  var fill=area(poly)/(w*h);
  return slimness*fill;
}
function districtShapeOk(poly){
  if(!poly||poly.length<4||poly.length>20)return false;
  var ar=area(poly);if(ar<4200)return false;
  var b=bounds(poly),w=b.maxX-b.minX,h=b.maxY-b.minY;
  var slimness=Math.min(w,h)/Math.max(w,h);
  var fill=ar/Math.max(1,w*h);
  if(slimness<.34)return false;
  if(fill<.38)return false;
  if(districtCompactness(poly)<.20)return false;
  return true;
}
function districtProfileFromStats(wealth,police,corruption,rand){
  if(wealth>72)return 'wealthy';
  if(corruption>68||police<45)return 'gritty';
  if(rand()>.58)return 'coastal';
  return 'industrial';
}
function generateProceduralCity(seed){var rand=seeded(seed||('city-'+Date.now()));var usedDistrictNames={};var usedIslandNames={};state.mapName=makeMapCityName(rand);state.islandNames=[];var archetypes=[['Dockside',42,53,66],['Riverside',61,47,57],['South Yards',35,42,70],['Little Italy',58,44,72],['Financial Ward',88,74,36],['Old Town',52,48,63],['Midtown',73,58,49],['Ironworks',39,38,68],['Railhead',46,43,66],['Uptown',82,66,41],['Garden Heights',79,63,38],['Municipal Airport',69,71,44],['Red Hook',41,49,69],['Market Row',62,45,58],['Warehouse Point',38,40,73],['Theater Mile',76,57,51],['Tenement Ward',33,45,76],['Canal Quarter',55,50,62]];var islandCount=2+Math.floor(rand()*3),configs=makeIslandConfigs(islandCount,rand);mapDistricts={};var districtRows=[],idx=0,islandPolys=[];configs.forEach(function(cfg,islandIndex){var cells=variedDistrictCells(cfg,rand),parentPoly=cells.parent,polysForIsland=[];cells.forEach(function(cell){var poly=cell.poly||makeDistrictPoly(cell.x0,cell.y0,cell.x1,cell.y1,cfg,rand);if(area(poly)<2500)return;polysForIsland.push(poly);var arch=archetypes[idx%archetypes.length],id='district_'+idx,wealth=clamp(Math.round(arch[1]+(rand()-.5)*18),20,95),police=clamp(Math.round(arch[2]+(rand()-.5)*16),20,90),corruption=clamp(Math.round(arch[3]+(rand()-.5)*18),20,90),profile=districtProfileFromStats(wealth,police,corruption,rand),name=makeDistrictName(rand,profile,usedDistrictNames),label=name.split(' ').slice(0,2).join(' '),ce=centroid(poly);mapDistricts[id]={island:'Island '+(islandIndex+1),label:label,points:pointsToString(poly),cx:Math.round(ce.x),cy:Math.round(ce.y)};districtRows.push([id,name,wealth,police,corruption,clamp(Math.round(8+rand()*34),5,48),clamp(Math.round(35+rand()*45),20,85),clamp(Math.round(rand()*18),0,28),clamp(Math.round(12+rand()*36),5,60)]);idx++;});islandPolys.push({districts:polysForIsland,parent:parentPoly||polysForIsland[0]});});if(districtRows.length<6){var fallbackRand=seeded(seed+'-fallback');while(districtRows.length<6){var n=districtRows.length,fx=180+(n%3)*260+(fallbackRand()-.5)*40,fy=220+Math.floor(n/3)*230+(fallbackRand()-.5)*40,fw=150+fallbackRand()*80,fh=130+fallbackRand()*80,fpoly=[{x:fx,y:fy},{x:fx+fw,y:fy},{x:fx+fw,y:fy+fh},{x:fx,y:fy+fh}],fid='district_'+n,fname=makeDistrictName(rand,'mixed',usedDistrictNames),fce=centroid(fpoly);mapDistricts[fid]={island:'Fallback Island',label:fname.split(' ').slice(0,2).join(' '),points:pointsToString(fpoly),cx:Math.round(fce.x),cy:Math.round(fce.y)};districtRows.push([fid,fname,50,50,55,18,50,0,25]);islandPolys.push({districts:[fpoly],parent:fpoly});}}
islandPolys=fitIslandItemsToView(repelIslandItems(islandPolys.filter(function(item){return item&&item.parent&&item.parent.length;})));
islandPolys=fitIslandItemsToView(repelIslandItems(islandPolys));
state.islandNames=islandPolys.map(function(_,i){return makeIslandName(rand,i,usedIslandNames);});
mapDistricts={};districtRows=[];idx=0;islandPolys.forEach(function(item,islandIndex){item.districts.forEach(function(poly){var arch=archetypes[idx%archetypes.length],id='district_'+idx,wealth=clamp(Math.round(arch[1]+(rand()-.5)*18),20,95),police=clamp(Math.round(arch[2]+(rand()-.5)*16),20,90),corruption=clamp(Math.round(arch[3]+(rand()-.5)*18),20,90),profile=districtProfileFromStats(wealth,police,corruption,rand),name=makeDistrictName(rand,profile,usedDistrictNames),label=name.split(' ').slice(0,2).join(' '),ce=centroid(poly);mapDistricts[id]={island:'Island '+(islandIndex+1),label:label,points:pointsToString(poly),cx:Math.round(ce.x),cy:Math.round(ce.y)};districtRows.push([id,name,wealth,police,corruption,clamp(Math.round(8+rand()*34),5,48),clamp(Math.round(35+rand()*45),20,85),clamp(Math.round(rand()*18),0,28),clamp(Math.round(12+rand()*36),5,60)]);idx++;});});
islandMasses=islandPolys.map(function(item){return coastlineFromDistricts(item.districts,rand);});mapBridges=[];var bridgeSegments=[];for(var bi=0;bi<islandPolys.length-1;bi++){if(!islandPolys[bi]||!islandPolys[bi+1])continue;var aHull=convexHull(islandPolys[bi].parent||[].concat.apply([],islandPolys[bi].districts||[])),bHull=convexHull(islandPolys[bi+1].parent||[].concat.apply([],islandPolys[bi+1].districts||[])),pair=nearestPointsBetweenPolys(aHull,bHull);if(pair&&pair.d<430){var bridge=safeBridgePath(pair,islandPolys,bi,bi+1,rand,bridgeSegments);if(bridge){mapBridges.push(bridge.path);bridgeSegments.push(bridge.segment);}if(rand()>.55){var candidates=[];for(var ca=0;ca<aHull.length;ca++)for(var cb=0;cb<bHull.length;cb++){var dd=dist(aHull[ca],bHull[cb]);if(dd<500&&dd>pair.d*.82)candidates.push({a:aHull[ca],b:bHull[cb],d:dd});}candidates.sort(function(a,b){return a.d-b.d;});for(var ci=0;ci<Math.min(8,candidates.length);ci++){var bridge2=safeBridgePath(candidates[ci],islandPolys,bi,bi+1,rand,bridgeSegments);if(bridge2){mapBridges.push(bridge2.path);bridgeSegments.push(bridge2.segment);break;}}}}}
state.districts=districtRows.map(function(a){return{id:a[0],name:a[1],wealth:a[2],police:a[3],corruption:a[4],fear:a[5],order:a[6],control:a[7],rival:a[8]};});state.selected=state.districts[0].id;state.selectedBlock='';state.selectedParcel='';state.familyAssignments=null;state.tab='Dashboard';state.stopReason='Generated city seed: '+seed;layouts={};if(!state.mapName)state.mapName=mapCityName;
if(!state.islandNames)state.islandNames=islandNames.slice();
runParcelTests();render();}
function makeParcel(polygon,blockId,index,d,rand,frontage,depth,accessKind){var ar=area(polygon),owners=['unknown','neutral','neutral','neutral','player','rival','police'],kinds=frontage<18?['shop','bar','office','tenement','cafe']:frontage>44?['warehouse','garage','yard','club','market']:['shop','garage','bar','office','club','laundry','cafe'],bn=blockId.split('_b')[1]||'0',ratio=frontage/Math.max(1,depth),shape=polygon.length>=6?'irregular parcel':ratio>1.3?'wide rectangle lot':ratio<.72?'deep rectangle lot':rand()>.6?'trapezoid lot':'rectangle lot';return{id:blockId+'_p'+index,blockId:blockId,label:bn+'-'+(index+1),kind:kinds[Math.floor(rand()*kinds.length)],polygon:cleanPoly(polygon),size:ar>2600?4:ar>1600?3:ar>800?2:1,value:Math.round(d.wealth*ar/1350*(.55+rand()*.42)),heat:Math.round(d.police*(.28+rand()*.72)),occupiedBy:owners[Math.floor(rand()*owners.length)],familyId:'',isHQ:false,shape:shape,frontage:Math.round(frontage),depth:Math.round(depth),streetAccess:true,accessKind:accessKind};}
function ensureFamilyAssignments(){
  if(state.familyAssignments)return state.familyAssignments;
  var rand=seeded('family-assignments-'+state.districts.map(function(d){return d.id;}).join('|'));
  var districtIds=state.districts.map(function(d){return d.id;});
  var familyIds=families.map(function(f){return f.id;});
  function shuffle(arr){
    var out=arr.slice();
    for(var i=out.length-1;i>0;i--){var j=Math.floor(rand()*(i+1)),tmp=out[i];out[i]=out[j];out[j]=tmp;}
    return out;
  }
  districtIds=shuffle(districtIds);
  familyIds=shuffle(familyIds);
  var count=Math.min(familyIds.length,districtIds.length);
  var assignments={};
  for(var i=0;i<count;i++)assignments[districtIds[i]]=familyIds[i];
  state.familyAssignments=assignments;
  return assignments;
}
function assignFamilyHQs(layout,d){
  if(!layout||layout.familyAssigned)return layout;
  var assignments=ensureFamilyAssignments();
  var familyId=assignments[d.id];
  layout.familyHQs=[];
  if(!familyId){layout.familyAssigned=true;return layout;}
  var rand=seeded('family-hq-'+d.id+'-'+familyId);
  var all=[];
  layout.blocks.forEach(function(b){b.parcels.forEach(function(p){all.push({block:b,parcel:p,point:centroid(p.polygon)});});});
  if(!all.length){layout.familyAssigned=true;return layout;}
  var family=families.find(function(f){return f.id===familyId;})||families[0];
  var bb=bounds(layout.outerPolygon);
  var anchor={x:bb.minX+(bb.maxX-bb.minX)*(.22+rand()*.56),y:bb.minY+(bb.maxY-bb.minY)*(.22+rand()*.56)};
  var candidates=all.filter(function(item){return item.parcel.size>=2;});
  if(!candidates.length)candidates=all;
  candidates.sort(function(a,bp){return dist(a.point,anchor)-dist(bp.point,anchor);});
  var chosen=candidates[0];
  if(chosen){
    chosen.parcel.familyId=family.id;
    chosen.parcel.occupiedBy=family.id;
    chosen.parcel.isHQ=true;
    chosen.parcel.kind='headquarters';
    var near=all.filter(function(item){return item.parcel!==chosen.parcel&&!item.parcel.familyId;}).sort(function(a,bp){return dist(a.point,chosen.point)-dist(bp.point,chosen.point);})[0];
    if(near){near.parcel.familyId=family.id;near.parcel.occupiedBy=family.id;}
    layout.familyHQs.push({familyId:family.id,name:family.name,short:family.short,color:family.color,blockId:chosen.block.id,parcelId:chosen.parcel.id,point:chosen.point});
  }
  layout.familyAssigned=true;
  return layout;
}
function subdivideBlockIntoZones(blockPoly,rand){var c=centroid(blockPoly),b=bounds(blockPoly),w=b.maxX-b.minX,h=b.maxY-b.minY,xCut=clamp(c.x+(rand()-.5)*w*.24,b.minX+w*.28,b.maxX-w*.28),yCut=clamp(c.y+(rand()-.5)*h*.24,b.minY+h*.28,b.maxY-h*.28);return[clipBounds(blockPoly,b.minX,xCut,b.minY,yCut),clipBounds(blockPoly,xCut,b.maxX,b.minY,yCut),clipBounds(blockPoly,b.minX,xCut,yCut,b.maxY),clipBounds(blockPoly,xCut,b.maxX,yCut,b.maxY)].map(cleanPoly).filter(function(z){return z.length>=3&&area(z)>120;});}
function zoneParcels(zonePoly,blockId,d,rand,startIndex){var z=cleanPoly(zonePoly),b=bounds(z),w=b.maxX-b.minX,h=b.maxY-b.minY,splitVertical=w>=h*.85,span=splitVertical?w:h,target=clamp(21-(d.wealth-50)*.045+(rand()-.5)*5,12,28),count=clamp(Math.round(span/target),3,Math.max(3,Math.floor(span/10))),weights=Array.from({length:count},function(){var r=rand();return r>.84?1.75+rand()*.7:r<.16?.55+rand()*.35:.85+rand()*.75;}),total=weights.reduce(function(s,v){return s+v;},0),cuts=[splitVertical?b.minX:b.minY],cursor=cuts[0];for(var i=0;i<count;i++){cursor+=span*weights[i]/total;cuts.push(cursor);}cuts[cuts.length-1]=splitVertical?b.maxX:b.maxY;var out=[];for(i=0;i<cuts.length-1;i++){var cell=splitVertical?clipBounds(z,cuts[i],cuts[i+1],b.minY,b.maxY):clipBounds(z,b.minX,b.maxX,cuts[i],cuts[i+1]);cell=cleanPoly(cell);if(cell.length>=3&&area(cell)>80){var cb=bounds(cell),frontage=splitVertical?cb.maxX-cb.minX:cb.maxY-cb.minY,depth=splitVertical?cb.maxY-cb.minY:cb.maxX-cb.minX;out.push(makeParcel(cell,blockId,startIndex+out.length,d,rand,frontage,depth,'outer road / internal street'));}}return out;}
function borderCutParcels(blockPoly,blockId,d,rand,rect){var r=rect||bounds(blockPoly),w=r.maxX-r.minX,h=r.maxY-r.minY,eps=1.8;function sideExists(side){var pts=[];for(var i=0;i<blockPoly.length;i++){var p=blockPoly[i];if(side==='top'&&Math.abs(p.y-r.minY)<eps)pts.push(p.x);if(side==='bottom'&&Math.abs(p.y-r.maxY)<eps)pts.push(p.x);if(side==='left'&&Math.abs(p.x-r.minX)<eps)pts.push(p.y);if(side==='right'&&Math.abs(p.x-r.maxX)<eps)pts.push(p.y);}return pts.length>=2&&Math.max.apply(null,pts)-Math.min.apply(null,pts)>14;}var hasTop=sideExists('top'),hasBottom=sideExists('bottom'),hasLeft=sideExists('left'),hasRight=sideExists('right'),useHorizontal=(hasTop&&hasBottom)||(!(hasLeft&&hasRight)&&w>=h),sides=[];if(useHorizontal){if(hasTop)sides.push({side:'top',vertical:false,band:{minX:r.minX,maxX:r.maxX,minY:r.minY,maxY:hasBottom?r.minY+h*.5:r.maxY}});if(hasBottom)sides.push({side:'bottom',vertical:false,band:{minX:r.minX,maxX:r.maxX,minY:hasTop?r.minY+h*.5:r.minY,maxY:r.maxY}});}else{if(hasLeft)sides.push({side:'left',vertical:true,band:{minX:r.minX,maxX:hasRight?r.minX+w*.5:r.maxX,minY:r.minY,maxY:r.maxY}});if(hasRight)sides.push({side:'right',vertical:true,band:{minX:hasLeft?r.minX+w*.5:r.minX,maxX:r.maxX,minY:r.minY,maxY:r.maxY}});}if(!sides.length){if(hasTop)sides.push({side:'top',vertical:false,band:{minX:r.minX,maxX:r.maxX,minY:r.minY,maxY:r.maxY}});else if(hasBottom)sides.push({side:'bottom',vertical:false,band:{minX:r.minX,maxX:r.maxX,minY:r.minY,maxY:r.maxY}});else if(hasLeft)sides.push({side:'left',vertical:true,band:{minX:r.minX,maxX:r.maxX,minY:r.minY,maxY:r.maxY}});else if(hasRight)sides.push({side:'right',vertical:true,band:{minX:r.minX,maxX:r.maxX,minY:r.minY,maxY:r.maxY}});}if(!sides.length){var bb=bounds(blockPoly);return[makeParcel(blockPoly,blockId,0,d,rand,Math.min(bb.maxX-bb.minX,bb.maxY-bb.minY),Math.max(bb.maxX-bb.minX,bb.maxY-bb.minY),'rear district cut - no street frontage')];}var out=[];sides.forEach(function(sideDef){var bandRect=[{x:sideDef.band.minX,y:sideDef.band.minY},{x:sideDef.band.maxX,y:sideDef.band.minY},{x:sideDef.band.maxX,y:sideDef.band.maxY},{x:sideDef.band.minX,y:sideDef.band.maxY}],span=sideDef.vertical?sideDef.band.maxY-sideDef.band.minY:sideDef.band.maxX-sideDef.band.minX,target=clamp(15-(d.wealth-50)*.03+(rand()-.5)*3,9,22),count=clamp(Math.round(span/target),3,Math.max(3,Math.floor(span/8))),weights=Array.from({length:count},function(){var q=rand();return q>.84?1.45+rand()*.4:q<.18?.65+rand()*.25:.85+rand()*.5;}),total=weights.reduce(function(s,v){return s+v;},0),cuts=[sideDef.vertical?sideDef.band.minY:sideDef.band.minX],cursor=cuts[0];for(var i=0;i<count;i++){cursor+=span*weights[i]/total;cuts.push(cursor);}cuts[cuts.length-1]=sideDef.vertical?sideDef.band.maxY:sideDef.band.maxX;for(i=0;i<cuts.length-1;i++){var fullCell=sideDef.vertical?clipBounds(bandRect,sideDef.band.minX,sideDef.band.maxX,cuts[i],cuts[i+1]):clipBounds(bandRect,cuts[i],cuts[i+1],sideDef.band.minY,sideDef.band.maxY),clipped=cleanPoly(intersectConvex(fullCell,blockPoly));if(clipped.length<3||area(clipped)<=35)continue;var cb=bounds(clipped),frontage=sideDef.vertical?cb.maxY-cb.minY:cb.maxX-cb.minX,depth=sideDef.vertical?cb.maxX-cb.minX:cb.maxY-cb.minY;if(frontage<5||depth<5)continue;var parcel=makeParcel(clipped,blockId,out.length,d,rand,frontage,depth,'visual street frontage: '+sideDef.side+'; rear clipped by district border');if(!out.some(function(existing){return polysOverlap(existing.polygon,parcel.polygon);}))out.push(parcel);}});return out.slice(0,42);}
function isBorderCutBlock(poly,rectArea){return area(poly)<rectArea*.92||poly.length!==4;}function parcelize(poly,blockId,d,rand,isCut,rect){var blockPoly=cleanPoly(poly);if(isCut)return borderCutParcels(blockPoly,blockId,d,rand,rect);var zones=subdivideBlockIntoZones(blockPoly,rand),parcels=[];for(var i=0;i<zones.length;i++)parcels=parcels.concat(zoneParcels(zones[i],blockId,d,rand,parcels.length));return parcels.slice(0,32);}
function roadKind(index,total,axis,d,rand){
  var center=Math.floor(total/2);
  if(index===center)return'avenue';
  if(total>7&&(index===Math.floor(total*.25)||index===Math.floor(total*.75)))return'collector';
  if(d.wealth>72&&rand()>.78)return'collector';
  return'minor';
}
function roadWidth(kind,rand){
  if(kind==='avenue')return 26+Math.round(rand()*8);
  if(kind==='collector')return 16+Math.round(rand()*4);
  return 9+Math.round(rand()*4);
}
function roadName(rand,kind){
  var a=['Market','Union','King','Harbor','Crown','Foundry','Canal','Oak','Iron','Garden','Liberty','Station','Grand','Ash','River','Central'];
  var b=kind==='avenue'?['Avenue','Boulevard','Way','Drive']:['Street','Road','Lane','Row'];
  return pick(a,rand)+' '+pick(b,rand);
}
function pointAlongRoad(road,t){
  var a=road.a,b=road.b;
  return{x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t};
}
function lampPostsForBlock(poly,rand){
  var out=[];
  for(var i=0;i<poly.length;i++){
    var a=poly[i],b=poly[(i+1)%poly.length],len=dist(a,b);
    if(len<34)continue;
    var count=Math.max(1,Math.floor(len/(28+rand()*12)));
    for(var j=1;j<=count;j++){
      var t=j/(count+1),p=lerp(a,b,t);
      out.push({x:p.x,y:p.y});
    }
  }
  return out;
}
function medianDecorForRoad(road,rand){
  if(road.kind!=='avenue')return{path:'',items:[]};
  var dx=road.b.x-road.a.x,dy=road.b.y-road.a.y,len=Math.max(1,Math.hypot(dx,dy));
  var inset=Math.min(38,len*.08);
  var a={x:road.a.x+dx/len*inset,y:road.a.y+dy/len*inset};
  var b={x:road.b.x-dx/len*inset,y:road.b.y-dy/len*inset};
  var path='M '+a.x.toFixed(1)+' '+a.y.toFixed(1)+' L '+b.x.toFixed(1)+' '+b.y.toFixed(1);
  var items=[],count=Math.max(6,Math.floor((len-inset*2)/25));
  for(var i=1;i<=count;i++){
    var p=lerp(a,b,i/(count+1));
    items.push({x:p.x,y:p.y,type:'tree'});
  }
  return{path:path,items:items};
}
function crosswalksForRoads(roads){
  var out=[];
  var vertical=roads.filter(function(r){return Math.abs(r.a.x-r.b.x)<Math.abs(r.a.y-r.b.y);});
  var horizontal=roads.filter(function(r){return Math.abs(r.a.y-r.b.y)<Math.abs(r.a.x-r.b.x);});
  function allowed(a,b){return (a.kind==='avenue'&&(b.kind==='avenue'||b.kind==='collector'))||(b.kind==='avenue'&&(a.kind==='avenue'||a.kind==='collector'));}
  function addBandAcrossVerticalAvenue(x,y,sideOffset,avenueWidth){
    var half=avenueWidth*.28;
    for(var k=-3;k<=3;k++){
      var yy=y+sideOffset+k*1.9;
      out.push({x1:x-half,x2:x+half,y1:yy,y2:yy});
    }
  }
  function addBandAcrossHorizontalAvenue(x,y,sideOffset,avenueWidth){
    var half=avenueWidth*.28;
    for(var k=-3;k<=3;k++){
      var xx=x+sideOffset+k*1.9;
      out.push({x1:xx,x2:xx,y1:y-half,y2:y+half});
    }
  }
  vertical.forEach(function(v){
    horizontal.forEach(function(h){
      if(!allowed(v,h))return;
      var x=v.a.x,y=h.a.y;
      var inV=y>=Math.min(v.a.y,v.b.y)-4&&y<=Math.max(v.a.y,v.b.y)+4;
      var inH=x>=Math.min(h.a.x,h.b.x)-4&&x<=Math.max(h.a.x,h.b.x)+4;
      if(!inV||!inH)return;
      if(v.kind==='avenue'){
        var side=(h.width||14)*.5+4;
        addBandAcrossVerticalAvenue(x,y-side,v.width||28);
        addBandAcrossVerticalAvenue(x,y+side,v.width||28);
      }
      if(h.kind==='avenue'){
        var side2=(v.width||14)*.5+4;
        addBandAcrossHorizontalAvenue(x-side2,y,h.width||28);
        addBandAcrossHorizontalAvenue(x+side2,y,h.width||28);
      }
    });
  });
  return out;
}
function layout(d){if(layouts[d.id])return layouts[d.id];var rand=seeded(d.id),op=outer(d),b=bounds(op),w=b.maxX-b.minX,h=b.maxY-b.minY,districtArea=area(op),boxArea=w*h,fillRatio=districtArea/Math.max(1,boxArea),slimness=Math.min(w,h)/Math.max(1,Math.max(w,h)),largeBoost=clamp((districtArea-90000)/120000,0,1.25),slimPenalty=slimness<.55?.72:slimness<.7?.86:1,raggedPenalty=fillRatio<.62?.82:fillRatio<.76?.92:1,densityFactor=clamp((1+largeBoost)*slimPenalty*raggedPenalty,.58,1.55),cols=Math.max(4,Math.min(18,Math.round((w/68)*densityFactor)+(d.wealth>72&&densityFactor>.9?1:0))),rows=Math.max(3,Math.min(14,Math.round((h/72)*densityFactor)+(d.order>68&&densityFactor>.9?1:0)));if(slimness<.52){if(w>h){rows=Math.max(3,Math.min(rows,6));cols=Math.max(cols,8);}else{cols=Math.max(4,Math.min(cols,7));rows=Math.max(rows,8);}}var xs=makeCuts(b.minX,b.maxX,cols,rand),ys=makeCuts(b.minY,b.maxY,rows,rand),blocks=[];for(var r=0;r<ys.length-1;r++)for(var c=0;c<xs.length-1;c++){var rectArea=(xs[c+1]-xs[c])*(ys[r+1]-ys[r]),cl=clipBounds(op,xs[c],xs[c+1],ys[r],ys[r+1]);if(cl.length>=3&&area(cl)>Math.max(360,area(op)/260))blocks.push({polygon:cl,isCut:isBorderCutBlock(cl,rectArea),rect:{minX:xs[c],maxX:xs[c+1],minY:ys[r],maxY:ys[r+1]}});}var roads=xs.slice(1,-1).map(function(x,i){var kind=roadKind(i,xs.length-2,'v',d,rand),a={x:x,y:b.minY-24},bb={x:x,y:b.maxY+24};return{id:'v'+i,path:'M '+a.x.toFixed(1)+' '+a.y.toFixed(1)+' L '+bb.x.toFixed(1)+' '+bb.y.toFixed(1),a:a,b:bb,width:roadWidth(kind,rand),kind:kind,name:kind==='minor'?'':roadName(rand,kind)};}).concat(ys.slice(1,-1).map(function(y,i){var kind=roadKind(i,ys.length-2,'h',d,rand),a={x:b.minX-24,y:y},bb={x:b.maxX+24,y:y};return{id:'h'+i,path:'M '+a.x.toFixed(1)+' '+a.y.toFixed(1)+' L '+bb.x.toFixed(1)+' '+bb.y.toFixed(1),a:a,b:bb,width:roadWidth(kind,rand),kind:kind,name:kind==='minor'?'':roadName(rand,kind)};}));var maxBlocks=Math.min(180,blocks.length);var bl=blocks.slice(0,maxBlocks).map(function(block,i){var id=d.id+'_b'+i,p=block.polygon,parcels=parcelize(p,id,d,rand,block.isCut,block.rect);return{id:id,label:'Block '+String.fromCharCode(65+i),polygon:p,isCut:block.isCut,rect:block.rect,pressure:Math.round((d.fear+d.rival+d.police)/3+rand()*12),parcels:parcels,lamps:lampPostsForBlock(p,rand)};});var lm=['Precinct','Market','Club'].map(function(label,i){for(var a=0;a<18;a++){var pt={x:b.minX+(b.maxX-b.minX)*(.24+rand()*.52),y:b.minY+(b.maxY-b.minY)*(.22+rand()*.56)};if(pointIn(pt,op))return{id:'lm'+i,label:label,point:pt};}return{id:'lm'+i,label:label,point:centroid(op)};});var medians=[];roads.forEach(function(r){var decor=medianDecorForRoad(r,rand);if(decor.path)medians.push({roadId:r.id,path:decor.path,items:decor.items});});var result={outerPolygon:op,roads:roads,blocks:bl,landmarks:lm,medians:medians,crosswalks:crosswalksForRoads(roads),familyHQs:[],familyAssigned:false};assignFamilyHQs(result,d);return layouts[d.id]=result;}
function districtMapArea(id){var fallbackKey=Object.keys(mapDistricts)[0]||'dockside';var s=mapDistricts[id]?mapDistricts[id].points:mapDistricts[fallbackKey].points;return Math.round(area(parsePoints(s)));}
function polygonValid(poly){return Array.isArray(poly)&&poly.length>=3&&area(poly)>1&&poly.every(function(p){return Number.isFinite(p.x)&&Number.isFinite(p.y);});}
function runParcelTests(){var d=state.districts[0]||district('dockside'),l=layout(d),checked=0;for(var bi=0;bi<Math.min(8,l.blocks.length);bi++){var b=l.blocks[bi];for(var pi=0;pi<b.parcels.length;pi++){var p=b.parcels[pi];checked++;console.assert(polygonValid(p.polygon),'Parcel polygon should be valid',p);console.assert(pointIn(centroid(p.polygon),b.polygon),'Parcel centroid should remain inside parent block',p);console.assert(p.streetAccess===true,'Parcel must be marked as street-accessible',p);console.assert(p.accessKind,'Parcel should explain street access',p);}for(var i=0;i<b.parcels.length;i++)for(var j=i+1;j<b.parcels.length;j++)console.assert(!polysOverlap(b.parcels[i].polygon,b.parcels[j].polygon),'Parcels should not overlap',b.parcels[i],b.parcels[j]);var coverage=b.parcels.reduce(function(s,p){return s+area(p.polygon);},0)/Math.max(1,area(b.polygon));console.assert(coverage>.55,'Parcels should cover most block land',coverage,b);}console.assert(typeof wheel==='function','wheel handler should be defined');console.assert(typeof pushIntoEllipse==='function','pushIntoEllipse helper should be defined');console.assert(typeof generateProceduralCity==='function','procedural city generator should be defined');console.assert(l.blocks.length>=Math.min(12,Math.floor(area(l.outerPolygon)/9000)),'large districts should generate enough visible blocks',l.blocks.length);console.assert(Object.keys(mapDistricts).length>=1,'city should have at least one district polygon');var dk=Object.keys(mapDistricts),overlapCount=0;for(var oi=0;oi<dk.length;oi++)for(var oj=oi+1;oj<dk.length;oj++){if(mapDistricts[dk[oi]].island===mapDistricts[dk[oj]].island&&polysOverlap(parsePoints(mapDistricts[dk[oi]].points),parsePoints(mapDistricts[dk[oj]].points)))overlapCount++;}console.assert(overlapCount===0,'districts on the same island should not overlap',overlapCount);var islandCenters={};Object.keys(mapDistricts).forEach(function(k){var d=mapDistricts[k];if(!islandCenters[d.island])islandCenters[d.island]=[];islandCenters[d.island].push({x:d.cx,y:d.cy});});var centers=Object.keys(islandCenters).map(function(k){return centroid(islandCenters[k]);});var tooClose=0;for(var ci=0;ci<centers.length;ci++)for(var cj=ci+1;cj<centers.length;cj++)if(dist(centers[ci],centers[cj])<260)tooClose++;console.assert(tooClose<=1,'generated island groups should be cohesive but not stacked',tooClose);var districtVertexCounts=Object.keys(mapDistricts).map(function(k){return parsePoints(mapDistricts[k].points).length;});console.assert(districtVertexCounts.every(function(n){return n>=4&&n<=20;}),'districts should have between 4 and 20 sides',districtVertexCounts);var isProceduralCity=Object.keys(mapDistricts).some(function(k){return k.indexOf('district_')===0;});if(isProceduralCity)console.assert(districtVertexCounts.some(function(n){return n>7;}),'random districts should include chaotic 8-20 sided polygons');console.log('Desk Don parcel tests passed for '+checked+' generated parcels.');}
function esc(s){return String(s).replace(/[&<>"]/g,function(ch){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch];});}
function money(value){return Number(value||0).toLocaleString('en-US');}
function setTab(t){state.tab=t;if(t!=='City'&&t!=='Dashboard')state.mapMode='city';render();}
function selectDistrict(id){state.selected=id;state.mapMode='district';state.zoom=1;state.pan={x:0,y:0};state.selectedBlock='';state.selectedParcel='';render();}function next(){var i=timeBlocks.indexOf(state.time);if(i===3){state.day++;state.time='Morning';state.dirty+=900;state.heat++;}else state.time=timeBlocks[i+1];state.tasks.forEach(function(t){if(t.status==='active')t.progress=Math.min(t.required,t.progress+1);});state.stopReason='Simulation advanced';render();}
function panel(title,inner){return'<section class="panel"><h2>'+esc(title)+'</h2>'+inner+'</section>';}function list(items,empty){empty=empty||'None';return items.length?'<ul>'+items.map(function(x){return'<li>'+esc(x)+'</li>';}).join('')+'</ul>':'<p class="muted">'+esc(empty)+'</p>';}function rows(items){return'<div class="rows">'+items.map(function(r){return'<div><b>'+esc(r[0])+'</b><span>'+esc(r[1])+'</span><p>'+esc(r[2]||'')+'</p></div>';}).join('')+'</div>';}
function wrapLabelText(text){
  var words=String(text||'').split(' ').filter(Boolean);
  if(words.length<=1)return [words[0]||''];
  var lines=[],line='';
  words.forEach(function(w){
    if((line+' '+w).trim().length>9){if(line)lines.push(line);line=w;}
    else line=(line+' '+w).trim();
  });
  if(line)lines.push(line);
  return lines.slice(0,4);
}
function labelFitsBox(center,w,h,poly){
  poly=poly||[];
  if(!poly.length)return false;
  var corners=[{x:center.x-w/2,y:center.y-h/2},{x:center.x+w/2,y:center.y-h/2},{x:center.x+w/2,y:center.y+h/2},{x:center.x-w/2,y:center.y+h/2}];
  var midpoints=[{x:center.x,y:center.y-h/2},{x:center.x+w/2,y:center.y},{x:center.x,y:center.y+h/2},{x:center.x-w/2,y:center.y},center];
  return corners.concat(midpoints).every(function(p){return pointIn(p,poly);});
}
function rectBox(center,w,h){return{x:center.x-w/2,y:center.y-h/2,w:w,h:h};}
function rectCorners(center,w,h){return[{x:center.x-w/2,y:center.y-h/2},{x:center.x+w/2,y:center.y-h/2},{x:center.x+w/2,y:center.y+h/2},{x:center.x-w/2,y:center.y+h/2}];}
function rectsOverlap(a,b,pad){pad=pad||0;return !(a.x+a.w+pad<b.x||b.x+b.w+pad<a.x||a.y+a.h+pad<b.y||b.y+b.h+pad<a.y);}
function boxTouchesPolygon(center,w,h,poly){
  poly=poly||[];
  if(poly.length<3)return false;
  var box=rectCorners(center,w,h);
  if(box.some(function(p){return pointIn(p,poly);}))return true;
  if(poly.some(function(p){return p.x>=center.x-w/2&&p.x<=center.x+w/2&&p.y>=center.y-h/2&&p.y<=center.y+h/2;}))return true;
  for(var i=0;i<4;i++)for(var j=0;j<poly.length;j++)if(segmentsCross(box[i],box[(i+1)%4],poly[j],poly[(j+1)%poly.length],.01))return true;
  return false;
}
function segmentTouchesRect(a,b,rect){
  if(!a||!b||!rect)return false;
  if(a.x>=rect.x&&a.x<=rect.x+rect.w&&a.y>=rect.y&&a.y<=rect.y+rect.h)return true;
  if(b.x>=rect.x&&b.x<=rect.x+rect.w&&b.y>=rect.y&&b.y<=rect.y+rect.h)return true;
  var pts=[{x:rect.x,y:rect.y},{x:rect.x+rect.w,y:rect.y},{x:rect.x+rect.w,y:rect.y+rect.h},{x:rect.x,y:rect.y+rect.h}];
  for(var i=0;i<4;i++)if(segmentsCross(a,b,pts[i],pts[(i+1)%4],.01))return true;
  return false;
}
function segmentTouchesPolygon(a,b,poly){
  poly=poly||[];
  if(poly.length<3)return false;
  if(pointIn(lerp(a,b,.5),poly))return true;
  for(var i=0;i<poly.length;i++)if(segmentsCross(a,b,poly[i],poly[(i+1)%poly.length],.01))return true;
  return false;
}
function allDistrictPolys(){
  return state.districts.map(function(d){var s=mapDistricts[d.id];return s?{id:d.id,poly:parsePoints(s.points)}:false;}).filter(Boolean);
}
function expandPolygon(poly,amount,noiseSeed){
  poly=cleanPoly(poly||[]);
  if(poly.length<3)return poly;
  var c=centroid(poly),rand=noiseSeed?seeded(noiseSeed):function(){return .5;};
  return cleanPoly(poly.map(function(p,i){
    var dx=p.x-c.x,dy=p.y-c.y,len=Math.max(1,Math.hypot(dx,dy));
    var wave=Math.sin(i*1.73+amount*.11)*amount*.10;
    var jitter=(rand()-.5)*amount*.32;
    var finalAmount=amount+wave+jitter;
    return{x:p.x+dx/len*finalAmount,y:p.y+dy/len*finalAmount};
  }));
}
function polyToPath(poly){return'M '+poly.map(function(p){return Math.round(p.x)+' '+Math.round(p.y);}).join(' L ')+' Z';}
function shallowWaterLayers(){
  return (islandMasses||[]).map(function(p,i){
    var poly=parseSvgPathPolygon(p);
    return {
      outer:polyToPath(expandPolygon(poly,46,'coast-outer-'+i)),
      mid:polyToPath(expandPolygon(poly,32,'coast-mid-'+i)),
      inner:polyToPath(expandPolygon(poly,18,'coast-inner-'+i))
    };
  });
}
function islandFillColor(index){
  var rand=seeded('island-color-'+index+'-'+(islandMasses[index]||''));
  var greens=['#2f4934','#385536','#405d38','#4b653f','#526b45','#314f3a','#46613f'];
  return greens[Math.floor(rand()*greens.length)];
}
function allCoastPolys(){return (islandMasses||[]).map(parseSvgPathPolygon).filter(function(p){return p&&p.length>=3;});}
function islandNameParts(name){
  var words=String(name||'Island').split(' ').filter(Boolean);
  if(words.length<=1)return [words[0]||'Island'];
  if(words.length===2)return words;
  var mid=Math.ceil(words.length/2);
  return [words.slice(0,mid).join(' '),words.slice(mid).join(' ')];
}
function visibleCharCount(text){
  var s=String(text||'');
  var count=0;
  for(var i=0;i<s.length;i++)if(s.charAt(i)!==' ')count++;
  return Math.max(1,count+s.split(' ').length*.7);
}
function islandCurvedLabel(item,index,lineIndex,lineCount,text){
  var poly=parseSvgPathPolygon(item||'');
  if(poly.length<3)return false;
  var b=bounds(poly),c=centroid(poly),w=b.maxX-b.minX,h=b.maxY-b.minY;
  var seed=seeded('island-label-'+index+'-'+lineIndex+'-'+text+'-'+((state.islandNames&&state.islandNames[index])||''));
  var laneOffset=(lineIndex-(lineCount-1)/2)*h*.16;
  var y=c.y+laneOffset+(seed()-.5)*h*.045;
  var usable=w*(.56+Math.min(.2,Math.max(0,(h/w))*.18));
  var left={x:c.x-usable*.5,y:y+(seed()-.5)*h*.045};
  var right={x:c.x+usable*.5,y:y+(seed()-.5)*h*.045};
  var bend=(seed()>.5?1:-1)*h*(.045+seed()*.065);
  var mid={x:c.x+(seed()-.5)*w*.04,y:y+bend};
  if(!pointIn(left,poly))left=lerp(left,c,.5);
  if(!pointIn(right,poly))right=lerp(right,c,.5);
  if(!pointIn(mid,poly))mid=lerp(mid,c,.58);
  var pathLength=Math.max(40,dist(left,mid)+dist(mid,right));
  var maxSize=h*(lineCount>1 ? 0.17 : 0.22);
  var size=clamp(pathLength/(visibleCharCount(text)*0.72),18,Math.min(58,maxSize));
  var d='M '+left.x.toFixed(1)+' '+left.y.toFixed(1)+' Q '+mid.x.toFixed(1)+' '+mid.y.toFixed(1)+' '+right.x.toFixed(1)+' '+right.y.toFixed(1);
  return {id:'islandNamePath'+index+'_'+lineIndex,d:d,size:size};
}
function islandNameLabels(){
  return (islandMasses||[]).map(function(p,i){
    var name=(state.islandNames&&state.islandNames[i])||('Island '+(i+1)),parts=islandNameParts(name);
    return parts.map(function(part,lineIndex){
      var label=islandCurvedLabel(p,i,lineIndex,parts.length,part);
      if(!label)return '';
      return '<path id="'+label.id+'" d="'+label.d+'" fill="none" stroke="none"></path><text class="island-name" style="font-size:'+label.size.toFixed(1)+'px"><textPath href="#'+label.id+'" startOffset="50%" text-anchor="middle">'+esc(part)+'</textPath></text>';
    }).join('');
  }).join('');
}
function allBridgeLines(){return (mapBridges||[]).map(function(pathText){var pts=parseSvgPathPolygon(pathText);return pts.length>=2?{a:pts[0],b:pts[pts.length-1]}:false;}).filter(Boolean);}
function labelBoxIsWater(center,w,h,ownId,polys,coasts){
  polys=polys||allDistrictPolys();
  coasts=coasts||allCoastPolys();
  var corners=rectCorners(center,w,h);
  var samples=corners.concat([{x:center.x,y:center.y},{x:center.x-w*.35,y:center.y},{x:center.x+w*.35,y:center.y},{x:center.x,y:center.y-h*.35},{x:center.x,y:center.y+h*.35}]);
  if(samples.some(function(p){return p.x<6||p.x>1114||p.y<6||p.y>814;}))return false;
  var touchesDistrict=polys.some(function(item){return boxTouchesPolygon(center,w,h,item.poly);});
  if(touchesDistrict)return false;
  var touchesCoast=coasts.some(function(poly){return boxTouchesPolygon(center,w,h,poly)||samples.some(function(p){return pointIn(p,poly);});});
  return !touchesCoast;
}
function labelBoxOverlaps(center,w,h,placed,pad){
  placed=placed||[];
  var box=rectBox(center,w,h);
  return placed.some(function(p){return rectsOverlap(box,p,pad||0);});
}
function waterDirections(anchor,ownPoly,polys,coasts){
  polys=polys||[];coasts=coasts||[];
  var dirs=[{x:1,y:0},{x:-1,y:0},{x:0,y:-1},{x:0,y:1},{x:.8,y:-.55},{x:-.8,y:-.55},{x:.8,y:.55},{x:-.8,y:.55}];
  var ownCenter=centroid(ownPoly||[{x:anchor.x,y:anchor.y},{x:anchor.x+1,y:anchor.y},{x:anchor.x,y:anchor.y+1}]);
  return dirs.sort(function(a,b){
    function score(d){
      var p={x:clamp(anchor.x+d.x*120,25,1095),y:clamp(anchor.y+d.y*120,25,795)};
      var overLand=polys.some(function(item){return pointIn(p,item.poly);});
      var inCoast=coasts.some(function(poly){return pointIn(p,poly);});
      return (overLand?10000:0)+(inCoast?6000:0)-dist(p,ownCenter)*.05;
    }
    return score(a)-score(b);
  });
}
function calloutCandidates(anchor,w,h,ownPoly,polys,coasts){
  var dirs=waterDirections(anchor,ownPoly,polys,coasts),out=[];
  dirs.forEach(function(d){for(var r=52;r<=240;r+=22)out.push({x:clamp(anchor.x+d.x*r,18+w/2,1102-w/2),y:clamp(anchor.y+d.y*r,18+h/2,802-h/2)});});
  return out;
}
function calloutCurvePath(anchor,chosen,labelSeed){
  var mid=lerp(anchor,chosen,.5);
  var dx=chosen.x-anchor.x,dy=chosen.y-anchor.y,len=Math.max(1,Math.hypot(dx,dy));
  var seed=seeded('callout-'+Math.round(anchor.x)+'-'+Math.round(anchor.y)+'-'+Math.round(chosen.x)+'-'+Math.round(chosen.y)+'-'+(labelSeed||''));
  var side=seed()>.5?1:-1;
  var bend=Math.min(52,len*(.10+seed()*.18))*side;
  var slide=(seed()-.5)*Math.min(36,len*.18);
  var cx=mid.x+(-dy/len)*bend+(dx/len)*slide;
  var cy=mid.y+(dx/len)*bend+(dy/len)*slide;
  return {d:'M '+anchor.x.toFixed(1)+' '+anchor.y.toFixed(1)+' Q '+cx.toFixed(1)+' '+cy.toFixed(1)+' '+chosen.x.toFixed(1)+' '+chosen.y.toFixed(1),control:{x:cx,y:cy}};
}
function curveTouchesRect(anchor,chosen,rect){
  var curve=calloutCurvePath(anchor,chosen,'collision'),prev=anchor;
  for(var t=.12;t<=1;t+=.12){
    var q1=lerp(anchor,curve.control,t),q2=lerp(curve.control,chosen,t),p=lerp(q1,q2,t);
    if(segmentTouchesRect(prev,p,rect))return true;
    prev=p;
  }
  return false;
}
function curveTouchesPolygon(anchor,chosen,poly){
  var curve=calloutCurvePath(anchor,chosen,'collision'),prev=anchor;
  for(var t=.12;t<=1;t+=.12){
    var q1=lerp(anchor,curve.control,t),q2=lerp(curve.control,chosen,t),p=lerp(q1,q2,t);
    if(segmentTouchesPolygon(prev,p,poly))return true;
    prev=p;
  }
  return false;
}
function curvesCross(a1,a2,b1,b2){
  var curveA=calloutCurvePath(a1,a2,'a'),curveB=calloutCurvePath(b1,b2,'b'),prevA=a1,segmentsA=[];
  for(var t=.12;t<=1;t+=.12){var aq1=lerp(a1,curveA.control,t),aq2=lerp(curveA.control,a2,t),ap=lerp(aq1,aq2,t);segmentsA.push({a:prevA,b:ap});prevA=ap;}
  var prevB=b1;
  for(t=.12;t<=1;t+=.12){var bq1=lerp(b1,curveB.control,t),bq2=lerp(curveB.control,b2,t),bp=lerp(bq1,bq2,t);for(var i=0;i<segmentsA.length;i++)if(segmentsCross(segmentsA[i].a,segmentsA[i].b,prevB,bp,.01))return true;prevB=bp;}
  return false;
}
function renderLabelGroup(label,lines,chosen,w,h,anchor,isCallout){
  var textLines=lines.map(function(line,idx){var y=chosen.y-((lines.length-1)*7.5)+idx*15+4;return'<tspan x="'+chosen.x+'" y="'+y+'">'+esc(line)+'</tspan>';}).join('');
  var curve=isCallout?calloutCurvePath(anchor,chosen,label):false;
  var leader=isCallout?'<path d="'+curve.d+'"></path><circle cx="'+anchor.x+'" cy="'+anchor.y+'" r="3"></circle>':'';
  return'<g class="map-label '+(isCallout?'callout':'')+'">'+leader+'<rect x="'+(chosen.x-w/2)+'" y="'+(chosen.y-h/2)+'" width="'+w+'" height="'+h+'" rx="4"></rect><text>'+textLines+'</text></g>';
}
function labelSlots(){
  var placed=[],leaderLines=[],polys=allDistrictPolys(),coasts=allCoastPolys(),bridges=allBridgeLines();
  return state.districts.map(function(d){
    var s=mapDistricts[d.id];if(!s)return'';
    var poly=parsePoints(s.points),c=centroid(poly),label=String(s.label||d.name),lines=wrapLabelText(label);
    var maxLen=Math.max.apply(null,lines.map(function(x){return x.length;}));
    var w=clamp(maxLen*7.1+22,52,98),h=14+lines.length*13;
    var bb=bounds(poly),candidates=[c,{x:s.cx,y:s.cy},{x:(c.x+s.cx)/2,y:(c.y+s.cy)/2},{x:bb.minX+(bb.maxX-bb.minX)*.30,y:bb.minY+(bb.maxY-bb.minY)*.30},{x:bb.minX+(bb.maxX-bb.minX)*.50,y:bb.minY+(bb.maxY-bb.minY)*.30},{x:bb.minX+(bb.maxX-bb.minX)*.70,y:bb.minY+(bb.maxY-bb.minY)*.30},{x:bb.minX+(bb.maxX-bb.minX)*.30,y:bb.minY+(bb.maxY-bb.minY)*.50},{x:bb.minX+(bb.maxX-bb.minX)*.50,y:bb.minY+(bb.maxY-bb.minY)*.50},{x:bb.minX+(bb.maxX-bb.minX)*.70,y:bb.minY+(bb.maxY-bb.minY)*.50},{x:bb.minX+(bb.maxX-bb.minX)*.30,y:bb.minY+(bb.maxY-bb.minY)*.70},{x:bb.minX+(bb.maxX-bb.minX)*.50,y:bb.minY+(bb.maxY-bb.minY)*.70},{x:bb.minX+(bb.maxX-bb.minX)*.70,y:bb.minY+(bb.maxY-bb.minY)*.70}];
    for(var i=0;i<candidates.length;i++){
      var cand=candidates[i];
      if(labelFitsBox(cand,w,h,poly)&&!labelBoxOverlaps(cand,w,h,placed,5)){
        placed.push(rectBox(cand,w,h));
        return renderLabelGroup(label,lines,cand,w,h,c,false);
      }
    }
    var callouts=calloutCandidates(c,w,h,poly,polys,coasts),chosen=false;
    for(i=0;i<callouts.length;i++){
      var cand2=callouts[i],box=rectBox(cand2,w,h);
      var overlapsLabel=labelBoxOverlaps(cand2,w,h,placed,8);
      var hitsLeader=leaderLines.some(function(l){return segmentsCross(c,cand2,l.a,l.b,.01)||segmentTouchesRect(c,cand2,l.box);});
      var hitsBridge=bridges.some(function(l){return segmentsCross(c,cand2,l.a,l.b,.01)||segmentTouchesRect(l.a,l.b,box);});
      var hitsLandLine=polys.some(function(item){return item.id!==d.id&&segmentTouchesPolygon(c,cand2,item.poly);});
      if(labelBoxIsWater(cand2,w,h,d.id,polys,coasts)&&!overlapsLabel&&!hitsLeader&&!hitsBridge&&!hitsLandLine){chosen=cand2;break;}
    }
    if(!chosen){
      for(i=0;i<callouts.length;i++)if(labelBoxIsWater(callouts[i],w,h,d.id,polys,coasts)&&!labelBoxOverlaps(callouts[i],w,h,placed,4)){chosen=callouts[i];break;}
    }
    chosen=chosen||c;
    var chosenBox=rectBox(chosen,w,h);placed.push(chosenBox);leaderLines.push({a:c,b:chosen,box:chosenBox});
    return renderLabelGroup(label,lines,chosen,w,h,c,chosen!==c);
  }).join('');
}
function cityMap(){if(state.mapMode==='district')return districtView(true);var selected=district(state.selected),cityBounds=getCityBounds(),waterLayers=shallowWaterLayers(),shallowHtml=waterLayers.map(function(layer){return'<path class="coast-outer" d="'+layer.outer+'"></path><path class="coast-mid" d="'+layer.mid+'"></path><path class="coast-inner" d="'+layer.inner+'"></path>';}).join(''),islandHtml=islandMasses.map(function(p,i){return'<path fill="'+islandFillColor(i)+'" d="'+p+'"></path>';}).join(''),districtHtml=state.districts.map(function(d){var s=mapDistricts[d.id];if(!s)return'';return'<g class="map-district '+(d.id===state.selected?'selected':'')+'"><polygon points="'+s.points+'" data-action="selectDistrict" data-id="'+d.id+'"></polygon></g>';}).join(''),bridgeHtml=mapBridges.map(function(p){var pts=parseSvgPathPolygon(p),a=pts[0]||{x:0,y:0},b=pts[pts.length-1]||a;return'<path class="bridge-shadow" d="'+p+'"></path><path class="bridge-main" d="'+p+'"></path><path class="bridge-core" d="'+p+'"></path><circle class="bridge-end" cx="'+a.x+'" cy="'+a.y+'" r="5"></circle><circle class="bridge-end" cx="'+b.x+'" cy="'+b.y+'" r="5"></circle>';}).join(''),labelHtml=labelSlots(),islandLabelHtml=islandNameLabels(),mapName=state.mapName||mapCityName;return'<section class="control-hub"><div class="hub-header"><div><small>Main control hub</small><h2>MAP VIEW</h2></div><div class="map-legend"><span><i class="legend-control"></i> Player control</span><span><i class="legend-rival"></i> Rival pressure</span><span><i class="legend-heat"></i> Police heat</span></div></div><div class="map-wrap"><div class="city-map-shell"><div class="map-title-overlay">'+esc(mapName)+'</div><svg class="city-map" viewBox="'+cityBounds.viewBox+'"><defs><pattern id="waterGrid" width="42" height="42" patternUnits="userSpaceOnUse"><path d="M 42 0 L 0 0 0 42" fill="none" stroke="rgba(255,255,255,0.035)" stroke-width="1"/></pattern></defs><rect class="deep-water" x="'+cityBounds.x+'" y="'+cityBounds.y+'" width="'+cityBounds.w+'" height="'+cityBounds.h+'"/><rect x="'+cityBounds.x+'" y="'+cityBounds.y+'" width="'+cityBounds.w+'" height="'+cityBounds.h+'" fill="url(#waterGrid)"/><g class="coastal-water">'+shallowHtml+'</g><g class="island-masses">'+islandHtml+'</g><g class="island-labels">'+islandLabelHtml+'</g>'+districtHtml+'<g class="bridges">'+bridgeHtml+'</g>'+labelHtml+'</svg></div><aside class="map-dossier"><small>Selected district</small><h3>'+esc(selected.name)+'</h3><p>'+esc((mapDistricts[selected.id]?mapDistricts[selected.id].island:'City'))+' district dossier. Click any subdivision to open its orders.</p><div class="mini-stats"><span>Size <b>'+districtMapArea(selected.id)+'</b></span><span>Wealth <b>'+selected.wealth+'</b></span><span>Police <b>'+selected.police+'</b></span><span>Control <b>'+selected.control+'</b></span><span>Rival <b>'+selected.rival+'</b></span></div></aside></div></section>';}
function getCityBounds(){return{viewBox:'0 0 1120 820',x:0,y:0,w:1120,h:820};}
function dashboard(){return cityMap()+'<div class="grid"><div class="stat"><small>Dirty Cash</small><strong>$'+money(state.dirty)+'</strong></div><div class="stat"><small>Clean Cash</small><strong>$'+money(state.clean)+'</strong></div><div class="stat"><small>Heat</small><strong>'+state.heat+'</strong></div><div class="stat"><small>Police</small><strong>'+state.police+'</strong></div>'+panel('Active Work',list(state.tasks.filter(function(t){return t.status==='active';}).map(function(t){return t.title+' - '+t.progress+'/'+t.required+' - '+district(t.districtId).name;}),'No crews assigned.'))+panel('Important Inbox',list(state.messages.filter(function(m){return !m.read&&m.importance!=='normal';}).map(function(m){return m.type+': '+m.title;}),'No urgent reports.'))+'</div>';}
function districtView(embedded){
  var d=district(state.selected),l=layout(d);
  var sb=l.blocks.find(function(b){return b.id===state.selectedBlock;})||l.blocks[0];
  var sp=sb?sb.parcels.find(function(p){return p.id===state.selectedParcel;}):null;
  var clip='clip-'+d.id;
  var viewBox='0 0 800 560';
  var mapTransform='scale('+state.zoom+') translate('+(-state.pan.x)+' '+(-state.pan.y)+')';
  var invZoom=1/Math.max(.001,state.zoom);
  var bc=sb?centroid(sb.polygon):null;
  var sidewalkHtml='';
  var curbHtml='';
  var lampHtml=l.blocks.map(function(b){return (b.lamps||[]).map(function(p){return '<circle class="lamp-post" cx="'+p.x.toFixed(1)+'" cy="'+p.y.toFixed(1)+'" r="1.7"></circle>';}).join('');}).join('');
  var medianHtml=(l.medians||[]).map(function(m){return '<path d="'+m.path+'" stroke-width="5"></path>'+m.items.map(function(it){var radius=it.type==='tree'?3.2:2.3;return '<g transform="translate('+it.x.toFixed(1)+' '+it.y.toFixed(1)+') scale('+invZoom.toFixed(4)+')"><circle class="'+(it.type==='tree'?'median-tree':'median-light')+'" cx="0" cy="0" r="'+radius+'"></circle></g>';}).join('');}).join('');
  var crosswalkHtml=(l.crosswalks||[]).map(function(c){var cx=(c.x1+c.x2)/2,cy=(c.y1+c.y2)/2,dx=(c.x2-c.x1)*.5,dy=(c.y2-c.y1)*.5;return '<g transform="translate('+cx.toFixed(1)+' '+cy.toFixed(1)+') scale('+invZoom.toFixed(4)+')"><line class="crosswalk-stripe" x1="'+(-dx).toFixed(1)+'" y1="'+(-dy).toFixed(1)+'" x2="'+dx.toFixed(1)+'" y2="'+dy.toFixed(1)+'"></line></g>';}).join('');
  var roadHtml=l.roads.map(function(r){return '<path class="'+r.kind+'" d="'+r.path+'" stroke-width="'+r.width+'"></path>';}).join('');
  var roadNameHtml=l.roads.filter(function(r){return r.name;}).map(function(r){var p=lerp(r.a,r.b,.5),vertical=Math.abs(r.a.x-r.b.x)<Math.abs(r.a.y-r.b.y),rot=vertical?90:0;return '<g transform="translate('+p.x.toFixed(1)+' '+p.y.toFixed(1)+') rotate('+rot+') scale('+invZoom.toFixed(4)+')"><text class="road-name" x="0" y="0">'+esc(r.name)+'</text></g>';}).join('');
  var hqHtml=(l.familyHQs||[]).map(function(h){return '<g class="family-marker" transform="translate('+h.point.x+' '+h.point.y+')"><circle r="10" fill="'+h.color+'"></circle><text y="4">'+esc(h.short)+'</text></g>';}).join('');
  var landmarkHtml=l.landmarks.map(function(m){return '<g transform="translate('+m.point.x+' '+m.point.y+')"><circle r="5"></circle><text x="9" y="4">'+esc(m.label)+'</text></g>';}).join('');
  var blockHtml=l.blocks.map(function(b){
    var parcelHtml=b.parcels.map(function(p){
      return '<g class="parcel '+(sp&&sp.id===p.id?'selected ':'')+(p.isHQ?'hq ':'')+'owner-'+p.occupiedBy+'"><path data-size="'+p.size+'" data-action="selectParcel" data-block="'+b.id+'" data-parcel="'+p.id+'" d="'+path(p.polygon)+'"></path></g>';
    }).join('');
    return '<g class="district-block '+(sb&&sb.id===b.id?'selected':'')+'"><path data-action="selectBlock" data-block="'+b.id+'" d="'+path(b.polygon)+'"></path>'+parcelHtml+'</g>';
  }).join('');
  var selectedBlockText=sb?'<p>Pressure '+sb.pressure+'. Area '+Math.round(area(sb.polygon))+'. Parcels '+sb.parcels.length+'. '+(sb.isCut?'Border-cut block: parcels use only the visual street edge; district borders are rear cut boundaries, not roads.':'Block is split into internal-street zones, then each zone is subdivided.')+'</p>':'';
  var selectedFamily=sp&&sp.familyId?families.find(function(f){return f.id===sp.familyId;}):null;
  var selectedParcelText=sp?'<p>'+esc(sp.kind)+' - '+esc(selectedFamily?selectedFamily.name:sp.occupiedBy)+'. '+esc(sp.shape||'street lot')+'. Size '+sp.size+'. Area '+Math.round(area(sp.polygon))+'. Frontage '+(sp.frontage||'?')+'m. Depth '+(sp.depth||'?')+'m. Street access: '+(sp.streetAccess?'yes':'no')+' ('+esc(sp.accessKind||'street')+'). Value '+sp.value+'. Heat '+sp.heat+'.</p>':'';
  var familyPanel='<section><small>Family presence</small><div class="family-list">'+((l.familyHQs&&l.familyHQs.length)?l.familyHQs.map(function(h){return '<span><i style="background:'+h.color+'"></i>'+esc(h.name)+' HQ active</span>';}).join(''):'<span>No known family headquarters here yet.</span>')+'</div></section>';
  var backButton=embedded?'<button class="inline" onclick="state.mapMode=\'city\';state.zoom=1;state.pan={x:0,y:0};state.selectedBlock=\'\';state.selectedParcel=\'\';render()">Back to City Map</button>':'';
  return '<section class="district-control '+(embedded?'embedded':'')+'"><div class="district-head"><div><small>'+(embedded?'City map / district focus':'District control')+'</small><h2>'+esc(d.name)+'</h2></div><p>Size '+districtMapArea(d.id)+' - Wealth '+d.wealth+' - Police '+d.police+' - Corruption '+d.corruption+' - Fear '+d.fear+' - Public order '+d.order+'</p>'+backButton+'</div><div class="district-layout"><div class="block-map-panel"><div class="map-tools"><button onclick="zoom(-.25)">-</button><button onclick="zoom(.25)">+</button><button onclick="movePan(0,-42)">N</button><button onclick="movePan(-42,0)">W</button><button onclick="movePan(42,0)">E</button><button onclick="movePan(0,42)">S</button><button onclick="state.zoom=1;state.pan={x:0,y:0};render()">Reset</button><span>'+Math.round(state.zoom*100)+'%</span></div><svg class="block-map" viewBox="'+viewBox+'" onwheel="wheel(event)" oncontextmenu="backFromDistrict(event)" onpointerdown="beginMapDrag(event)" onpointermove="dragMap(event)" onpointerup="endMapDrag(event)" onpointercancel="endMapDrag(event)" onlostpointercapture="endMapDrag(event)" onpointerleave="cancelMapDrag(event)"><defs><clipPath id="'+clip+'"><path d="'+path(l.outerPolygon)+'"></path></clipPath></defs><rect width="800" height="560" class="district-watermark"></rect><g class="district-zoom-layer" transform="'+mapTransform+'"><path class="district-outer" d="'+path(l.outerPolygon)+'"></path>'+blockHtml+'<g class="district-roads" clip-path="url(#'+clip+')">'+roadHtml+'</g><g class="district-sidewalks" clip-path="url(#'+clip+')">'+sidewalkHtml+'</g><g class="district-curbs" clip-path="url(#'+clip+')">'+curbHtml+'</g><g class="district-medians" clip-path="url(#'+clip+')">'+medianHtml+'</g><g class="district-crosswalks" clip-path="url(#'+clip+')">'+crosswalkHtml+'</g><g class="district-lamps" clip-path="url(#'+clip+')">'+lampHtml+'</g><g class="district-road-names" clip-path="url(#'+clip+')">'+roadNameHtml+'</g>'+(bc?'<text class="selected-block-label" x="'+bc.x+'" y="'+bc.y+'">'+esc(sb.label)+'</text>':'')+'<g class="district-landmarks">'+landmarkHtml+'</g><g class="family-hqs">'+hqHtml+'</g></g></svg></div><aside class="district-dossier"><section><small>Selected block</small><h3>'+(sb?esc(sb.label):'No block selected')+'</h3>'+selectedBlockText+'<div class="actions compact"><button onclick="addTask(\'Scout Block\')">Scout Block</button><button onclick="addTask(\'Pressure Block\')">Pressure Block</button><button onclick="addTask(\'Cool Block\')">Cool Block</button></div></section><section><small>Selected parcel</small><h3>'+(sp?esc(sp.label):'No parcel selected')+'</h3>'+selectedParcelText+'<div class="actions compact"><button onclick="addTask(\'Investigate Parcel\')">Investigate Parcel</button><button onclick="addTask(\'Set Up Racket\')">Set Up Racket</button><button onclick="addTask(\'Handle Heat\')">Handle Heat</button></div></section>'+familyPanel+'<section><small>Known local leads</small>'+list(state.opportunities.filter(function(o){return o.districtId===d.id;}).map(function(o){return o.title+' - '+o.type+' - '+o.value+' - '+o.risk;}),'No known leads in this district yet.')+'</section></aside></div></section>';
}
function content(){if(state.tab==='Dashboard')return dashboard();if(state.tab==='City')return cityMap()+(state.mapMode==='district'?'':'<div class="districts">'+state.districts.map(function(d){var island=mapDistricts[d.id]?mapDistricts[d.id].island:'City';return'<button data-action="selectDistrict" data-id="'+d.id+'"><h3>'+esc(d.name)+'</h3><span>'+esc(island)+' - Wealth '+d.wealth+' - Police '+d.police+'</span><span>Fear '+d.fear+' - Control '+d.control+' - Rival '+d.rival+'</span></button>';}).join('')+'</div>');if(state.tab==='District')return districtView(false);if(state.tab==='Calendar')return panel('Calendar','<div class="calendar">'+Array.from({length:21},function(_,i){var events=state.tasks.filter(function(t){return t.endDay===state.day+i&&t.status==='active';}).map(function(t){return t.title;}).join(', ')||'No scheduled stops';return'<div><b>Day '+(state.day+i)+'</b><span>'+esc(events)+'</span></div>';}).join('')+'</div>');if(state.tab==='Inbox')return panel('Inbox',state.messages.map(function(m,i){return'<button class="message '+(m.read?'read':m.importance)+'" data-action="readMessage" data-index="'+i+'"><b>'+esc(m.title)+'</b><span>Day '+m.day+' - '+esc(m.time)+' - '+esc(m.type)+'</span><p>'+esc(m.body)+'</p></button>';}).join(''));if(state.tab==='Crew')return panel('Crew',rows(state.crew));if(state.tab==='Tasks')return panel('Tasks',rows(state.tasks.map(function(t){return[t.title,t.status+' - '+t.progress+'/'+t.required+' - '+district(t.districtId).name+' - due Day '+t.endDay,t.result||'A report will arrive when the work is done.'];})));if(state.tab==='Opportunities')return panel('Known Opportunities',list(state.opportunities.map(function(o){return o.title+' - '+o.type+' - '+district(o.districtId).name+' - '+o.value+' - '+o.risk;}),'Scout districts and investigate fronts to reveal opportunities.'));if(state.tab==='Fronts')return panel('Fronts','<button class="primary inline" data-action="addTask" data-title="Launder Money">Launder $1,000 Through Front</button><br><br>'+rows(state.fronts));if(state.tab==='Rackets')return panel('Rackets',list(state.rackets.map(function(r){return r[0]+' - '+r[1]+' - '+r[2];}),'No active rackets yet.'));if(state.tab==='Rivals')return panel('Rivals',rows(state.rivals));return'';}
function render(){var nav=tabs.map(function(t){return'<button class="'+(state.tab===t?'active':'')+'" data-action="tab" data-tab="'+t+'">'+t+'</button>';}).join('');document.getElementById('app').innerHTML='<div class="shell"><aside class="side"><div class="brand"><strong>Desk Don</strong><span>'+esc(state.family)+'</span></div>'+nav+'</aside><main class="main"><header class="top"><div><small>Monday Jan 5, 1931</small><h1>Day '+state.day+' - '+esc(state.time)+'</h1></div><div class="top-actions"><button data-action="pause">Pause</button><button class="primary" data-action="continue">Continue</button><button data-action="save">Save</button><button data-action="load">Load</button><button data-action="new">New</button><button data-action="randomCity">Generate City</button></div></header>'+(state.stopReason?'<div class="stop"><strong>Simulation stopped:</strong> '+esc(state.stopReason)+'</div>':'')+content()+'</main></div>';}
function minDistrictZoom(){return 1;}
function clampPan(){
  state.zoom=Math.max(minDistrictZoom(),Math.min(4,state.zoom));
  if(state.zoom<=minDistrictZoom()+.001){state.pan={x:0,y:0};return;}
  var maxX=800-(800/state.zoom),maxY=560-(560/state.zoom);
  state.pan.x=clamp(state.pan.x,0,maxX);
  state.pan.y=clamp(state.pan.y,0,maxY);
}
function zoom(v){state.zoom=Math.max(minDistrictZoom(),Math.min(4,state.zoom+v));clampPan();render();}
function movePan(x,y){state.pan.x+=x/state.zoom;state.pan.y+=y/state.zoom;clampPan();render();}
function wheel(e){
  if(e){e.preventDefault();e.stopPropagation();}
  if(!e){zoom(.25);return;}
  var svg=e.currentTarget&&typeof e.currentTarget.getBoundingClientRect==='function'?e.currentTarget:null;
  if(!svg&&e.target&&e.target.closest)svg=e.target.closest('.block-map');
  if(!svg||typeof svg.getBoundingClientRect!=='function')return;
  var rect=svg.getBoundingClientRect();
  var mx=(e.clientX-rect.left)/rect.width*800;
  var my=(e.clientY-rect.top)/rect.height*560;
  var oldZoom=state.zoom;
  var delta=e.deltaY<0?.38:-.38;
  var newZoom=Math.max(minDistrictZoom(),Math.min(4,oldZoom+delta));
  if(newZoom===oldZoom)return;
  var worldX=state.pan.x+mx/oldZoom;
  var worldY=state.pan.y+my/oldZoom;
  state.zoom=newZoom;
  state.pan.x=worldX-mx/newZoom;
  state.pan.y=worldY-my/newZoom;
  clampPan();
  render();
}
var dragState={active:false,moved:false,pointerId:null,x:0,y:0,panX:0,panY:0};
function applyMapTransform(){
  var layer=document.querySelector('.district-zoom-layer');
  if(layer)layer.setAttribute('transform','scale('+state.zoom+') translate('+(-state.pan.x)+' '+(-state.pan.y)+')');
}
function beginMapDrag(e){
  if(!e||e.button!==0)return;
  e.preventDefault();
  dragState={active:true,moved:false,pointerId:e.pointerId,x:e.clientX,y:e.clientY,panX:state.pan.x,panY:state.pan.y};
  document.body.classList.add('map-dragging');
  if(e.currentTarget){e.currentTarget.classList.add('dragging');}
  if(e.currentTarget&&e.currentTarget.setPointerCapture){try{e.currentTarget.setPointerCapture(e.pointerId);}catch(err){}}
}
function dragMap(e){
  if(!dragState.active)return;
  if(e.pointerId!==dragState.pointerId)return;
  if(e.buttons!==1){endMapDrag(e);return;}
  e.preventDefault();
  var dx=e.clientX-dragState.x,dy=e.clientY-dragState.y;
  if(Math.hypot(dx,dy)>2)dragState.moved=true;
  state.pan.x=dragState.panX-dx/state.zoom;
  state.pan.y=dragState.panY-dy/state.zoom;
  clampPan();
  applyMapTransform();
}
function endMapDrag(e){
  if(!dragState.active)return;
  if(e&&dragState.pointerId!==null&&e.pointerId!==dragState.pointerId)return;
  if(e&&e.currentTarget&&e.currentTarget.releasePointerCapture){try{e.currentTarget.releasePointerCapture(dragState.pointerId);}catch(err){}}
  if(e&&e.currentTarget){e.currentTarget.classList.remove('dragging');}
  document.body.classList.remove('map-dragging');
  dragState.active=false;
  dragState.pointerId=null;
  setTimeout(function(){dragState.moved=false;},80);
}
function cancelMapDrag(e){
  if(!dragState.active)return;
  if(e&&dragState.pointerId!==null&&e.pointerId!==dragState.pointerId)return;
  if(e&&e.currentTarget){e.currentTarget.classList.remove('dragging');}
  document.body.classList.remove('map-dragging');
  dragState.active=false;
  dragState.pointerId=null;
  setTimeout(function(){dragState.moved=false;},80);
}
function backFromDistrict(e){if(e)e.preventDefault();if(state.mapMode==='district'){state.mapMode='city';state.selectedBlock='';state.selectedParcel='';state.zoom=1;state.pan={x:0,y:0};render();}else if(state.tab==='District'){state.tab='City';state.selectedBlock='';state.selectedParcel='';state.zoom=1;state.pan={x:0,y:0};render();}}
function addTask(title){state.tasks.unshift({title:title,status:'active',progress:0,required:3,districtId:state.selected,endDay:state.day+2,result:''});state.tab='Tasks';render();}function selectBlock(blockId){state.selectedBlock=blockId;state.selectedParcel='';render();}function selectParcel(blockId,parcelId){state.selectedBlock=blockId;state.selectedParcel=parcelId;render();}
function saveGame(){localStorage.setItem('desk-don-demo',JSON.stringify(state));}
function loadGame(){var saved=localStorage.getItem('desk-don-demo');if(!saved)return;try{var parsed=JSON.parse(saved);if(!parsed||!Array.isArray(parsed.districts))throw new Error('Invalid save data');state=Object.assign(state,parsed);layouts={};render();}catch(err){state.stopReason='Saved game could not be loaded';render();}}
document.addEventListener('click',function(e){var el=e.target.closest('[data-action]');if(!el)return;var action=el.getAttribute('data-action');if(action==='tab')setTab(el.getAttribute('data-tab'));else if(action==='selectDistrict')selectDistrict(el.getAttribute('data-id'));else if(action==='selectBlock'){if(!dragState.moved)selectBlock(el.getAttribute('data-block'));}else if(action==='selectParcel'){if(!dragState.moved)selectParcel(el.getAttribute('data-block'),el.getAttribute('data-parcel'));}else if(action==='addTask')addTask(el.getAttribute('data-title'));else if(action==='pause'){state.stopReason='Paused manually';render();}else if(action==='continue')next();else if(action==='save')saveGame();else if(action==='load')loadGame();else if(action==='new')location.reload();else if(action==='randomCity')generateProceduralCity('city-'+Date.now());else if(action==='readMessage'){state.messages[parseInt(el.getAttribute('data-index'),10)].read=true;render();}});
// Wheel zoom is handled directly by the SVG onwheel attribute.
runParcelTests();render();
