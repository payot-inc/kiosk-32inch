import { ipcMain } from 'electron';
import edge from 'electron-edge-js';
import { takeRight, take } from 'lodash';

const path = 'C:\\Koces\\PayotKoces.dll';
const lib = edge.func(path);

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
          return resolve(results);
        } else if (code === -3) {
          return reject(new Error('카드결제 프로그램이 실행되지 않음'));
        } else if (code === -2) {
          return reject(new Error('결제시간 초과'));
        } else if (code === -1) {
          return reject(new Error('카드결제 승인 오류'));
        } else if (statusStr === '9999') {
          return reject(new Error('카드결제 취소'));
        }
      } catch (error) {
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

  return await request(params);
}

ipcMain.handle('pay', async (event, companyName, amount) => {
  return await payment(companyName, amount);
});
