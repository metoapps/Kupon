#!/usr/bin/env node
// Kupon posterinden motion-engine ile ÜCRETSİZ yerel pilot video hazırlığı.
// motion-engine'in varsayılan demo sahnesini kullanır; nihai tören kurgusu değildir.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { tmpdir } from 'node:os';
function args(argv) { const x = {}; for(let i=0;i<argv.length;i+=2){if(!['--engine','--poster','--out'].includes(argv[i])||!argv[i+1])throw Error('Kullanım: --engine PATH --poster PNG --out PATH'); x[argv[i]]=argv[i+1];}return x;}
let d;
try{
 const a=args(process.argv.slice(2)); if(!a['--engine']||!a['--poster']||!a['--out'])throw Error('Eksik parametre');
 const engine=resolve(a['--engine']),poster=resolve(a['--poster']),out=resolve(a['--out']);
 const cli=join(engine,'bin','motion-engine.mjs');
 if(!existsSync(cli)) throw Error('motion-engine CLI bulunamadı: '+cli);
 if(!existsSync(poster)) throw Error('Poster bulunamadı: '+poster);
 if(existsSync(out)) throw Error('Çıktı klasörü zaten var (var olan dosyalar korunur): '+out);
 d=mkdtempSync(join(tmpdir(),'kupon-motion-'));
 const manifest=join(d,'media.json');
 writeFileSync(manifest,JSON.stringify({image:poster},null,2));
 const p=spawnSync(process.execPath,[cli,'demo','--format','portrait','--assets',manifest,'--out',out],{cwd:engine,stdio:'inherit'});
 if(p.error) throw p.error;
 if(p.status!==0) throw Error('motion-engine hata kodu: '+p.status);
 const film=join(out,'film.mp4');
 if(!existsSync(film)) throw Error('İşlem bitti ama film.mp4 bulunamadı: '+film);
 console.log('PILOT_OK',film);
}catch(e){console.error('PILOT_ERROR:',e.message);process.exitCode=1}
finally{if(d)rmSync(d,{recursive:true,force:true})}
