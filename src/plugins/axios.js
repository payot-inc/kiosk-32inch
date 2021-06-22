import axios from 'axios';

const TIMEOUT_SEC = parseInt(process.env.VUE_APP_REQUEST_TIMEOUT, 10);

export const coreAPI = axios.create({
  baseURL: process.env.VUE_APP_CORE_API_HOST,
  timeout: TIMEOUT_SEC,
});

export const kioskAPI = axios.create({
  baseURL: process.env.VUE_APP_KIOSK_API_HOST,
  // baseURL: 'http://dailywash.co.kr:3050/kiosk',
  timeout: TIMEOUT_SEC,
});
