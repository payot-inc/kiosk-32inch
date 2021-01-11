import { ipcMain } from 'electron';
import mqtt from 'mqtt';

const URL = 'mqtt://dailywash.co.kr:1883';
const client = mqtt.connect(URL);
let eventer;

ipcMain.handle('login', (event, id) => {
  eventer = event;
  const topic = `kiosk/${id}/control/+`;
  client.subscribe(topic);
});

ipcMain.handle('logout', (event, id) => {
  console.log('unsubscribe', id);
  client.unsubscribe(`kiosk/${id}/control/+`);
});

client.on('message', (topic, message) => {
  // console.log(topic, message.toString());
  eventer.sender.send('hook', { topic, message });
});