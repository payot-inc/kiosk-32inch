import { ipcMain } from 'electron';
import SerialPort from 'serialport';
import { merge, Subject } from 'rxjs';
import { buffer, debounceTime, filter, map, throttleTime, timestamp } from 'rxjs/operators';

const parser = new SerialPort.parsers.Readline({ delimiter: '\r\n' });
let eventer; // ipcRenderer로 메시지 보내기
let sender; // (message) => {} serial 메시지 보내기

const inputEvent = new Subject(0);

// SerialPort.list()
//   .then(list => list.find(({ manufacturer }) => manufacturer === 'wch.cn') || {})
//   .then(device => device.path || '/dev/tty.usbserial-14220')
//   .then(path => new SerialPort(path, { autoOpen: true, baudRate: 9600 }))
//   .then(port => {
//     port.pipe(parser);
//     sender = message => port.write(`${message}\r\n`);
//   });
SerialPort.list()
  .then(list => list.find(({ manufacturer }) => manufacturer === 'wch.cn'))
  .then(device => device.path)
  .then(path => new SerialPort(path, { autoOpen: true, baudRate: 9600 }))
  .then(port => {
    port.pipe(parser);
    sender = message => port.write(`${message}\r\n`);
  });

parser.on('data', data => {
  const [cmd, message] = data
    .toString()
    .trim()
    .split(':');

  if (cmd !== 'BILL' || !eventer) return;
  console.log(data);
  inputEvent.next(parseInt(message, 10));
});

ipcMain.handle('cash-open', (event, isOpen) => {
  eventer = event;
  const command = isOpen ? 'RUN' : 'STOP';
  sender(command);
});

/** 1000원 또는 5000원 투입시 */
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

    if (averageTime <= 150 && buffer.length <= 10) return 10000;
    else if (averageTime <= 150 && buffer.length >= 10) return 50000;
    else return buffer.reduce((acc, { value }) => acc + value, 0);
  }),
);

merge(inputOther, input10000).subscribe(
  amount => eventer.sender.send('cash-input', amount),
  console.log,
);
