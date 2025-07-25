import axios from 'axios';

const ipRes = await axios.get('https://api.ipify.org?format=json');
console.log('本机公网IP:', ipRes.data.ip);

const res = await fetch('https://api.kie.ai/api/v1/gpt4o-image/generate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer c982688b5c6938943dd721ed1d576edb',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: '生成一只可爱的小猫',
    aspectRatio: '1:1',
    model: 'gpt-4o-image',
    userId: 'j2983236233@gmail.com'
  })
})
const data = await res.json()
console.log(data) 
const https = require('https');
https.get('https://ifconfig.me', (res) => {
  res.on('data', (d) => process.stdout.write(d));
});