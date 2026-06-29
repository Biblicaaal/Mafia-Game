'use strict';
(function(root){
  var VERSION=1;
  var hasOwn=Object.prototype.hasOwnProperty;

  function object(value){return value&&typeof value==='object'&&!Array.isArray(value)?value:{};}
  function array(value){return Array.isArray(value)?value:[];}
  function valueAt(source,path){
    for(var i=0;i<path.length;i++){
      if(!source||!hasOwn.call(source,path[i]))return undefined;
      source=source[path[i]];
    }
    return source;
  }
  function setAt(source,path,value){
    for(var i=0;i<path.length-1;i++){source[path[i]]=object(source[path[i]]);source=source[path[i]];}
    source[path[path.length-1]]=value;
  }
  function legacyValue(state,key){
    var descriptor=Object.getOwnPropertyDescriptor(state,key);
    return descriptor&&hasOwn.call(descriptor,'value')?descriptor.value:undefined;
  }
  function first(current,fallback){return current===undefined?fallback:current;}

  function normalize(state){
    var game=object(state.gameState);
    state.gameState=game;
    game.version=VERSION;
    game.player=object(game.player);
    game.player.money=object(game.player.money);
    game.player.money.clean=Number(first(game.player.money.clean,legacyValue(state,'clean')))||0;
    game.player.money.dirty=Number(first(game.player.money.dirty,legacyValue(state,'dirty')))||0;
    game.player.location=first(game.player.location,legacyValue(state,'playerLocation'))||null;

    game.economy=object(game.economy);
    game.economy.heldEnvelopes=array(first(game.economy.heldEnvelopes,legacyValue(state,'collectionEnvelopes')));
    game.economy.mafia=object(first(game.economy.mafia,legacyValue(state,'organizationFinance')));
    game.economy.mafia.coffers=Number(game.economy.mafia.coffers)||0;
    game.economy.mafia.ledger=array(game.economy.mafia.ledger);

    game.world=object(game.world);
    game.world.protectedBuildings=object(first(game.world.protectedBuildings,legacyValue(state,'protectedBusinesses')));
    game.world.scouting=object(first(game.world.scouting,legacyValue(state,'buildingIntel')));
    game.world.pressure=object(game.world.pressure);
    game.world.pressure.heat=Number(first(game.world.pressure.heat,legacyValue(state,'heat')))||0;
    game.world.pressure.police=Number(first(game.world.pressure.police,legacyValue(state,'police')))||0;

    game.selection=object(game.selection);
    game.selection.districtId=first(game.selection.districtId,legacyValue(state,'selected'))||'';
    game.selection.buildingId=first(game.selection.buildingId,legacyValue(state,'selectedParcel'))||'';
    game.selection.renderedBuilding=first(game.selection.renderedBuilding,legacyValue(state,'selected3dParcel'))||null;
    game.selection.contextBuilding=first(game.selection.contextBuilding,legacyValue(state,'contextParcel'))||null;

    game.clock=object(game.clock);
    game.clock.day=Number(first(game.clock.day,legacyValue(state,'day')))||0;
    game.clock.period=first(game.clock.period,legacyValue(state,'time'))||'Morning';
    var minuteOfDay=first(game.clock.minuteOfDay,legacyValue(state,'timeMinuteOfDay'));
    game.clock.minuteOfDay=minuteOfDay===undefined?undefined:(Number(minuteOfDay)||0);

    game.safehouse=object(game.safehouse);
    game.safehouse.assignment=first(game.safehouse.assignment,legacyValue(state,'playerSafehouse'))||null;
    game.safehouse.rent=first(game.safehouse.rent,legacyValue(state,'safehouseRent'))||null;
    game.safehouse.needs=first(game.safehouse.needs,legacyValue(state,'safehouseNeeds'))||null;
    game.safehouse.utilities=first(game.safehouse.utilities,legacyValue(state,'safehouseUtilities'))||null;
    game.safehouse.ownership=first(game.safehouse.ownership,legacyValue(state,'safehouseOwnership'))||null;

    game.progression=first(game.progression,legacyValue(state,'playerProgress'))||null;
    game.communications=object(game.communications);
    game.communications.messages=array(first(game.communications.messages,legacyValue(state,'messages')));
    game.communications.logs=array(first(game.communications.logs,legacyValue(state,'logs')));
    return game;
  }

  var aliases={
    clean:['player','money','clean'],dirty:['player','money','dirty'],playerLocation:['player','location'],
    collectionEnvelopes:['economy','heldEnvelopes'],organizationFinance:['economy','mafia'],
    protectedBusinesses:['world','protectedBuildings'],buildingIntel:['world','scouting'],heat:['world','pressure','heat'],police:['world','pressure','police'],
    selected:['selection','districtId'],selectedParcel:['selection','buildingId'],selected3dParcel:['selection','renderedBuilding'],contextParcel:['selection','contextBuilding'],
    day:['clock','day'],time:['clock','period'],timeMinuteOfDay:['clock','minuteOfDay'],
    playerSafehouse:['safehouse','assignment'],safehouseRent:['safehouse','rent'],safehouseNeeds:['safehouse','needs'],safehouseUtilities:['safehouse','utilities'],safehouseOwnership:['safehouse','ownership'],
    playerProgress:['progression'],messages:['communications','messages'],logs:['communications','logs']
  };

  function attach(state){
    if(!state||typeof state!=='object')throw new Error('GameState requires a state object.');
    normalize(state);
    Object.keys(aliases).forEach(function(key){
      var descriptor=Object.getOwnPropertyDescriptor(state,key);
      if(descriptor&&descriptor.get&&descriptor.get.__gameStateAlias)return;
      var path=aliases[key];
      var getter=function(){return valueAt(state.gameState,path);};
      getter.__gameStateAlias=true;
      Object.defineProperty(state,key,{configurable:true,enumerable:false,get:getter,set:function(value){setAt(state.gameState,path,value);}});
    });
    return state;
  }

  root.DeskDonGameState={VERSION:VERSION,attach:attach,normalize:normalize,get:function(state){return normalize(state);}};
})(window);
