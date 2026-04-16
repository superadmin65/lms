const fs = require('fs');
const path = require('path');

function isUrl(s){ return /^https?:\/\//.test(s); }

const folder = './data_json'; // put your JSONs here or adapt
const files = fs.readdirSync(folder).filter(f => f.endsWith('.json'));

files.forEach(f=>{
  const p = path.join(folder,f);
  let j;
  try { j = JSON.parse(fs.readFileSync(p,'utf8')); }
  catch(e){ console.error('INVALID JSON', f, e.message); return; }

  const missing = [];
  // drill into nested lists
  const chapters = j.list || [];
  chapters.forEach(ch => {
    (ch.list||[]).forEach(item=>{
      if(!item.type) missing.push(`${item.id||item.label} missing type`);
      if(!item.data) missing.push(`${item.id||item.label} missing data`);
      if(item.data && item.data.image && !isUrl(item.data.image)) {
        const imgPath = path.join(process.cwd(), 'public', item.data.image);
        if(!fs.existsSync(imgPath)) missing.push(`${item.id||item.label} local image missing: ${item.data.image}`);
      }
      if(item.data && item.data.bgData && item.data.bgData.bgImg){
        const bg = item.data.bgData.bgImg;
        if(!isUrl(bg) && !fs.existsSync(path.join(process.cwd(),'public',bg))){
          missing.push(`${item.id||item.label} bgImg missing: ${bg}`);
        }
      }
      // capture fonts or other references in data if needed
    });
  });

  console.log('File', f, 'issues:', missing.length ? missing : 'OK');
  missing.slice(0,10).forEach(m => console.log('  -', m));
});











