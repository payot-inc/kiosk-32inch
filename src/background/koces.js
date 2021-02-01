import { ipcMain } from 'electron';
import { takeRight, take } from 'lodash';
import edge from 'electron-edge-js';
import fs from 'fs';
import { join } from 'path';
import moment from 'moment';

const rootDir = join(
  'C:',
  'card_payments',
);


function hasTodayDirOrCreate(isSuccess) {
  const todayDir = join(
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
  const savePath = join(
    rootDir, 
    moment().format('YYYY-MM-DD'), 
    isSuccess ? 'success' : 'fail',
    `${moment().format('a_hh_mm_ss')}.json`
  );
  fs.writeFileSync(savePath, JSON.stringify(res, null, 2));
}

const path = 'C:\\Koces\\PayotKoces.dll';
let lib;
if(process.arch === 'ia32' && fs.existsSync(path)) {
  lib = edge.func(path);
}

function request(params) {
  return new Promise((resolve, reject) => {
    lib(params, (error, results) => {
      try {
        if (error) return reject(new Error(error.message));
        // const { code, result, resultString } = results;
        const { code, result } = results;
        const statusBuffer = takeRight(take(result || '', 65), 4);
        const statusStr = Buffer.from(statusBuffer).toString();

        if (code === 0 && statusStr === '0000') {
          saveLog(results, true);
          return resolve(results);
        } else if (code === -3) {
          saveLog(results, false);
          return reject(new Error('카드결제 프로그램이 실행되지 않음'));
        } else if (code === -2) {
          saveLog(results, false);
          return reject(new Error('결제시간 초과'));
        } else if (code === -1) {
          saveLog(results, false);
          return reject(new Error('카드결제 승인 오류'));
        } else if (statusStr === '9999') {
          saveLog(results, false);
          return reject(new Error('카드결제 취소'));
        }
      } catch (error) {
        saveLog(results, false);
        return reject(error);
      }
    });
  });
}

async function payment(companyName, amount) {
  const params = {
    type: 'F1',
    company: companyName,
    amount: amount.toString(),
    payNum: '',
    payDate: '',
  };

  // return await request(params);

  const req = await request(params);
  // console.log(req);

  return amount;
}

ipcMain.handle('card-pay-koces', async (event, companyName, amount) => {
  return await payment(companyName, amount);
});
