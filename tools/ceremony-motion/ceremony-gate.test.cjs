const assert=require('node:assert/strict');const {choose}=require('./ceremony-gate.js');
const url='/assets/ceremony/meto-lort-v7.mp4';
const award=(w,l)=>({h:{no:42},champ:w.map(x=>[x,20]),last:l.map(x=>[x,0])});
assert.equal(choose(award(['meto'],['lort']),url,true).src,url);
assert.equal(choose(award(['fero'],['lort']),url,true),null);
assert.equal(choose(award(['meto'],['josh']),url,true),null);
assert.equal(choose(award(['meto','fero'],['lort']),url,true),null);
assert.equal(choose(award(['meto'],['lort','latte']),url,true),null);
assert.equal(choose(null,url),null);
assert.equal(choose(award(['meto'],['lort']),'https://example.com/evil.mp4',true),null);
assert.equal(choose(award(['meto'],['lort']),'',true),null);
console.log('CEREMONY_GATE_PASS 8 cases');

assert.equal(choose(award(['meto'],['lort']),url,false),null);
assert.equal(choose(award(['meto'],['lort']),url),null);
