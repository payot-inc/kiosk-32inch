import { ipcMain } from 'electron';
import SerialPort from 'serialport';

async function main() {
  const devices = await SerialPort.list();
  const target = devices.find(({ manufacturer }) => manufacturer === 'wch.cn');
  const port = new SerialPort(target.path, { baudRate: 9600, autoOpen: true });
  const parser = new SerialPort.parsers.Readline({ delimiter: '\r\n' });

  const sendMessage = message => port.write(`${message}\r\n`);
  let eventer;
  ipcMain('open', (event, state) => {
    eventer = event;
    const message = state ? 'RUN' : 'STOP';
    sendMessage(message);
  });

  parser.on('data', payload => {
    const message = payload.toString();
    if (/^BILL:\d{4,5}$/.test(message)) {
      const amount = parseInt(message.split(':')[1], 10);
      eventer.sender.send('input', amount);
    }
  });
}

main();
