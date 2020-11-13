import { ipcMain } from 'electron';
import jsonp from 'node-jsonp';
import numeral from 'numeral';

const HOST = 'http://localhost:8090';
const request = params =>
  new Promise((resolve, reject) => {
    jsonp(HOST, { REQ: params.join('^') }, 'callback', response => {
      const isValide = response.SUC === '00'; // 카드결제 성공여부
      if (!isValide) {
        return reject(new Error(response.MSG));
      } else {
        return resolve(response);
      }
    });
  });

/** 결제 요청 */
ipcMain.handle('card-pay', (event, companyName, amount, timeout = 30) => {
  const params = new Array(32).fill('');
  params[0] = 'D1'; // 전문내용 : 승인
  params[2] = Number(amount).toString(); // 결제금액
  params[3] = '00'; // 할부개월 수
  params[11] = numeral(timeout).format('00'); // 결제 대기시간
  params[23] = 'UTF-8'; // 문자셋
  params[29] = 'Y'; // 결제 화면 표시여부

  return request(params).then(res => {
    return parseInt(res.RQ07, 10); // 결제된 금액 정보를 반환
  });
});

/** 결제창 닫기 */
ipcMain.handle('card-close', event => {
  const params = new Array(32).fill('');
  params[0] = 'CC'; // 전문내용 : 취소

  return request(params);
});
