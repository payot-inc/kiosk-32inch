import { ipcMain } from 'electron';
import jsonp from 'node-jsonp';
import fs from 'fs';
import path from 'path';
import moment from 'moment';

const rootDir = path.join(
  'C:',
  'card_payments',
);


function hasTodayDirOrCreate(isSuccess) {
  const todayDir = path.join(
    rootDir, 
    moment().format('YYYY-MM-DD'), 
    isSuccess ? 'success' : 'fail',
  );
  const hasDir = fs.existsSync(todayDir);
  if(hasDir) return;
  fs.mkdirSync(todayDir, { recursive: true });
}

function saveLog(res, isSuccess) {
  hasTodayDirOrCreate(isSuccess);
  const savePath = path.join(
    rootDir, 
    moment().format('YYYY-MM-DD'), 
    isSuccess ? 'success' : 'fail',
    `${moment().format('a_hh_mm_ss')}.json`
  );
  fs.writeFileSync(savePath, JSON.stringify(res, null, 2));
}

const HOST = 'http://localhost:8090';
const request = params =>
  new Promise((resolve, reject) => {
    jsonp(HOST, { REQ: params.join('^') }, 'callback', response => {
      if (response.SUC !== '00') {
        let connectErrorMessage = response.MSG;
        if(response.MSG === 'User Cancel !') {
          connectErrorMessage = '결제를 취소하였습니다';
        } else if(response.MSG === 'Time Out !') {
          connectErrorMessage = '시간이 초과하였습니다';
        } else {
          connectErrorMessage = response.MSG;
        }
        saveLog(response, false);
        return reject(new Error(connectErrorMessage));
      } else if (response.RS04 === '0000') {
        saveLog(response, true);
        return resolve(response);
      } else {
        const [, , message] = response.RS16.split('=');
        saveLog(response, false);
        return reject(new Error(message.trim()))
      }
    });
  });

/** 결제 요청 */
ipcMain.handle('card-pay-kicc', (event, companyName, amount, timeout = 30) => {
  const params = new Array(32).fill('');
  params[0] = 'D1'; // 전문내용 : 승인
  params[2] = parseInt(amount, 10).toString() // 결제금액
  params[3] = '00'; // 할부개월 수
  params[11] = new Intl.NumberFormat('ko-KR', { minimumIntegerDigits: 2 }).format(timeout); // 결제 대기시간
  params[23] = 'UTF-8'; // 문자셋
  params[29] = 'Y'; // 결제 화면 표시여부

  return request(params)
    .then(res => {
      return parseInt(res.RQ07, 10); // 결제된 금액 정보를 반환
    });
});

/** 결제창 닫기 */
// ipcMain.handle('card-close', event => {
//   const params = new Array(32).fill('');
//   params[0] = 'CC'; // 전문내용 : 취소

//   return request(params);
// });