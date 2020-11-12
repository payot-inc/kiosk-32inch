import axios from 'axios';

export const coreAPI = axios.create({
  baseURL: 'http://core.payot-coin.com',
});

export const kioskAPI = axios.create({
  baseURL: 'http://kiosk.coin-machine.com/kiosk',
});
