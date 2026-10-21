const assert=require('node:assert/strict');
const {load,select}=require('./kupon-sports.js');
const teams={Home:'H',Away:'A',Other:'O'};
const resolve=x=>teams[x]||null;
const time=e=>e.dateEvent?Date.parse(e.dateEvent+'T12:00:00Z'):null;
const mk=(id,round,home='Home',away='Away',date='2026-10-20')=>({idEvent:String(id),idLeague:'4339',strSeason:'2026-2027',intRound:String(round),strHomeTeam:home,strAwayTeam:away,dateEvent:date,strStatus:'Match Finished',intHomeScore:'2',intAwayScore:'1'});
const fixtures=[{home:'H',away:'A',id:null,start:null}];
const response=events=>({ok:true,json:async()=>({events})});
const unavailableCache=url=>url.startsWith('assets/data/')?{ok:false}:null;
(async()=>{
  let urls=[];
  let result=await load({week:3,league:'4339',season:'2026-2027',matches:fixtures,resolve,eventTime:time,fetcher:async u=>{
    urls.push(u);return unavailableCache(u)||response(u.includes('eventsround')?[mk(101,3,'Other','Home')]:[mk(202,8)]);
  }});
  assert.equal(result.length,1);assert.equal(result[0].idEvent,'202');
  assert.equal(urls.length,3,'Cache, round and season fallback must be used');
  urls=[];
  result=await load({week:8,league:'4339',season:'2026-2027',matches:fixtures,resolve,eventTime:time,fetcher:async u=>{
    urls.push(u);return unavailableCache(u)||response([mk(202,8)]);
  }});
  assert.equal(result[0].idEvent,'202');assert.equal(urls.length,2,'Valid round must avoid season fallback');
  assert.equal(select([mk(202,8),mk(303,24,'Home','Away','2027-03-02')],[{home:'H',away:'A',id:'303'}],resolve,time,8)[0].idEvent,'303','Stored event ID wins');
  assert.equal(select([mk(202,8),mk(303,24,'Home','Away','2027-03-02')],[{home:'H',away:'A',start:Date.parse('2027-03-02T12:00:00Z')}],resolve,time,8)[0].idEvent,'303','Kickoff date wins');
  assert.throws(()=>select([mk(202,8),mk(303,24)],[{home:'H',away:'A'}],resolve,time,5),/birden fazla maç/);
  assert.equal(select([mk(202,8,'Other','Away')],fixtures,resolve,time,8).length,0,'Unrelated match rejected');
  result=await load({week:8,league:'4339',season:'2026-2027',matches:fixtures,resolve,eventTime:time,fetcher:async u=>unavailableCache(u)||response([mk(202,8),{...mk(999,8),idLeague:'9999'}])});
  assert.equal(result.length,1,'Wrong league excluded');
  urls=[];
  result=await load({week:8,league:'4339',season:'2026-2027',matches:fixtures,resolve,eventTime:time,fetcher:async u=>{
    urls.push(u);
    if(u.startsWith('assets/data/'))return {ok:true,json:async()=>({league:'4339',season:'2026-2027',events:[mk(777,8)]})};
    throw new Error('Provider should not be requested when cache matches');
  }});
  assert.equal(result[0].idEvent,'777');assert.equal(urls.length,1,'Same-origin cache used without provider');
  console.log('PASS: same-origin cache, safe round/season fallback, event ID, kickoff, ambiguity, unrelated games, league filter');
})().catch(e=>{console.error(e);process.exitCode=1;});
