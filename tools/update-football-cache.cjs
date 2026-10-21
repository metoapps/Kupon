#!/usr/bin/env node
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const LEAGUE='4339',SEASON='2026-2027';
const base='https://www.thesportsdb.com/api/v1/json/3/';
async function read(url){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),20000);
  try{
    const r=await fetch(url,{signal:controller.signal,headers:{'User-Agent':'KuponScoreCache/1.0 (GitHub Actions)','Accept':'application/json'}});
    if(!r.ok)throw new Error('HTTP '+r.status);
    const data=await r.json();
    return Array.isArray(data.events)?data.events:[];
  }finally{clearTimeout(timer)}
}
async function readEspn(){
  const ranges=['202608','202609','202610','202611','202612','202701','202702','202703','202704','202705','202706'];
  const events=[];
  for(const dates of ranges){
    const url='https://site.api.espn.com/apis/site/v2/sports/soccer/tur.1/scoreboard?dates='+dates+'&limit=500';
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),20000);
    try{
      const response=await fetch(url,{signal:controller.signal,headers:{'Accept':'application/json','User-Agent':'Mozilla/5.0'}});
      if(!response.ok)throw new Error('ESPN HTTP '+response.status);
      const data=await response.json();
      if(!Array.isArray(data.events))throw new Error('ESPN returned no events array');
      for(const item of data.events){
        const game=item.competitions&&item.competitions[0];
        const teams=game&&game.competitors||[];
        const home=teams.find(x=>x.homeAway==='home'),away=teams.find(x=>x.homeAway==='away');
        if(!home||!away)continue;
        const score=x=>typeof x.score==='object'?x.score.displayValue:x.score;
        const status=game.status||item.status||{};
        const finished=!!(status.type&&status.type.completed);
        const date=String(item.date||game.date||'');
        events.push({
          idEvent:'espn-'+item.id,idLeague:LEAGUE,strSeason:SEASON,
          intRound:null,
          strHomeTeam:home.team&&home.team.displayName||home.team&&home.team.name,
          strAwayTeam:away.team&&away.team.displayName||away.team&&away.team.name,
          dateEvent:date.slice(0,10),strTimestamp:date,
          strStatus:finished?'Match Finished':'Not Started',
          intHomeScore:finished?score(home):null,
          intAwayScore:finished?score(away):null
        });
      }
      console.log('ESPN',dates,'matches',data.events.length);
    }finally{clearTimeout(timer)}
  }
  return events;
}
(async()=>{
  const urls=[
    base+'eventsseason.php?id='+LEAGUE+'&s='+SEASON,
    ...Array.from({length:12},(_,i)=>base+'eventsround.php?id='+LEAGUE+'&r='+(i+1)+'&s='+SEASON)
  ];
  // Season endpoint preferred; round endpoints only needed when season endpoint is empty.
  let events=[];
  try{events=await read(urls[0]);console.log('season events:',events.length)}
  catch(e){console.log('season endpoint failed:',e.message)}
  if(events.length<10){
    for(const url of urls.slice(1,3)){
      try{events.push(...await read(url))}catch(e){console.log('round request failed:',e.message)}
      if(events.length>=100)break;
    }
  }
  if(events.length<10){
    try{events=await readEspn();console.log('ESPN fallback events:',events.length)}
    catch(e){console.error('ESPN fallback failed:',e.message)}
  }
  const seen=new Set();
  events=events.filter(e=>{
    if(String(e.idLeague)!==LEAGUE||String(e.strSeason)!==SEASON||!e.strHomeTeam||!e.strAwayTeam)return false;
    const key=String(e.idEvent||e.strHomeTeam+'|'+e.strAwayTeam+'|'+e.dateEvent);
    if(seen.has(key))return false;seen.add(key);return true;
  });
  if(events.length<10)throw new Error('Provider supplied fewer than 10 valid season matches; preserve previous snapshot.');
  const dir=path.join('assets','data');fs.mkdirSync(dir,{recursive:true});
  const file=path.join(dir,'football-'+SEASON+'.json');
  const result={league:LEAGUE,season:SEASON,updatedAt:new Date().toISOString(),events};
  fs.writeFileSync(file,JSON.stringify(result)+'\n');
  console.log('SCORE_CACHE_OK',events.length,file);
})().catch(e=>{console.error(e);process.exitCode=1});
