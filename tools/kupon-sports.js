/* Kupon / TheSportsDB: identify matches by teams, event ID and kickoff, not Kupon week number alone. */
(function(root){
  'use strict';
  const normalize=x=>String(x==null?'':x).trim();
  const validLeague=(event,league,season)=>
    (!event.idLeague||normalize(event.idLeague)===normalize(league)) &&
    (!event.strSeason||normalize(event.strSeason)===normalize(season));
  function uniqueEvents(events){
    const seen=new Set();
    return events.filter(e=>{
      const key=normalize(e.idEvent)||[e.strHomeTeam,e.strAwayTeam,e.dateEvent,e.strTime].join('|');
      if(seen.has(key))return false;seen.add(key);return true;
    });
  }
  function select(events, matches, resolve, eventTime, round){
    const eligible=uniqueEvents(events);
    if(!Array.isArray(matches)||!matches.length)
      return eligible.filter(e=>Number(e.intRound)===Number(round));
    const selected=[];
    for(const match of matches){
      const home=normalize(match.home),away=normalize(match.away);
      let choices=eligible.filter(e=>resolve(e.strHomeTeam)===home&&resolve(e.strAwayTeam)===away);
      if(match.id) {
        const exact=choices.filter(e=>normalize(e.idEvent)===normalize(match.id));
        if(exact.length)choices=exact;
      }
      if(match.start!=null&&Number.isFinite(Number(match.start))){
        const near=choices.filter(e=>{
          const t=eventTime(e);
          return t!=null&&Math.abs(t-Number(match.start))<=72*3600*1000;
        });
        if(near.length)choices=near;
      }
      if(choices.length>1){
        const sameRound=choices.filter(e=>Number(e.intRound)===Number(round));
        if(sameRound.length===1)choices=sameRound;
      }
      if(choices.length>1)throw new Error(home+' – '+away+' için birden fazla maç bulundu. Yanlış skor almamak için eşleştirme durduruldu.');
      if(choices.length===1)selected.push(choices[0]);
    }
    return selected;
  }
  async function load({week,league,season,key='3',matches,resolve,eventTime,signal,fetcher=fetch}){
    const base='https://www.thesportsdb.com/api/v1/json/'+encodeURIComponent(key)+'/';
    const q='?id='+encodeURIComponent(league)+'&r='+encodeURIComponent(week)+'&s='+encodeURIComponent(season);
    async function request(url){
      const controller=new AbortController();
      const timer=setTimeout(()=>controller.abort(),15000);
      const cancel=()=>controller.abort();
      if(signal)signal.addEventListener('abort',cancel,{once:true});
      try{
        if(signal&&signal.aborted)throw new Error('İstek iptal edildi.');
        const response=await fetcher(url,{signal:controller.signal});
        if(!response.ok)throw new Error(response.status===429?'Skor servisi yoğun (429). Biraz sonra tekrar dene.':'Skor servisi HTTP '+response.status+' hatası verdi.');
        const body=await response.json();
        return Array.isArray(body.events)?body.events.filter(e=>validLeague(e,league,season)):[];
      }catch(err){
        if(err.name==='AbortError')throw new Error('Skor servisi zaman aşımına uğradı. Tekrar dene.');
        if(err instanceof TypeError)throw new Error('Skor servisine bağlantı kurulamadı. İnternet/CORS erişimini kontrol et.');
        throw err;
      }finally{
        clearTimeout(timer);if(signal)signal.removeEventListener('abort',cancel);
      }
    }
    let roundEvents=[],roundError=null;
    try{roundEvents=await request(base+'eventsround.php'+q);}
    catch(err){roundError=err;}
    const needed=Array.isArray(matches)?matches.length:0;
    let selected=select(roundEvents,matches,resolve,eventTime,week);
    if(needed&&selected.length===needed)return selected;
    if(!needed&&selected.length)return selected;
    let seasonEvents=[];
    try{
      seasonEvents=await request(base+'eventsseason.php?id='+encodeURIComponent(league)+'&s='+encodeURIComponent(season));
    }catch(err){
      if(selected.length)return selected;
      throw roundError||err;
    }
    selected=select([...roundEvents,...seasonEvents],matches,resolve,eventTime,week);
    if(!selected.length)throw new Error(
      needed?'Bu maçlar için güvenilir eşleşme bulunamadı. Takım adları veya sezon verileri eksik olabilir; skorları elle kontrol et.':
      'Bu lig ve hafta için fikstür bulunamadı. Servis verisini kontrol et veya hazır fikstürü kullan.'
    );
    return selected;
  }
  const api={load,select};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  if(root)root.KuponSports=api;
})(typeof window!=='undefined'?window:undefined);
