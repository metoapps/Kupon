/* Kupon ceremony gate: never changes scores; no autoplay. */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.KuponCeremonyGate=api;
})(typeof window==='undefined'?globalThis:window,function(){
 'use strict';
 const PLAYERS=Object.freeze(['meto','lort','fero','latte','josh']);
 const BASE='assets/ceremony/videos/';
 const normalize=x=>{const s=String(x||'').toLocaleLowerCase('tr-TR').trim();return s==='buzlulatte'?'latte':s;};
 function choose(award,finalized){
  if(finalized!==true||!award||!award.h||!Array.isArray(award.champ)||!Array.isArray(award.last))return null;
  if(award.champ.length!==1||award.last.length!==1)return null;
  const winner=normalize(award.champ[0][0]);
  const loser=normalize(award.last[0][0]);
  if(!PLAYERS.includes(winner)||!PLAYERS.includes(loser)||winner===loser)return null;
  const week=Number(award.h.no);
  if(!Number.isInteger(week)||week<0)return null;
  return Object.freeze({title:'Haftanın ödül töreni',winner,loser,week,
   src:BASE+winner.toUpperCase()+'-'+loser.toUpperCase()+'.mp4',autoplay:false});
 }
 function all(){return PLAYERS.flatMap(winner=>PLAYERS.filter(loser=>loser!==winner).map(loser=>({winner,loser,src:BASE+winner.toUpperCase()+'-'+loser.toUpperCase()+'.mp4'})));}
 return Object.freeze({choose,all});
});
