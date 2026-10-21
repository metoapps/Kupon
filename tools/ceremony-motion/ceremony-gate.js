/* Kupon ceremony eligibility gate. No DOM writes. No auto-play. No changes to scoring.
 * Enables the approved METO-win/LORT-loss clip only when unique and complete.
 * This module intentionally does not select any default video URL.
 */
(function(root,factory){
 const fn=factory();
 if(typeof module==='object'&&module.exports)module.exports=fn;
 else root.KuponCeremonyGate=fn;
})(typeof window==='undefined'?globalThis:window,function(){
 'use strict';
 function choose(award,assetUrl,finalized){
  if(finalized!==true)return null;
  if(!award||!award.h||!Array.isArray(award.champ)||!Array.isArray(award.last))return null;
  // Never reveal during unfinished scoring, ties, or incomplete participation.
  if(award.champ.length!==1||award.last.length!==1)return null;
  const winner=String(award.champ[0][0]||'').toLocaleLowerCase('tr-TR');
  const loser=String(award.last[0][0]||'').toLocaleLowerCase('tr-TR');
  if(winner!=='meto'||loser!=='lort'||winner===loser)return null;
  if(typeof assetUrl!=='string'||assetUrl!=='/assets/ceremony/meto-lort-v7.mp4')return null;
  // Keep video voluntary, never autoplay. Marked as a demo/pilot, not a result determination.
  return {title:'METO–LORT ödül töreni',winner,loser,week:award.h.no,src:assetUrl,autoplay:false};
 }
 return Object.freeze({choose});
});
