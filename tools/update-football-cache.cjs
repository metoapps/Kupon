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
(async()=>{
  const urls=[
    base+'eventsseason.php?id='+LEAGUE+'&s='+SEASON,
    ...Array.from({length:38},(_,i)=>base+'eventsround.php?id='+LEAGUE+'&r='+(i+1)+'&s='+SEASON)
  ];
  // Season endpoint preferred; round endpoints only needed when season endpoint is empty.
  let events=[];
  try{events=await read(urls[0]);console.log('season events:',events.length)}
  catch(e){console.log('season endpoint failed:',e.message)}
  if(events.length<10){
    for(const url of urls.slice(1)){
      try{events.push(...await read(url))}catch(e){console.log('round request failed:',e.message)}
      if(events.length>=100)break;
    }
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
