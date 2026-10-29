import {mkdirSync,writeFileSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import sharp from 'sharp';

// All eight selected photographs are attributed to their authors on Unsplash and
// identified as free-to-use under the Unsplash License at the cited photo pages.
// A build without external network will gracefully fall back to embedded SVG/CSS.
const photographs=[
 {name:'table',id:'dhdh3HxBqng',credit:'Bruno Wolff',place:'Table Mountain'},
 {name:'noordhoek',id:'IpE-bIbCfBo',credit:'Tim Johnson',place:'Noordhoek Beach'},
 {name:'penguins',id:'UjpEGHu8uNU',credit:'Casey Allen',place:'Boulders Beach penguins'},
 {name:'chapmans',id:'8d5BioG1Kas',credit:'Tobias Reich',place:"Chapman's Peak"},
 {name:'kirstenbosch',id:'zV4FJUo8MeE',credit:'Joshua Kettle',place:'Kirstenbosch'},
 {name:'cape',id:'0NhD0xqamW0',credit:'Jean-Baptiste D.',place:'Cape Point'},
 {name:'bokap',id:'Zoc0u6M_73g',credit:'Joshua Kettle',place:'Bo-Kaap'},
 {name:'vineyard',id:'25EEyoY58zI',credit:'Matthieu Joannon',place:'Tokara vineyards (NOT Spier)'}
];
const out=join(process.cwd(),'public','images');mkdirSync(out,{recursive:true});
async function one(p:typeof photographs[number]) {
 const dest=join(out,p.name+'.webp');
 if(existsSync(dest)){console.log('Already exists:',p.name);return}
 const url='https://unsplash.com/photos/'+encodeURIComponent(p.id)+'/download?force=true&w=1200';
 try{
  const response=await fetch(url,{signal:AbortSignal.timeout(14000),headers:{'User-Agent':'CapeTownExplorer/1.0 (personal travel guide)'}});
  if(!response.ok)throw new Error('HTTP '+response.status);
  const contentType=response.headers.get('content-type')||'';
  if(!contentType.startsWith('image/'))throw new Error('not image: '+contentType);
  const data=Buffer.from(await response.arrayBuffer());
  if(data.length>14_000_000)throw new Error('unexpected large image');
  await sharp(data).rotate().resize({width:1200,withoutEnlargement:true}).webp({quality:74,effort:5}).toFile(dest);
  await sharp(data).rotate().resize({width:1200,withoutEnlargement:true}).jpeg({quality:74,mozjpeg:true}).toFile(join(out,p.name+'.jpg'));
  console.log('Downloaded',p.name,'from Unsplash,',p.credit);
 }catch(error){
  // Do not break essential travel app builds if the image host is unavailable.
  console.warn('Photo unavailable; retained illustrated fallback:',p.name,String(error));
 }
}
await Promise.all(photographs.map(one));
writeFileSync(join(out,'CREDITS.json'),JSON.stringify(photographs.map(p=>({...p,url:'https://unsplash.com/photos/'+p.id,license:'Unsplash License'})),null,2));
