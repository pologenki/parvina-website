import {readFile,writeFile} from 'node:fs/promises';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

const root=join(dirname(fileURLToPath(import.meta.url)),'..');
for(const width of [180,360,540,720]){
  await sharp(join(root,'public/logo-transparent.png'))
    .resize({width})
    .webp({lossless:true,effort:6})
    .toFile(join(root,'public',`logo-${width}.webp`));
}
for(const kind of ['walnut','apricot','mango','cashew','cranberries']){
  for(const width of [240,480]){
    await sharp(join(root,'public/nut-scene',`${kind}.webp`))
      .resize({width,withoutEnlargement:true})
      .webp({quality:88,alphaQuality:100,effort:6})
      .toFile(join(root,'public/nut-scene',`${kind}-${width}.webp`));
  }
}
for(const width of [480,960,1024]){
  await sharp(join(root,'public/nut-scene/mix-jar-4k.png'))
    .resize({width,withoutEnlargement:true})
    .webp({quality:92,alphaQuality:100,effort:6})
    .toFile(join(root,'public/nut-scene',`mix-jar-fast-${width}.webp`));
}
const manifestPath=join(root,'public/gallery/photos.json');
const manifest=JSON.parse(await readFile(manifestPath,'utf8'));
for(const photo of Object.values(manifest)){
  photo.avifVariants=[];
  for(const variant of photo.variants){
    const output=variant.src.replace(/\.webp$/,'.avif');
    const info=await sharp(join(root,'public',variant.src.replace(/^\//,'')))
      .avif({quality:80,effort:4})
      .toFile(join(root,'public',output.replace(/^\//,'')));
    photo.avifVariants.push({src:output,width:info.width,height:info.height,bytes:info.size});
  }
}
await writeFile(manifestPath,JSON.stringify(manifest,null,2)+'\n');
console.log('Prepared responsive hero images and AVIF gallery variants; originals preserved.');
