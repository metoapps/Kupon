const assert=require('node:assert/strict');
const {choose,all}=require('./ceremony-gate.js');
const mk=(winner,loser)=>({h:{no:12},champ:[[winner,9]],last:[[loser,0]]});
assert.equal(all().length,20);
assert.equal(new Set(all().map(x=>x.src)).size,20);
for(const p of all()){
 const out=choose(mk(p.winner,p.loser),true);
 assert.equal(out.src,p.src);assert.equal(out.autoplay,false);
}
assert.equal(choose(mk('meto','lort'),false),null);
assert.equal(choose(mk('meto','meto'),true),null);
assert.equal(choose(mk('unknown','lort'),true),null);
assert.equal(choose({h:{no:2},champ:[['meto',1],['fero',1]],last:[['lort',0]]},true),null);
assert.equal(choose({h:{no:2},champ:[['meto',1]],last:[['lort',0],['josh',0]]},true),null);
console.log('PASS: 20 unique videos + 5 safety cases');
