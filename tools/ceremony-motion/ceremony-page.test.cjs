const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const html=fs.readFileSync('index.html','utf8');
const scripts=[...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
let parsed=0;
for(const [all,attrs,source] of scripts){
 if(/\bsrc\s*=/.test(attrs)||/type\s*=\s*["']application\/json/.test(attrs)||!source.trim())continue;
 new vm.Script(source,{filename:'inline-script-'+(++parsed)+'.js'});
}
assert(parsed>0,'No inline scripts parsed');
assert(html.includes('tools/ceremony-motion/ceremony-gate.js'),'Gate not loaded');
assert(html.includes('window.KuponCeremonyGate.choose(kutlama,tamamlandi)'),'No gate in weekly view');
assert(html.includes('setToreVideo(toreSecimi)'),'No voluntary play button');
assert(html.includes('controls:true,playsInline:true'),'Missing mobile video controls');
assert(html.includes('setToreVideo(null)'),'Missing close control');
assert(html.includes('kutlama.h.sonuclar.every('),'Missing all-results guard');
const dir='assets/ceremony/videos';
const names=fs.readdirSync(dir).filter(n=>n.endsWith('.mp4'));
const players=['METO','LORT','FERO','LATTE','JOSH'];
const expected=players.flatMap(w=>players.filter(l=>l!==w).map(l=>w+'-'+l+'.mp4')).sort();
assert.deepEqual(names.sort(),expected);
for(const name of names)assert(fs.statSync(path.join(dir,name)).size>100000,'Video too small: '+name);
console.log('PASS: '+parsed+' inline scripts parse; UI controls and 20 files verified');
