(function(){
'use strict';
var populationModuleStarted=performance.now();
var VERSION=8,MAX_PEOPLE=1100,MAX_VISIBLE_PEDESTRIANS=50,MAX_VISIBLE_CARS=18,WALK_SPEED=1.1,CAR_SPEED=1.65,cachedEntryData=null,cachedEntryLayout=null,cachedEntryKey='',payloadCache={},tripMinutesCache={};
var firstNamesMale=['Anthony','Carlo','Dominic','Eddie','Enzo','Frank','George','Henry','Jack','Joseph','Louis','Marco','Michael','Nico','Paul','Peter','Ralph','Salvatore','Thomas','Vincent','Walter','William'];
var firstNamesFemale=['Ada','Anna','Beatrice','Carla','Clara','Dorothy','Edith','Elena','Frances','Grace','Helen','Irene','Josephine','Lucia','Maria','Nora','Rosa','Rose','Sofia','Teresa','Vera','Virginia'];
var surnames=['Alvarez','Bellini','Bennett','Burke','Caruso','Cohen','Conti','Costa','Doyle','Esposito','Falco','Ferraro','Greco','Kelly','Kowalski','Leone','Lombardi','Marino','Moretti','Murphy','Olsen','Petrov','Ricci','Rizzo','Romano','Rossi','Russo','Santoro','Sullivan','Valenti','Vitale','Weiss'];
var likes=['baseball','boxing','church socials','coffee','dancing','family dinners','gardening','horse racing','jazz','newspapers','quiet evenings','radio dramas','street festivals','theater'];
var dislikes=['bullies','debt','drunks','gossip','loud crowds','police','racketeers','strangers','unpaid favors','violence'];
var goals=['Build a secure home','Earn respect','Expand the family business','Get out of debt','Keep the family safe','Move to a better neighborhood','Own a motorcar','Retire comfortably','Rise through the organization','Send the children to school','Start an independent business'];
var leisurePatterns=/bar|restaurant|cafe|club|theater|church|park|hotel/i;

var JOBS=[
  {id:'butcher',label:'Butcher',match:/butcher|meat|deli/i,hours:[390,1050],levels:[['Shop Helper',8],['Butcher',15],['Master Butcher',24],['Proprietor',38]]},
  {id:'baker',label:'Baker',match:/bakery|baker/i,hours:[270,870],levels:[['Bakery Helper',7],['Baker',13],['Senior Baker',21],['Proprietor',34]]},
  {id:'restaurant',label:'Restaurant Worker',match:/restaurant|cafe|diner|food/i,hours:[600,1380],levels:[['Busboy',7],['Waiter',12],['Cook',18],['Manager',27],['Proprietor',42]]},
  {id:'nightlife',label:'Nightlife Worker',match:/bar|lounge|club|speakeasy|tavern/i,hours:[960,1560],levels:[['Porter',8],['Bartender',16],['Floor Manager',27],['Proprietor',45]]},
  {id:'warehouse',label:'Warehouse Worker',match:/warehouse|storage|freight/i,hours:[420,990],levels:[['Loader',9],['Stock Clerk',14],['Foreman',24],['Warehouse Manager',36],['Proprietor',54]]},
  {id:'factory',label:'Factory Worker',match:/factory|industrial|mill|plant|foundry/i,hours:[360,900],levels:[['Laborer',9],['Machine Operator',15],['Foreman',25],['Plant Manager',44],['Industrial Owner',70]]},
  {id:'mechanic',label:'Mechanic',match:/mechanic|garage|workshop|repair/i,hours:[450,1050],levels:[['Apprentice',8],['Mechanic',17],['Master Mechanic',28],['Garage Owner',45]]},
  {id:'retail',label:'Shop Worker',match:/shop|store|market|grocer|jewel|pawn|tailor|florist|furniture/i,hours:[510,1080],levels:[['Shop Assistant',8],['Clerk',13],['Senior Clerk',20],['Manager',29],['Proprietor',43]]},
  {id:'banking',label:'Bank Employee',match:/bank|finance|insurance/i,hours:[540,960],levels:[['Messenger',10],['Clerk',18],['Accountant',30],['Branch Manager',52],['Bank Director',88]]},
  {id:'office',label:'Office Worker',match:/office|corporate|agency|newspaper/i,hours:[540,1020],levels:[['Office Boy',8],['Clerk',16],['Senior Clerk',25],['Office Manager',39],['Partner',65]]},
  {id:'hotel',label:'Hotel Worker',match:/hotel|boarding/i,hours:[480,1020],levels:[['Bellhop',8],['Desk Clerk',15],['Supervisor',24],['Hotel Manager',42],['Hotelier',70]]},
  {id:'medical',label:'Medical Worker',match:/hospital|clinic|medical|doctor|pharmacy/i,hours:[480,1020],levels:[['Orderly',11],['Nurse',24],['Senior Nurse',36],['Physician',65],['Medical Director',95]]},
  {id:'school',label:'School Employee',match:/school|college|academy|library/i,hours:[450,960],levels:[['Caretaker',10],['Teacher',27],['Senior Teacher',38],['Headmaster',58]]},
  {id:'police',label:'Police',match:/police|precinct|sheriff/i,hours:[420,900],levels:[['Patrolman',19],['Detective',31],['Sergeant',43],['Captain',72]]},
  {id:'church',label:'Church Worker',match:/church|parish|temple|synagogue/i,hours:[420,900],levels:[['Caretaker',8],['Secretary',14],['Clergy',25],['Senior Clergy',39]]},
  {id:'government',label:'Civil Servant',match:/city hall|courthouse|government|municipal|civic/i,hours:[510,990],levels:[['Messenger',9],['Clerk',17],['Administrator',31],['Department Head',56]]},
  {id:'transport',label:'Transport Worker',match:/dock|rail|station|terminal|shipping/i,hours:[360,960],levels:[['Laborer',10],['Driver',17],['Dispatcher',27],['Foreman',37],['Operator',59]]},
  {id:'general',label:'Worker',match:/.*/,hours:[480,1020],levels:[['Laborer',8],['Skilled Worker',15],['Supervisor',25],['Manager',39],['Proprietor',58]]}
];

function clampValue(v,min,max){return Math.max(min,Math.min(max,v));}
function hash(value){var h=2166136261,s=String(value),i;for(i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}h^=h>>>16;h=Math.imul(h,0x7feb352d);h^=h>>>15;h=Math.imul(h,0x846ca68b);h^=h>>>16;return(h>>>0)/4294967296;}
function integer(key,min,max){return Math.floor(min+hash(key)*(max-min+1));}
function pick(list,key){return list[Math.min(list.length-1,Math.floor(hash(key)*list.length))];}
function safe(value){return typeof esc==='function'?esc(String(value==null?'':value)):String(value==null?'':value).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function initials(name){return String(name||'?').split(/\s+/).slice(0,2).map(function(part){return part.charAt(0);}).join('').toUpperCase();}
function parcelName(p){return p&&(p.mainBuildingName||p.displayName||p.businessName||p.locationName||p.label||p.subtype)||'Unknown building';}
function currentLayout(){try{return layout(district(state.selected));}catch(err){return{blocks:[],roads:[]};}}
function entryLayoutKey(){return[String(state.mapName||''),String(state.selected||''),String(state.cityGridSeed||''),String(state.district3d&&state.district3d.seed||0)].join('|');}
function allEntries(force){var quickKey=entryLayoutKey();if(!force&&cachedEntryData&&cachedEntryKey===quickKey)return cachedEntryData;var l=currentLayout();if(!force&&cachedEntryData&&cachedEntryLayout===l){cachedEntryKey=quickKey;return cachedEntryData;}if(force)tripMinutesCache={};var entries=[],parcelIndex={};(l.blocks||[]).forEach(function(block){(block.parcels||[]).forEach(function(parcel){if(parcel&&parcel.id){entries.push({block:block,parcel:parcel});parcelIndex[parcel.id]=parcel;}});});cachedEntryLayout=l;cachedEntryKey=quickKey;cachedEntryData={layout:l,entries:entries,parcelIndex:parcelIndex};return cachedEntryData;}
function cityKey(data){var ids=data.entries.map(function(entry){return entry.parcel.id;});return String(state.mapName||'city')+'|'+String((state.district3d&&state.district3d.seed)||0)+'|'+ids.length+'|'+(ids[0]||'')+'|'+(ids[ids.length-1]||'');}
function parcelById(id){if(!id)return null;var data=allEntries(),parcel=data.parcelIndex&&data.parcelIndex[id];if(parcel)return parcel;try{return parcelInDistrict(id,state.selected);}catch(err){}return null;}
function personById(id){return population().peopleById[id]||null;}
function jobDefinition(parcel){var text=String((parcel&&parcel.subtype||'')+' '+(parcel&&parcel.businessName||'')+' '+(parcel&&parcel.category||''));return JOBS.find(function(def){return def.match.test(text);})||JOBS[JOBS.length-1];}
function personStats(key){return{Courage:integer(key+'-courage',12,94),Greed:integer(key+'-greed',8,95),Empathy:integer(key+'-empathy',10,96),Discipline:integer(key+'-discipline',12,94),Ambition:integer(key+'-ambition',8,97),Paranoia:integer(key+'-paranoia',5,92),Loyalty:integer(key+'-loyalty',10,96),Pride:integer(key+'-pride',8,96),'Notoriety Risk':integer(key+'-risk',4,90)};}
function disposition(stats,key){var compliance=clampValue(Math.round(55+stats.Empathy*.18+stats.Paranoia*.12-stats.Courage*.28-stats.Pride*.18),0,100),fear=clampValue(Math.round(42+stats.Paranoia*.36-stats.Courage*.28),0,100),police=clampValue(Math.round(35+stats.Discipline*.25+stats.Empathy*.14-stats.Loyalty*.12),0,100),mafia=clampValue(Math.round(28+stats.Greed*.18+stats.Loyalty*.14-stats.Discipline*.19),0,100);return{compliance:compliance,fear:fear,policeCooperation:police,mafiaAffinity:mafia,stubbornness:clampValue(Math.round(stats.Pride*.55+stats.Courage*.35),0,100),bribeThreshold:integer(key+'-bribe',12,80)};}
function behaviorTags(person){var d=person.disposition,s=person.personalityStats,t=[];if(d.stubbornness>72&&d.compliance<42)t.push('Defiant');if(d.fear>70)t.push('Timid');if(d.policeCooperation>72)t.push('Police Informant');if(d.mafiaAffinity>66)t.push('Mafia Sympathizer');if(s.Greed>75)t.push('Opportunist');if(s.Ambition>78)t.push('Ambitious');if(s.Empathy>76)t.push('Soft-hearted');if(!t.length)t.push('Ordinary Citizen');return t.slice(0,3);}
function makePerson(id,opts){opts=opts||{};var gender=opts.gender||((hash(id+'-gender')>.5)?'Male':'Female'),first=opts.first||pick(gender==='Male'?firstNamesMale:firstNamesFemale,id+'-first'),last=opts.last||pick(surnames,id+'-last'),name=opts.name||first+' '+last,stats=opts.personalityStats||personStats(id),age=opts.age==null?integer(id+'-age',18,72):opts.age,person={id:id,name:name,fullName:name,initials:initials(name),gender:gender,age:age,birthDay:integer(id+'-birthday',0,364),alive:opts.alive!==false,status:opts.status||'Alive',homeParcelId:opts.homeParcelId||'',householdId:opts.householdId||'',job:null,wealth:opts.wealth==null?integer(id+'-wealth',20,68):opts.wealth,money:opts.money==null?integer(id+'-cash',8,180):opts.money,influence:opts.influence==null?integer(id+'-influence',2,28):opts.influence,reputation:opts.reputation==null?integer(id+'-reputation',20,62):opts.reputation,personalityStats:stats,traits:(opts.traits||[]).slice(0,6),likes:opts.likes||[pick(likes,id+'-like-a'),pick(likes,id+'-like-b')],dislikes:opts.dislikes||[pick(dislikes,id+'-dislike')],goal:opts.goal||pick(goals,id+'-goal'),disposition:opts.disposition||disposition(stats,id),assets:opts.assets||{vehicle:false,homeOwned:false,businesses:[]},memories:opts.memories||[],relationships:opts.relationships||{},sourceRef:opts.sourceRef||null,bookmarked:false};person.behaviorTags=behaviorTags(person);return person;}
function attachPopulationAliases(pop){if(!pop)return pop;try{Object.defineProperty(pop,'agents',{configurable:true,enumerable:false,get:function(){return pop.people||[];}});}catch(err){pop.agents=pop.people||[];}var index={};(pop.people||[]).forEach(function(person){index[person.id]=person;});try{delete pop.peopleById;Object.defineProperty(pop,'peopleById',{configurable:true,enumerable:false,writable:true,value:index});}catch(err){pop.peopleById=index;}return pop;}
function population(){if(!state.population||typeof state.population!=='object')state.population={};return attachPopulationAliases(state.population);}
function addPerson(pop,person){if(pop.peopleById[person.id])return pop.peopleById[person.id];if(!person.sourceRef&&pop.people.some(function(existing){return existing.name===person.name;})){var parts=person.name.split(' '),middle=String.fromCharCode(65+integer(person.id+'-middle',0,25));person.name=person.fullName=parts[0]+' '+middle+'. '+parts.slice(1).join(' ');person.initials=initials(person.name);}pop.people.push(person);pop.peopleById[person.id]=person;return person;}
function newCivilian(pop,key,household,opts){opts=opts||{};var id='citizen-'+key,person=makePerson(id,Object.assign({last:household.surname,homeParcelId:household.homeParcelId,householdId:household.id,wealth:household.wealth},opts));addPerson(pop,person);household.memberIds.push(person.id);return person;}
function householdUnitCount(parcel,key){var text=String(parcel.subtype||'').toLowerCase(),capacity=typeof parcelHouseholdCapacity==='function'?parcelHouseholdCapacity(parcel):1;if(/small house|duplex|villa|mansion/.test(text))return/duplex/.test(text)?2:1;if(/apartment|tenement|condo/.test(text))return clampValue(Math.max(2,Math.round(capacity*.65)),2,4);return clampValue(Math.max(1,Math.round(capacity*.42)),1,3);}
function createHouseholds(pop,homes){homes.forEach(function(entry,homeIndex){var parcel=entry.parcel,units=householdUnitCount(parcel,'home-'+homeIndex);for(var unit=0;unit<units&&pop.people.length<MAX_PEOPLE;unit++){var key=parcel.id+'-'+unit,surname=pick(surnames,key+'-surname'),household={id:'household-'+key,homeParcelId:parcel.id,surname:surname,wealth:integer(key+'-wealth',14,82),memberIds:[],ownerOccupier:hash(key+'-owner')>.48,createdDay:0};pop.households.push(household);pop.buildingResidents[parcel.id]=(pop.buildingResidents[parcel.id]||[]);var adultCount=hash(key+'-couple')>.29?2:1;for(var a=0;a<adultCount;a++)newCivilian(pop,key+'-adult-'+a,household,{gender:a===1?(hash(key+'-pair')>.5?'Female':'Male'):undefined,age:integer(key+'-adult-age-'+a,21,68)});var children=integer(key+'-children',0,3);for(var c=0;c<children;c++)newCivilian(pop,key+'-child-'+c,household,{age:integer(key+'-child-age-'+c,0,17)});pop.buildingResidents[parcel.id]=pop.buildingResidents[parcel.id].concat(household.memberIds);if(!pop.buildingOwners[parcel.id])pop.buildingOwners[parcel.id]=household.memberIds[0];household.memberIds.forEach(function(id){var person=pop.peopleById[id];person.assets.homeOwned=household.ownerOccupier&&id===household.memberIds[0];});}});}
function availableAdult(pop,key,homeFallback){var pool=pop.people.filter(function(person){return person.alive&&person.age>=18&&!person.job&&!person.sourceRef;});if(pool.length)return pool[Math.floor(hash(key)*pool.length)];if(pop.people.length>=MAX_PEOPLE)return null;var household=pop.households[Math.floor(hash(key+'-house')*Math.max(1,pop.households.length))];if(!household){household={id:'household-workers',homeParcelId:homeFallback||'',surname:pick(surnames,key),wealth:28,memberIds:[],ownerOccupier:false,createdDay:0};pop.households.push(household);}return newCivilian(pop,key+'-worker-'+pop.people.length,household,{age:integer(key+'-age',19,57)});}
function employmentSlots(parcel){var text=String(parcel.subtype||'').toLowerCase(),slots=2;if(/warehouse|factory|hospital|school|hotel|bank/.test(text))slots=5;else if(/restaurant|bar|market|office|workshop/.test(text))slots=3;else if(/church|clinic|small/.test(text))slots=2;return slots;}
function assignJob(person,parcel,def,owner,key){
  var max=def.levels.length-1,level=owner?max:clampValue(integer(key+'-level',0,Math.min(2,max)),0,max),career=def.levels[level];
  person.job={id:'job-'+person.id+'-'+parcel.id,careerId:def.id,careerName:def.label,title:owner?(career[0].indexOf('Owner')>=0||career[0].indexOf('Proprietor')>=0?career[0]:'Proprietor'):career[0],level:level,employerParcelId:parcel.id,weeklyIncome:owner?Math.round(career[1]*1.35):career[1],performance:integer(key+'-performance',25,88),experienceDays:integer(key+'-experience',0,1600),owner:!!owner,shiftStart:def.hours[0]+integer(key+'-start-jitter',-30,30),shiftEnd:def.hours[1]+integer(key+'-end-jitter',-30,30),freeDay:integer(key+'-free-day',0,6)};
  var reserveWeeks=owner?integer(key+'-owner-reserve',7,18):integer(key+'-worker-reserve',1,7);
  person.money=Math.round(person.job.weeklyIncome*reserveWeeks+person.wealth*(owner?3.2:.7));
  person.economyVersion=VERSION;
  person.assets.businesses=person.assets.businesses||[];
  if(owner&&person.assets.businesses.indexOf(parcel.id)<0)person.assets.businesses.push(parcel.id);
  person.influence=clampValue(person.influence+(owner?18:4),0,100);
}

var MAFIA_ECONOMY={
  'Street Punk':{income:[10,18],cash:[18,90]},
  'Prospect':{income:[14,24],cash:[35,150]},
  'Associate':{income:[22,40],cash:[90,420]},
  'Soldier':{income:[48,85],cash:[450,1400]},
  'Senior Soldier':{income:[70,110],cash:[900,2400]},
  'Lieutenant':{income:[100,175],cash:[1600,4800]},
  'Capo':{income:[125,220],cash:[2200,6500]},
  'Consigliere':{income:[240,390],cash:[6500,18000]},
  'Underboss':{income:[275,450],cash:[8000,22000]},
  'Boss':{income:[550,900],cash:[22000,60000]},
  'Bookkeeper':{income:[75,130],cash:[900,3200]},
  'Political Contact':{income:[110,210],cash:[1800,7000]}
};
function mafiaEconomy(id,rank,performance){
  rank=typeof normalizedMafiaRank==='function'?normalizedMafiaRank(rank||'Associate'):(rank||'Associate');
  var band=MAFIA_ECONOMY[rank]||MAFIA_ECONOMY.Associate,performanceScale=clampValue(Number(performance||50)/100,.25,1);
  return{
    weeklyIncome:Math.round(band.income[0]+(band.income[1]-band.income[0])*(hash(id+'-mafia-income')*.55+performanceScale*.45)),
    cash:integer(id+'-mafia-cash',band.cash[0],band.cash[1])
  };
}
function assignDependentRoles(pop){pop.people.forEach(function(person){if(person.age>=18||person.job)return;person.job={id:'dependent-'+person.id,careerId:'student',careerName:'Education',title:person.age<6?'Child':'Schoolchild',level:0,employerParcelId:'',weeklyIncome:0,performance:integer(person.id+'-school-performance',25,92),experienceDays:Math.max(0,person.age-5)*180,owner:false,shiftStart:480,shiftEnd:900,freeDay:0};});}
function assignBuildings(pop,data){var homeFallback=(data.entries.find(function(e){return String(e.parcel.category||'').toLowerCase()==='residential';})||{}).parcel,nonResidential=data.entries.filter(function(entry){return!entry.parcel.isFamilyEstate&&!entry.parcel.isPlayerSafehouse&&String(entry.parcel.category||'').toLowerCase()!=='residential';});nonResidential.forEach(function(entry,index){var p=entry.parcel,def=jobDefinition(p),owner=availableAdult(pop,'owner-'+p.id,homeFallback&&homeFallback.id);if(owner)assignJob(owner,p,def,true,'owner-'+p.id);else{var ownerPool=pop.people.filter(function(person){return person.alive&&person.age>=21&&person.job&&person.job.owner;});if(!ownerPool.length)ownerPool=pop.people.filter(function(person){return person.alive&&person.age>=21;});owner=ownerPool[Math.floor(hash('fallback-owner-'+p.id)*Math.max(1,ownerPool.length))];if(owner){owner.assets.businesses=owner.assets.businesses||[];if(owner.assets.businesses.indexOf(p.id)<0)owner.assets.businesses.push(p.id);owner.influence=clampValue(owner.influence+3,0,100);}}if(!owner)return;pop.buildingOwners[p.id]=owner.id;pop.buildingEmployees[p.id]=[owner.id];p.ownerPersonId=owner.id;p.ownerName=owner.name;var slots=employmentSlots(p);for(var i=1;i<slots;i++){var worker=availableAdult(pop,'employee-'+p.id+'-'+i,homeFallback&&homeFallback.id);if(!worker)break;assignJob(worker,p,def,false,'employee-'+p.id+'-'+i);pop.buildingEmployees[p.id].push(worker.id);}});data.entries.filter(function(entry){return String(entry.parcel.category||'').toLowerCase()==='residential';}).forEach(function(entry){var ownerId=pop.buildingOwners[entry.parcel.id],owner=pop.peopleById[ownerId];entry.parcel.ownerPersonId=ownerId;entry.parcel.ownerName=owner&&owner.name||'Unknown owner';});pop.people.filter(function(person){return person.age>=18&&!person.job&&!person.sourceRef;}).forEach(function(person,index){person.job={id:'jobless-'+person.id,careerId:'unemployed',careerName:'Unemployed',title:index%3===0?'Looking for Work':'Unemployed',level:0,employerParcelId:'',weeklyIncome:index%4===0?3:0,performance:integer(person.id+'-job-search',18,74),experienceDays:0,owner:false,shiftStart:570,shiftEnd:750,freeDay:0};});}
function parcelTripMinutes(fromId,toId,mode){
  var key=String(fromId||'')+'>'+String(toId||'')+'|'+String(mode||'walk');
  if(tripMinutesCache[key]!=null)return tripMinutesCache[key];
  var from=parcelById(fromId),to=parcelById(toId);
  if(!from||!to||!from.polygon||!to.polygon)return tripMinutesCache[key]=mode==='car'?10:15;
  var a=centroid(from.polygon),b=centroid(to.polygon),worldDistance=(Math.abs(Number(b.x||0)-Number(a.x||0))+Math.abs(Number(b.y||0)-Number(a.y||0)))*.1+1.2;
  return tripMinutesCache[key]=clampValue(Math.ceil(worldDistance/(mode==='car'?CAR_SPEED:WALK_SPEED)),2,150);
}
function applySchedules(pop,data){
  var leisure=data.entries.filter(function(entry){return leisurePatterns.test(String(entry.parcel.subtype||'')+' '+String(entry.parcel.businessName||''));}).map(function(entry){return entry.parcel.id;}),schools=data.entries.filter(function(entry){return /school|academy|college/i.test(String(entry.parcel.subtype||''));}).map(function(entry){return entry.parcel.id;});
  pop.people.forEach(function(person){
    var job=person.job||{},carEligible=person.age>=22&&person.wealth>60&&person.money>220&&hash(person.id+'-car')>.58,mode;
    person.assets.vehicle=!!(person.assets.vehicle||carEligible);
    mode=person.assets.vehicle?'car':'walk';
    person.schedule={homeParcelId:person.homeParcelId,workParcelId:job.employerParcelId||'',leisureParcelId:leisure.length?leisure[Math.floor(hash(person.id+'-leisure-place')*leisure.length)]:'',schoolParcelId:person.age<18&&schools.length?schools[Math.floor(hash(person.id+'-school')*schools.length)]:'',shiftStart:job.shiftStart||540,shiftEnd:job.shiftEnd||960,freeDay:job.freeDay==null?0:job.freeDay,commuteMinutes:parcelTripMinutes(person.homeParcelId,job.employerParcelId||person.homeParcelId,mode),mode:mode};
  });
}
function familySources(){var out=[];try{var f=ensureFamilyPhase2();(f.bloodFamily&&f.bloodFamily.members||[]).forEach(function(c){out.push({tree:'Blood Family',character:c});});(f.mafiaFamily&&f.mafiaFamily.members||[]).forEach(function(c){if(c.id!=='player')out.push({tree:'Mafia Family',character:c});});}catch(err){}return out;}
function syncFamilyCharacters(pop,data){
  var safe=typeof findPlayerSafehouse==='function'?findPlayerSafehouse():null;
  var estate=typeof findFamilyEstate==='function'?findFamilyEstate():null;
  var homes=data.entries.filter(function(entry){return String(entry.parcel.category||'').toLowerCase()==='residential';}).map(function(entry){return entry.parcel.id;});
  var playerSource=null;
  try{playerSource=familyPlayerCard();}catch(err){playerSource=state.creatorCharacter||{id:'player',fullName:'Player'};}
  var sources=[{tree:'Player',character:Object.assign({},playerSource,{id:'player'})}].concat(familySources());
  sources.forEach(function(source,index){
    var c=source.character,id=c.id||('family-'+index),person=pop.peopleById[id];
    var homeId=source.tree==='Blood Family'&&safe&&safe.parcel?safe.parcel.id:source.tree==='Mafia Family'&&estate&&estate.parcel&&normalizedMafiaRank(c.rank)==='Boss'?estate.parcel.id:(homes.length?homes[Math.floor(hash(id+'-family-home')*homes.length)]:(safe&&safe.parcel&&safe.parcel.id)||'');
    if(!person){
      person=makePerson(id,{name:c.fullName||c.name||id,age:c.age||40,homeParcelId:homeId,wealth:source.tree==='Mafia Family'?72:55,influence:source.tree==='Mafia Family'?65:32,reputation:c.reputation||50,traits:c.traits||[],personalityStats:c.personalityStats,sourceRef:{tree:source.tree,id:id}});
      addPerson(pop,person);
      var household={id:'household-family-'+id,homeParcelId:homeId,surname:String(person.name).split(' ').pop(),wealth:person.wealth,memberIds:[id],ownerOccupier:false,createdDay:state.day||0};
      pop.households.push(household);
      person.householdId=household.id;
      if(homeId){
        pop.buildingResidents[homeId]=pop.buildingResidents[homeId]||[];
        if(pop.buildingResidents[homeId].indexOf(id)<0)pop.buildingResidents[homeId].push(id);
      }
    }
    person.name=person.fullName=c.fullName||c.name||person.name;
    person.initials=initials(person.name);
    person.age=c.age||person.age;
    person.traits=(c.traits||person.traits||[]).slice(0,6);
    person.sourceRef={tree:source.tree,id:id};
    if(source.tree==='Mafia Family'){
      person.affiliation='Moretti Family';
      person.mafiaRank=c.rank||'Associate';
      var economy=mafiaEconomy(id,person.mafiaRank,c.performanceScore||50);
      person.job={id:'mafia-'+id,careerId:'mafia',careerName:'Organized Crime',title:c.rank||'Associate',level:0,employerParcelId:estate&&estate.parcel&&estate.parcel.id||'',weeklyIncome:economy.weeklyIncome,performance:c.performanceScore||50,experienceDays:integer(id+'-mafia-days',40,4200),owner:false,shiftStart:660,shiftEnd:1260,freeDay:0};
      if(person.economyVersion!==VERSION){person.money=economy.cash;person.economyVersion=VERSION;}
    }else if(source.tree==='Player'){
      person.affiliation='Player';
    }
    c.populationPersonId=person.id;
    c.worldStatus=person.status;
    c.worldHomeParcelId=person.homeParcelId;
  });
  applySchedules(pop,data);
}
function assignSpecialBuildingOwners(pop){var estate=typeof findFamilyEstate==='function'?findFamilyEstate():null,safe=typeof findPlayerSafehouse==='function'?findPlayerSafehouse():null;if(estate&&estate.parcel){var boss=pop.people.find(function(person){return person.sourceRef&&person.sourceRef.tree==='Mafia Family'&&normalizedMafiaRank(person.mafiaRank)==='Boss';});if(boss){pop.buildingOwners[estate.parcel.id]=boss.id;pop.buildingEmployees[estate.parcel.id]=pop.people.filter(function(person){return person.sourceRef&&person.sourceRef.tree==='Mafia Family';}).map(function(person){return person.id;});}}if(safe&&safe.parcel&&!pop.buildingOwners[safe.parcel.id])pop.buildingOwners[safe.parcel.id]=(pop.buildingResidents[safe.parcel.id]||[])[0]||'player';}
function syncFollowMissionTargets(pop){var candidates=pop.people.filter(function(person){return person&&person.alive&&person.id!=='player'&&person.age>=18&&person.status!=='Child'&&(!person.job||person.job.careerId!=='student');});if(!candidates.length)return;var seen={};[state.integratedOrders||[],state.streetJobs||[]].forEach(function(orders){orders.forEach(function(order){if(!order||order.type!=='follow'||seen[order.id])return;seen[order.id]=true;var current=order.target&&pop.peopleById[order.target.id];if(current&&current.alive&&current.age>=18)return;var target=candidates[Math.floor(hash((order.id||'follow')+'-persistent-target')*candidates.length)];order.target={id:target.id,name:target.name};});});}
function generatePopulation(data){
  var started=performance.now(),timing={},step=started,pop={version:VERSION,cityKey:cityKey(data),people:[],peopleById:{},households:[],buildingOwners:{},buildingResidents:{},buildingEmployees:{},lifeLog:[],lastSimulatedDay:Number(state.day)||0,generatedAt:Date.now(),stats:{}};
  attachPopulationAliases(pop);
  var homes=data.entries.filter(function(entry){return!entry.parcel.isFamilyEstate&&String(entry.parcel.category||'').toLowerCase()==='residential';});
  createHouseholds(pop,homes);timing.householdsMs=Math.round(performance.now()-step);step=performance.now();
  assignBuildings(pop,data);timing.buildingsMs=Math.round(performance.now()-step);step=performance.now();
  assignDependentRoles(pop);timing.dependentsMs=Math.round(performance.now()-step);step=performance.now();
  syncFamilyCharacters(pop,data);timing.familyMs=Math.round(performance.now()-step);step=performance.now();
  assignSpecialBuildingOwners(pop);syncFollowMissionTargets(pop);timing.specialMs=Math.round(performance.now()-step);step=performance.now();
  pop.stats={people:pop.people.length,households:pop.households.length,employed:pop.people.filter(function(p){return p.job&&p.job.careerId!=='unemployed'&&p.job.careerId!=='student';}).length,businessOwners:Object.keys(pop.buildingOwners).length};
  state.population=pop;attachPopulationAliases(pop);applyPopulationToParcels(pop,data);timing.parcelsMs=Math.round(performance.now()-step);timing.totalMs=Math.round(performance.now()-started);
  try{Object.defineProperty(pop,'_generationTiming',{configurable:true,enumerable:false,writable:true,value:timing});}catch(err){pop._generationTiming=timing;}
  return pop;
}
function applyPopulationToParcels(pop,data){data.entries.forEach(function(entry){var p=entry.parcel,owner=pop.peopleById[pop.buildingOwners[p.id]],residents=pop.buildingResidents[p.id]||[],employees=pop.buildingEmployees[p.id]||[];p.ownerPersonId=owner&&owner.id||'';p.ownerName=owner&&owner.name||p.ownerName||'Unknown owner';p.residentPersonIds=residents.slice();p.employeePersonIds=employees.slice();if(residents.length){p.totalResidents=residents.filter(function(id){var person=pop.peopleById[id];return person&&person.alive;}).length;p.residenceAssignment=p.residenceAssignment||{};p.residenceAssignment.residents=p.totalResidents;p.residenceAssignment.occupants=residents.slice(0,12).map(function(id){var person=pop.peopleById[id];return{name:person.name,role:person.age<18?'Child':person.job&&person.job.title||'Resident',age:person.age,personId:id};});}});}
function ensureWorld(force){var data=allEntries(force),key=cityKey(data),pop=population();if(force||pop.version!==VERSION||pop.cityKey!==key||!Array.isArray(pop.people)||!pop.people.length){payloadCache={};pop=generatePopulation(data);pop.lastMaintenanceDay=Number(state.day)||0;}else{attachPopulationAliases(pop);var maintenanceDay=Number(state.day)||0;if(pop.lastMaintenanceDay!==maintenanceDay){syncFamilyCharacters(pop,data);assignSpecialBuildingOwners(pop);syncFollowMissionTargets(pop);applyPopulationToParcels(pop,data);pop.lastMaintenanceDay=maintenanceDay;payloadCache={};}}return pop;}

function dayOfWeek(day){return(5+(Number(day)||0))%7;}
function between(minute,start,end){if(end<=1440)return minute>=start&&minute<end;var local=minute<end-1440?minute+1440:minute;return local>=start&&local<end;}
function travelState(person,from,to,start,duration,minute,activity){var local=minute;if(start+duration>1440&&minute<start+duration-1440)local+=1440;return{moving:true,inside:false,fromParcelId:from,toParcelId:to,progress:clampValue((local-start)/Math.max(1,duration),0,1),durationMinutes:duration,activity:activity,mode:person.schedule.mode,routeId:person.id+'-'+state.day+'-'+start+'-'+from+'-'+to};}
function stateAt(person,day,minute){
  if(!person||!person.alive)return{inside:true,activity:'Deceased',parcelId:person&&person.homeParcelId||''};
  var s=person.schedule||{},home=s.homeParcelId||person.homeParcelId,work=person.age<18?s.schoolParcelId:s.workParcelId,weekDay=dayOfWeek(day),mode=s.mode||'walk',commute=parcelTripMinutes(home,work||home,mode),free=weekDay===s.freeDay||weekDay===0;
  if(!work||free){
    var leisure=s.leisureParcelId||home,start=600+integer(person.id+'-free-start-'+day,0,150),stay=90+integer(person.id+'-free-stay-'+day,0,120),outTrip=parcelTripMinutes(home,leisure,mode),returnTrip=parcelTripMinutes(leisure,home,mode);
    if(leisure&&leisure!==home&&between(minute,start,start+outTrip))return travelState(person,home,leisure,start,outTrip,minute,'Going out');
    if(leisure&&leisure!==home&&between(minute,start+outTrip,start+outTrip+stay))return{inside:true,parcelId:leisure,activity:person.job&&person.job.careerId==='unemployed'?'Looking for work':'Free time'};
    if(leisure&&leisure!==home&&between(minute,start+outTrip+stay,start+outTrip+stay+returnTrip))return travelState(person,leisure,home,start+outTrip+stay,returnTrip,minute,'Returning home');
    return{inside:true,parcelId:home,activity:'At home'};
  }
  var start=Number(s.shiftStart)||540,end=Number(s.shiftEnd)||1020,depart=start-commute,lunchStart=720+integer(person.id+'-lunch-'+day,-30,45),leisure=s.leisureParcelId,lunchOut=parcelTripMinutes(work,leisure||work,mode),lunchBack=parcelTripMinutes(leisure||work,work,mode),lunchStay=30;
  if(between(minute,depart,start))return travelState(person,home,work,depart,commute,minute,'Commuting to work');
  if(leisure&&leisure!==work&&between(minute,lunchStart,lunchStart+lunchOut))return travelState(person,work,leisure,lunchStart,lunchOut,minute,'Lunch errand');
  if(leisure&&leisure!==work&&between(minute,lunchStart+lunchOut,lunchStart+lunchOut+lunchStay))return{inside:true,parcelId:leisure,activity:'Lunch'};
  if(leisure&&leisure!==work&&between(minute,lunchStart+lunchOut+lunchStay,lunchStart+lunchOut+lunchStay+lunchBack))return travelState(person,leisure,work,lunchStart+lunchOut+lunchStay,lunchBack,minute,'Returning to work');
  if(between(minute,start,end))return{inside:true,parcelId:work,activity:'Working'};
  if(end>1440&&minute<end-1440)return{inside:true,parcelId:work,activity:'Working'};
  if(between(minute,end,end+commute))return travelState(person,work,home,end,commute,minute,'Returning home');
  return{inside:true,parcelId:home,activity:'At home'};
}
function currentPersonState(person){return stateAt(person,Number(state.day)||0,Number(state.timeMinuteOfDay)||360);}
function renderPopulationLimit(mode,night){var speed=Number(state.timeSpeed)||1,limit=mode==='car'?MAX_VISIBLE_CARS:MAX_VISIBLE_PEDESTRIANS;if(speed>=40)return 0;if(speed>=20)limit=mode==='car'?7:18;if(night&&mode==='walk')limit=Math.min(limit,Math.max(2,Math.ceil(MAX_VISIBLE_PEDESTRIANS*.05)));return limit;}
function populationRenderOrder(pop){
  var key=String(pop.cityKey||'city')+'|'+pop.people.length;
  if(pop._renderOrderKey===key&&Array.isArray(pop._renderOrder))return pop._renderOrder;
  var order=pop.people.slice().sort(function(a,b){return hash(a.id+'-render-order')-hash(b.id+'-render-order');});
  try{Object.defineProperties(pop,{_renderOrderKey:{configurable:true,enumerable:false,writable:true,value:key},_renderOrder:{configurable:true,enumerable:false,writable:true,value:order}});}catch(err){pop._renderOrderKey=key;pop._renderOrder=order;}
  return order;
}
function populationPayloads(pop){
  pop=pop||ensureWorld();
  var minute=Number(state.timeMinuteOfDay)||360,night=minute<360||minute>=1260,key=[pop.cityKey,pop.version,state.day,minute,state.timeSpeed||1].join('|');
  if(payloadCache[key])return payloadCache[key];
  var result={walk:[],car:[]},walkLimit=renderPopulationLimit('walk',night),carLimit=renderPopulationLimit('car',night);
  if(!walkLimit&&!carLimit){payloadCache={};payloadCache[key]=result;return result;}
  var roster=populationRenderOrder(pop);
  for(var i=0;i<roster.length;i++){
    if(result.walk.length>=walkLimit&&result.car.length>=carLimit)break;
    var person=roster[i];
    if(person.id==='player'||!person.alive)continue;
    var current=currentPersonState(person);
    person.current=current;
    if(!current.moving||(current.mode!=='walk'&&current.mode!=='car'))continue;
    if(current.mode==='walk'&&result.walk.length>=walkLimit)continue;
    if(current.mode==='car'&&result.car.length>=carLimit)continue;
    result[current.mode].push({id:person.id,name:person.name,role:person.job&&person.job.title||'Resident',seed:hash(person.id),speed:current.mode==='car'?CAR_SPEED:WALK_SPEED,color:integer(person.id+'-coat',0,4),scheduled:true,fromParcelId:current.fromParcelId,toParcelId:current.toParcelId,progress:current.progress,durationMinutes:current.durationMinutes,activity:current.activity,mode:current.mode,routeId:current.routeId,inside:false,moving:true});
  }
  payloadCache={};payloadCache[key]=result;return result;
}
function populationPayload(mode,pop){var result=populationPayloads(pop);return mode==='car'?result.car:result.walk;}

function logLife(pop,type,person,text){pop.lifeLog.unshift({day:state.day,time:state.time,type:type,personId:person&&person.id||'',text:text});pop.lifeLog=pop.lifeLog.slice(0,160);}
function promotePerson(pop,person){var job=person.job,def=job&&JOBS.find(function(item){return item.id===job.careerId;});if(!job||!def||job.owner||job.level>=def.levels.length-1)return false;var next=def.levels[job.level+1],threshold=48+job.level*12;if(job.performance<threshold||job.experienceDays<(job.level+1)*180)return false;job.level++;job.title=next[0];job.weeklyIncome=next[1];person.influence=clampValue(person.influence+6,0,100);person.reputation=clampValue(person.reputation+4,0,100);logLife(pop,'Promotion',person,person.name+' was promoted to '+job.title+'.');return true;}
function dailyPopulationTick(pop,day){pop.people.slice().forEach(function(person){if(!person.alive)return;if(person.birthDay===day%365)person.age++;if(person.job){person.job.experienceDays=(person.job.experienceDays||0)+1;person.money=Math.max(0,Math.round((person.money||0)+(person.job.weeklyIncome||0)/7-(2+person.wealth*.035)));if(day>0&&day%30===0)promotePerson(pop,person);if(person.job.owner&&day>0&&day%30===0&&person.money>750&&person.personalityStats.Ambition>62){person.money-=350;person.influence=clampValue(person.influence+5,0,100);person.businessLevel=(person.businessLevel||1)+1;logLife(pop,'Business Expansion',person,person.name+' reinvested in '+(parcelName(parcelById(person.job.employerParcelId)))+'.');}}var mortality=person.age<55?.000003:person.age<70?.000025:person.age<82?.00012:.00042;if(hash(person.id+'-mortality-'+day)<mortality){person.alive=false;person.status='Deceased';logLife(pop,'Death',person,person.name+' died at age '+person.age+'.');}});pop.households.forEach(function(household){var adults=household.memberIds.map(personById).filter(function(person){return person&&person.alive&&person.age>=20&&person.age<=42;}),living=household.memberIds.map(personById).filter(function(person){return person&&person.alive;});if(adults.length>=1&&living.length<6&&day>0&&hash(household.id+'-birth-'+day)<.00012){var baby=newCivilian(pop,'birth-'+day+'-'+household.id,household,{age:0,gender:hash(household.id+'-baby-'+day)>.5?'Male':'Female'});baby.birthDay=day%365;baby.status='Alive';applySchedules(pop,allEntries());logLife(pop,'Birth',baby,baby.name+' was born.');}});pop.lastSimulatedDay=day;}
function simulatePopulation(minutes){var pop=ensureWorld(),target=Number(state.day)||0,last=Number(pop.lastSimulatedDay)||0,changed=last<target;while(last<target){last++;dailyPopulationTick(pop,last);}if(changed)payloadCache={};}

function ownerForParcel(parcel){var pop=ensureWorld(),id=parcel&&pop.buildingOwners[parcel.id];return id&&pop.peopleById[id]||null;}
function peopleAtParcel(parcelId,kind){var pop=ensureWorld(),ids=kind==='employees'?pop.buildingEmployees[parcelId]||[]:pop.buildingResidents[parcelId]||[];return ids.map(function(id){return pop.peopleById[id];}).filter(Boolean);}
function personRow(person){var current=currentPersonState(person),where=parcelName(parcelById(current.toParcelId||current.parcelId||person.homeParcelId));return'<button class="world-person-row '+(!person.alive?'deceased ':'')+(person.bookmarked?'bookmarked':'')+'" data-world-action="select" data-person-id="'+safe(person.id)+'"><span>'+safe(person.initials)+'</span><b>'+safe(person.name)+'</b><small>'+safe((person.job&&person.job.title)||'No occupation')+'</small><em>'+safe(current.moving?current.activity+' toward '+where:current.activity+' · '+where)+'</em></button>';}
function personDossier(person){if(!person)return'<section class="world-person-empty"><h3>Select a resident</h3><p>Every generated resident, owner, worker and family member can be searched here.</p></section>';var current=currentPersonState(person),home=parcelName(parcelById(person.homeParcelId)),work=person.job&&person.job.employerParcelId?parcelName(parcelById(person.job.employerParcelId)):'None',assets=(person.assets.businesses||[]).map(function(id){return parcelName(parcelById(id));}),source=person.sourceRef&&person.sourceRef.tree!=='Player'?'<button data-world-action="family" data-person-id="'+safe(person.id)+'">Open '+safe(person.sourceRef.tree)+' record</button>':'';return'<section class="world-person-dossier"><header><span>'+safe(person.initials)+'</span><div><small>'+safe(person.status)+' · Age '+person.age+'</small><h2>'+safe(person.name)+'</h2><p>'+safe((person.job&&person.job.title)||'No occupation')+'</p></div></header><div class="world-person-tags">'+person.behaviorTags.map(function(tag){return'<span>'+safe(tag)+'</span>';}).join('')+(person.affiliation?'<span>'+safe(person.affiliation)+'</span>':'')+'</div><div class="world-person-actions"><button class="primary" data-world-action="locate" data-person-id="'+safe(person.id)+'">Locate in City</button><button data-world-action="bookmark" data-person-id="'+safe(person.id)+'">'+(person.bookmarked?'Remove Bookmark':'Bookmark')+'</button>'+source+'</div><dl><div><dt>Current activity</dt><dd>'+safe(current.activity)+'</dd></div><div><dt>Home</dt><dd>'+safe(home)+'</dd></div><div><dt>Workplace</dt><dd>'+safe(work)+'</dd></div><div><dt>Weekly income</dt><dd>$'+Math.round(person.job&&person.job.weeklyIncome||0)+'</dd></div><div><dt>Personal cash</dt><dd>$'+Math.round(person.money||0)+'</dd></div><div><dt>Influence</dt><dd>'+Math.round(person.influence||0)+'</dd></div><div><dt>Reputation</dt><dd>'+Math.round(person.reputation||0)+'</dd></div><div><dt>Goal</dt><dd>'+safe(person.goal)+'</dd></div></dl><section><h3>Personality</h3><div class="world-stat-grid">'+['Courage','Greed','Empathy','Discipline','Ambition','Paranoia'].map(function(key){return'<span><small>'+key+'</small><b>'+Math.round(person.personalityStats[key]||0)+'</b></span>';}).join('')+'</div></section><section><h3>Preferences</h3><p><b>Likes:</b> '+safe(person.likes.join(', '))+'</p><p><b>Dislikes:</b> '+safe(person.dislikes.join(', '))+'</p></section><section><h3>Assets</h3><p>'+safe((person.assets.vehicle?'Motorcar · ':'')+(person.assets.homeOwned?'Home owner · ':'')+(assets.length?assets.join(', '):'No business assets'))+'</p></section><section><h3>Criminal disposition</h3><div class="world-stat-grid">'+[['Compliance',person.disposition.compliance],['Fear',person.disposition.fear],['Police cooperation',person.disposition.policeCooperation],['Mafia affinity',person.disposition.mafiaAffinity]].map(function(item){return'<span><small>'+item[0]+'</small><b>'+Math.round(item[1])+'</b></span>';}).join('')+'</div></section></section>';}
function peopleIndexView(){var pop=ensureWorld(),ui=state.populationUi||(state.populationUi={search:'',filter:'all',selectedPersonId:'',bookmarksOnly:false}),search=String(ui.search||'').toLowerCase(),list=pop.people.filter(function(person){if(ui.bookmarksOnly&&!person.bookmarked)return false;if(ui.filter==='owners'&&!(person.job&&person.job.owner))return false;if(ui.filter==='mafia'&&person.affiliation!=='Moretti Family')return false;if(ui.filter==='unemployed'&&(!person.job||person.job.careerId!=='unemployed'))return false;if(ui.filter==='deceased'&&person.alive)return false;return!search||String(person.name+' '+(person.job&&person.job.title||'')+' '+person.behaviorTags.join(' ')+' '+(person.affiliation||'')).toLowerCase().indexOf(search)>=0;}).sort(function(a,b){if(a.bookmarked!==b.bookmarked)return a.bookmarked?-1:1;return a.name.localeCompare(b.name);}),selected=pop.peopleById[ui.selectedPersonId]||list[0]||pop.people[0];if(selected)ui.selectedPersonId=selected.id;var employed=pop.people.filter(function(p){return p.alive&&p.job&&p.job.careerId!=='unemployed'&&p.job.careerId!=='student';}).length,alive=pop.people.filter(function(p){return p.alive;}).length;return'<div class="world-people-index"><header><div><small>Persistent city population</small><h2>People Index</h2><p>Every resident has a home, work, schedule, money, personality, assets and goals.</p></div><div class="world-population-stats"><span><b>'+alive+'</b> living</span><span><b>'+pop.households.length+'</b> households</span><span><b>'+employed+'</b> employed</span><span><b>'+Object.keys(pop.buildingOwners).length+'</b> property records</span></div></header><div class="world-people-tools"><input data-world-search value="'+safe(ui.search)+'" placeholder="Search name, job, trait or affiliation"><select data-world-filter><option value="all" '+(ui.filter==='all'?'selected':'')+'>Everyone</option><option value="owners" '+(ui.filter==='owners'?'selected':'')+'>Business owners</option><option value="mafia" '+(ui.filter==='mafia'?'selected':'')+'>Mafia members</option><option value="unemployed" '+(ui.filter==='unemployed'?'selected':'')+'>Looking for work</option><option value="deceased" '+(ui.filter==='deceased'?'selected':'')+'>Deceased</option></select><label><input type="checkbox" data-world-bookmarks '+(ui.bookmarksOnly?'checked':'')+'> Bookmarked only</label></div><div class="world-people-layout"><aside><small>'+list.length+' matches</small><div>'+list.slice(0,240).map(personRow).join('')+'</div></aside>'+personDossier(selected)+'</div></div>';}
function personSearchText(person){
  if(person._searchText)return person._searchText;
  var value=String(person.name+' '+(person.job&&person.job.title||'')+' '+person.behaviorTags.join(' ')+' '+(person.affiliation||'')).toLowerCase();
  try{Object.defineProperty(person,'_searchText',{configurable:true,enumerable:false,writable:true,value:value});}catch(err){person._searchText=value;}
  return value;
}
function filteredPeople(pop,ui){
  var search=String(ui.search||'').trim().toLowerCase();
  return pop.people.filter(function(person){
    if(ui.bookmarksOnly&&!person.bookmarked)return false;
    if(ui.filter==='owners'&&!(person.job&&person.job.owner))return false;
    if(ui.filter==='mafia'&&person.affiliation!=='Moretti Family')return false;
    if(ui.filter==='unemployed'&&(!person.job||person.job.careerId!=='unemployed'))return false;
    if(ui.filter==='deceased'&&person.alive)return false;
    return!search||personSearchText(person).indexOf(search)>=0;
  }).sort(function(a,b){
    if(a.bookmarked!==b.bookmarked)return a.bookmarked?-1:1;
    return a.name.localeCompare(b.name);
  });
}
function peopleRowsHtml(list,limit){return list.slice(0,limit||140).map(personRow).join('')||'<p class="world-no-results">No residents match this search.</p>';}
function refreshPeopleSearch(input){
  var root=input&&input.closest('.world-people-index');
  if(!root)return;
  var pop=ensureWorld(),ui=state.populationUi||(state.populationUi={}),list=filteredPeople(pop,ui),counter=root.querySelector('[data-world-match-count]'),rows=root.querySelector('[data-world-list]');
  if(counter)counter.textContent=list.length+' matches';
  if(rows)rows.innerHTML=peopleRowsHtml(list,ui.search?90:140);
}
peopleIndexView=function(){
  var pop=ensureWorld(),ui=state.populationUi||(state.populationUi={search:'',filter:'all',selectedPersonId:'',bookmarksOnly:false}),list=filteredPeople(pop,ui),selected=pop.peopleById[ui.selectedPersonId]||list[0]||pop.people[0];
  if(selected)ui.selectedPersonId=selected.id;
  var employed=pop.people.filter(function(p){return p.alive&&p.job&&p.job.careerId!=='unemployed'&&p.job.careerId!=='student';}).length,alive=pop.people.filter(function(p){return p.alive;}).length;
  return'<div class="world-people-index"><header><div><small>Persistent city population</small><h2>People Index</h2><p>Every resident has a home, work, schedule, money, personality, assets and goals.</p></div><div class="world-population-stats"><span><b>'+alive+'</b> living</span><span><b>'+pop.households.length+'</b> households</span><span><b>'+employed+'</b> employed</span><span><b>'+Object.keys(pop.buildingOwners).length+'</b> property records</span></div></header><div class="world-people-tools"><input type="search" autocomplete="off" spellcheck="false" data-world-search value="'+safe(ui.search)+'" placeholder="Search name, job, trait or affiliation"><select data-world-filter><option value="all" '+(ui.filter==='all'?'selected':'')+'>Everyone</option><option value="owners" '+(ui.filter==='owners'?'selected':'')+'>Business owners</option><option value="mafia" '+(ui.filter==='mafia'?'selected':'')+'>Mafia members</option><option value="unemployed" '+(ui.filter==='unemployed'?'selected':'')+'>Looking for work</option><option value="deceased" '+(ui.filter==='deceased'?'selected':'')+'>Deceased</option></select><label><input type="checkbox" data-world-bookmarks '+(ui.bookmarksOnly?'checked':'')+'> Bookmarked only</label></div><div class="world-people-layout"><aside><small data-world-match-count>'+list.length+' matches</small><div data-world-list>'+peopleRowsHtml(list)+'</div></aside>'+personDossier(selected)+'</div></div>';
};
function familyTabs(){var sub=state.familySubtab||'Blood Family';return'<div class="family-tabs family-tabs-clean"><button class="'+(sub==='Blood Family'?'active':'')+'" data-action="familySubtab" data-tab="Blood Family">Blood Family</button><button class="'+(sub==='Mafia Family'?'active':'')+'" data-action="familySubtab" data-tab="Mafia Family">Mafia Family</button><button class="'+(sub==='People Index'?'active':'')+'" data-action="familySubtab" data-tab="People Index">People Index</button></div>';}
function buildingPeoplePanel(parcel){if(!parcel||!parcel.id)return'';var owner=ownerForParcel(parcel),residents=peopleAtParcel(parcel.id,'residents'),employees=peopleAtParcel(parcel.id,'employees'),button=function(person,role){return'<button class="building-person-link" data-world-action="select" data-person-id="'+safe(person.id)+'"><span>'+safe(person.initials)+'</span><b>'+safe(person.name)+'</b><small>'+safe(role)+'</small></button>';};return'<section class="building-info-section building-people-panel"><h4>People <small>Persistent population</small></h4>'+(owner?'<div class="building-owner"><small>Owner / responsible party</small>'+button(owner,owner.job&&owner.job.title||'Owner')+'</div>':'<p class="muted">No owner record.</p>')+(employees.length?'<div><small>Workforce · '+employees.length+'</small>'+employees.slice(0,6).map(function(person){return button(person,person.job&&person.job.title||'Worker');}).join('')+'</div>':'')+(residents.length?'<div><small>Residents · '+residents.length+'</small>'+residents.slice(0,6).map(function(person){return button(person,person.age<18?'Child':person.job&&person.job.title||'Resident');}).join('')+'</div>':'')+'</section>';}

var baseFamilyView=typeof familyView==='function'?familyView:null;
if(baseFamilyView)familyView=function(){ensureWorld();if(state.familySubtab==='People Index')return'<section class="family-board phase2 family-clean">'+familyTabs()+peopleIndexView()+'</section>';var html=baseFamilyView();return html.replace(/<div class="family-tabs family-tabs-clean">[\s\S]*?<\/div>/,familyTabs());};
var baseBuildingInformation=typeof buildingInformationPanel==='function'?buildingInformationPanel:null;
if(baseBuildingInformation)buildingInformationPanel=function(d,p){var html=baseBuildingInformation(d,p);return html+buildingPeoplePanel(p);};
var baseDistrictPayload=district3dPayload,baseTimePayload=currentTimePayload,baseWork=processPlayerTimedWork,baseRender=render,baseGenerate=generateProceduralCity,baseOwnerThreshold=ownerThresholdFor,baseFinishExtortion=finishExtortion,baseCollect=collectRacketFromParcel;
district3dPayload=function(d,l){var payload=baseDistrictPayload(d,l),pop=ensureWorld();payload.populationAgents=populationPayload('walk',pop);payload.populationVehicles=populationPayload('car',pop);payload.populationSummary=pop.stats;payload.streetInfrastructure={lamps:true};return payload;};
currentTimePayload=function(){var payload=baseTimePayload(),pop=ensureWorld();payload.populationAgents=populationPayload('walk',pop);payload.populationVehicles=populationPayload('car',pop);payload.populationSummary=pop.stats;payload.streetInfrastructure={lamps:true};return payload;};
processPlayerTimedWork=function(minutes){baseWork(minutes);simulatePopulation(minutes);};
render=function(){ensureWorld();baseRender();};
generateProceduralCity=function(seed,isInitial,attempt){var result=baseGenerate(seed,isInitial,attempt);state.population={};cachedEntryData=null;cachedEntryLayout=null;cachedEntryKey='';payloadCache={};ensureWorld(true);return result;};
ownerThresholdFor=function(parcel){var existing=baseOwnerThreshold(parcel);if(existing&&existing!=='Neutral')return existing;var owner=ownerForParcel(parcel);if(!owner)return existing;var d=owner.disposition;if(d.stubbornness>75&&d.compliance<38)return'Defiant';if(d.fear>74)return'Terrified';if(d.mafiaAffinity>68)return'Receptive';if(d.compliance>62)return'Wary';return'Neutral';};
finishExtortion=function(success,mood,result,outcome){var parcel=state.extortionEncounter&&state.extortionEncounter.parcel,owner=parcel&&ownerForParcel(parcel),before=owner&&{fear:owner.disposition.fear,money:owner.money};baseFinishExtortion.apply(this,arguments);if(owner&&before){owner.disposition.fear=clampValue(before.fear+(success?result==='black'?28:result==='white'?18:6:-5),0,100);owner.disposition.mafiaAffinity=clampValue(owner.disposition.mafiaAffinity+(success?8:-14),0,100);owner.money=Math.max(0,before.money-(result==='gray'?Math.max(3,Math.round((parcel.propertyValue||1000)*.004)):0));owner.memories.unshift({day:state.day,type:'Extortion',text:success?'The player pressured '+owner.name+' at '+parcelName(parcel)+'.':'The player failed to pressure '+owner.name+'.',intensity:result==='black'?88:result==='white'?66:42});owner.behaviorTags=behaviorTags(owner);}};
collectRacketFromParcel=function(parcel){var owner=ownerForParcel(parcel),record=parcel&&state.protectedBusinesses&&state.protectedBusinesses[parcel.id],due=record&&record.weeklyDue||0;baseCollect(parcel);if(owner&&due&&record.lastCollectedDay===state.day){owner.money=Math.max(0,Math.round(owner.money-due));owner.memories.unshift({day:state.day,type:'Tribute',text:'Paid $'+Math.round(due)+' in protection tribute.',intensity:48});}};

document.addEventListener('click',function(event){var el=event.target.closest&&event.target.closest('[data-world-action]');if(!el)return;event.preventDefault();event.stopImmediatePropagation();var action=el.getAttribute('data-world-action'),id=el.getAttribute('data-person-id'),person=personById(id),ui=state.populationUi||(state.populationUi={});if(!person)return;if(action==='select'){state.tab='Family';state.familySubtab='People Index';ui.selectedPersonId=id;render();}else if(action==='bookmark'){person.bookmarked=!person.bookmarked;ui.selectedPersonId=id;render();}else if(action==='family'&&person.sourceRef){state.tab='Family';state.familySubtab=person.sourceRef.tree;state.selectedFamilyProfile=person.sourceRef.id;render();}else if(action==='locate'){var current=currentPersonState(person),parcel=parcelById(current.toParcelId||current.parcelId||person.homeParcelId);if(!parcel)return;state.tab='City';state.mapMode='district';state.selectedParcel=parcel.id;state.selected3dParcel=parcel;render();setTimeout(function(){var root=document.getElementById('district-three-root');if(root&&window.DeskDon3D&&window.DeskDon3D.focusParcel)window.DeskDon3D.focusParcel(root,parcel.id,centroid(parcel.polygon));},80);}},true);
document.addEventListener('input',function(event){if(event.target.matches('[data-world-search]')){state.populationUi=state.populationUi||{};state.populationUi.search=event.target.value;clearTimeout(window.__deskDonPopulationSearchTimer||0);var input=event.target;window.__deskDonPopulationSearchTimer=setTimeout(function(){refreshPeopleSearch(input);},65);}},true);
document.addEventListener('change',function(event){state.populationUi=state.populationUi||{};if(event.target.matches('[data-world-filter]')){state.populationUi.filter=event.target.value;render();}if(event.target.matches('[data-world-bookmarks]')){state.populationUi.bookmarksOnly=event.target.checked;render();}},true);

window.DeskDonPopulation={VERSION:VERSION,ensure:ensureWorld,person:personById,owner:ownerForParcel,atParcel:peopleAtParcel,stateAt:currentPersonState,jobs:JOBS,pedestrians:function(){return populationPayload('walk');},vehicles:function(){return populationPayload('car');},regenerate:function(){return ensureWorld(true);}};
var populationEnsureStarted=performance.now();
ensureWorld();
var populationEnsureFinished=performance.now();
render();
window.DeskDonPopulation.bootTiming={ensureMs:Math.round(populationEnsureFinished-populationEnsureStarted),moduleMs:Math.round(performance.now()-populationModuleStarted),generation:state.population&&state.population._generationTiming};
})();
