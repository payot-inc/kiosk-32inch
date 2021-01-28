import { ipcMain } from 'electron';
import SerialPort from 'serialport'
import { merge, Subject } from 'rxjs';
import { buffer, debounceTime, filter, map, throttleTime, timestamp } from 'rxjs/operators';

export default async function initCoinDevice(eventer) {
  const inputEvent = new Subject(0);

  const list = await SerialPort.list();
  const device = list.find(({ manufacturer }) => manufacturer === 'wch.cn');

  if (!device) throw new Error('Not Found Device');

  const port = new SerialPort(device.path, { autoOpen: true, baudRate: 9600 });
  const sendMessage = msg => port.write(`${msg}\r\n`);
  const parser = new SerialPort.parsers.Readline({ delimiter: '\r\n' });
  port.pipe(parser);

  parser.on('data', (payload) => {
    const [cmd, message] = payload.toString().trim().split(':');
    if (cmd !== 'BILL') return;

    const amount = parseInt(message, 10);
    // eventer.send('cash-input', amount);
    inputEvent.next(parseInt(message, 10));
  });

  ipcMain.handle('cash-open', (event, isOpen) => {
    const command = isOpen ? 'RUN' : 'STOP';
    sendMessage(command);
    return isOpen;
  });

  port.on('open', async () => {
    for(let i=0; i<5; i++) {
      await checksumParser();
    }
  });

  async function checksumParser() {
    await delay(2000);
    sendMessage('STAT');
  }
  
  function delay(millisec) {
    return new Promise(resolve => setTimeout(resolve, millisec));
  }


  const inputOther = inputEvent.pipe(
    filter(value => value === 1000 || value === 5000),
    throttleTime(1000),
  );
  
  const input10000 = inputEvent.pipe(
    filter(amount => amount === 10000),
    timestamp(),
    buffer(inputEvent.pipe(debounceTime(200))),
    filter(buffer => buffer.length !== 0),
    map(buffer => {
      if (buffer.length === 1) return 10000;
      const totalTime = buffer[buffer.length - 1].timestamp - buffer[0].timestamp;
      const averageTime = totalTime / (buffer.length - 1);
  
      if (averageTime <= 150 && buffer.length < 10) return 10000;
      else if (averageTime <= 150 && buffer.length >= 10) return 50000;
      else return buffer.reduce((acc, { value }) => acc + value, 0);
    }),
  );
  
  merge(inputOther, input10000).subscribe(
    amount => eventer.send('cash-input', amount),
    // console.log,
  );
}

