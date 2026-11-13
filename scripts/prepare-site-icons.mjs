import {readFile,writeFile,readdir,mkdir} from 'node:fs/promises';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root=join(dirname(fileURLToPath(import.meta.url)),'..'),names=new Set(['play','pause']),styles=new Map();
async function scan(folder){for(const entry of await readdir(folder,{withFileTypes:true})){const path=join(folder,entry.name);if(entry.isDirectory())await scan(path);else if(entry.name.endsWith('.js')){const s=await readFile(path,'utf8');for(const m of s.matchAll(/fa-(solid|regular|brands)\s+fa-([a-z0-9-]+)/g))styles.set(m[2],m[1]);for(const m of s.matchAll(/\bfa-([a-z][a-z0-9-]+)\b/g))if(!['solid','regular','brands','lg','fw','spin','classic','shake'].includes(m[1]))names.add(m[1]);}}}
await scan(join(root,'src'));
const aliases={times:'xmark',close:'xmark','external-link-alt':'up-right-from-square',search:'magnifying-glass','long-arrow-alt-left':'left-long','long-arrow-alt-right':'right-long'};
let css='/*! Font Awesome Free 7.0.1 icons, fontawesome.com — CC BY 4.0; see LICENSE.txt. SVG paths are unchanged. */\n.fa-solid,.fa-regular,.fa-brands,.fas,.far,.fab{display:inline-flex;align-items:center;justify-content:center;font-style:normal;line-height:1}.fa-solid::before,.fa-regular::before,.fa-brands::before,.fas::before,.far::before,.fab::before{content:"";display:block;width:1em;height:1em;background-color:currentColor;-webkit-mask:var(--site-icon) center/contain no-repeat;mask:var(--site-icon) center/contain no-repeat}\n';
for(const name of [...names].sort()){
  const style=styles.get(name)||'solid',canonical=aliases[name]||name;
  const response=await fetch(`https://raw.githubusercontent.com/FortAwesome/Font-Awesome/7.0.1/svgs/${style}/${canonical}.svg`);
  if(!response.ok)throw Error(`Missing ${style}/${canonical}.svg: ${response.status}`);
  const source=await response.text(),folder=join(root,'public/vendor/fontawesome/svg',style);await mkdir(folder,{recursive:true});await writeFile(join(folder,canonical+'.svg'),source);
  css+=`.fa-${name}{--site-icon:url("data:image/svg+xml;base64,${Buffer.from(source).toString('base64')}")}\n`;
}
await writeFile(join(root,'public/vendor/fontawesome/css/site-icons-v1.css'),css);
const integrity='sha512-'+createHash('sha512').update(css).digest('base64');
for(const page of ['index.html','ru/index.html','zh-cn/index.html']){const path=join(root,page);let s=await readFile(path,'utf8');s=s.replace('/vendor/fontawesome/css/all.min.css','/vendor/fontawesome/css/site-icons-v1.css').replace(/(href="\/vendor\/fontawesome\/css\/site-icons-v1\.css" integrity=")[^"]+/,'$1'+integrity);await writeFile(path,s)}
const galleryPath=join(root,'src/components/gallery.js');await writeFile(galleryPath,(await readFile(galleryPath,'utf8')).replaceAll('/gallery/video/almonds-loop.webm','/gallery/video/almonds-loop-small.webm'));
console.log(JSON.stringify({icons:names.size,cssBytes:Buffer.byteLength(css),names:[...names].sort()}));
