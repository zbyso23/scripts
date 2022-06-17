import express from 'express';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const app = express();
const port = 3003;
const dataPath = `data/`;
const file = 'script';

const __filename = fileURLToPath(import.meta.url);

// 👇️ "/home/john/Desktop/javascript"
const __dirname = path.dirname(__filename);
console.log('directory-name 👉️', __dirname);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.markdown.html'))
  // const content = fs.readFileSync('index.html');
  // res.set('Content-Type', 'text/html');
  // res.send(Buffer.from(content));
})

app.get('/code', (req, res) => {
  console.log('send file', path.join(__dirname, '/index.monaco.html'))
  res.sendFile(path.join(__dirname, '/index.monaco.html'))
})

const allowedTypes = ['code', 'markdown'];
const isAllowed = (type) => {
  if(allowedTypes.includes(type)) return true;
  if(type.match(/code-[A-Za-z]+/)) return true;
  return false;  
}
const dataFile = `${dataPath}${file}.json`;

app.get('/save', (req, res) => {
  const payload = req.query.payload;
  const backup = req.query.backup;
  const type = req.query.type;
  if(!type || !isAllowed(type)) {
    res.send(`error: invalid type`);
    return;
  }
  const payloadOld = fs.existsSync(dataFile) ? JSON.parse(fs.readFileSync(dataFile)) : {};
  const contentNewType = {};
  contentNewType[type] = payload;
  const content = { ...payloadOld, ...contentNewType };
  if(backup === '1') {
    const d = new Date();
    console.log('Backup', d.toISOString())
    const date = d.toISOString().replace(/:/g, '-').split('.')[0].split('T').join('_');
    const backupFile = `${dataPath}${file}.${date}.json`;
    fs.writeFileSync(backupFile, JSON.stringify(payloadOld));
  }
  fs.writeFileSync(dataFile, JSON.stringify(content));
  res.send(`saved`)
})
  
app.get('/load', (req, res) => {
  const type = req.query.type;
  if(!type || !isAllowed(type)) {
    res.send(`error: invalid type`);
    return;
  }
  const payload = fs.existsSync(dataFile) ? JSON.parse(fs.readFileSync(dataFile)) : {};
  const result = type in payload ? payload[type] : '';
  res.send(`${payload[type]}`);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
