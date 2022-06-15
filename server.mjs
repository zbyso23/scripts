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


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'))
  // const content = fs.readFileSync('index.html');
  // res.set('Content-Type', 'text/html');
  // res.send(Buffer.from(content));
})

app.get('/save', (req, res) => {
  const payload = req.query.payload;
  const backup = req.query.backup;
  const outFile = `${dataPath}${file}.b64`;
  if(backup === '1') {
    const d = new Date();
    console.log('Backup', d.toISOString())
    const date = d.toISOString().replace(/:/g, '-').split('.')[0].split('T').join('_');
    const backupFile = `${dataPath}${file}.${date}.b64`;
    const payloadOld = fs.readFileSync(outFile);
    fs.writeFileSync(backupFile, payloadOld);
  }
  fs.writeFileSync(outFile, payload);
  res.send(`saved ${payload}`)
})
  
app.get('/load', (req, res) => {
  const payloadFile = `${dataPath}${file}.b64`;
  const payload = fs.readFileSync(payloadFile);
  res.send(`${payload}`);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
