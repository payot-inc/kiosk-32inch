import { CronJob } from 'cron';
import { reboot } from 'electron-shutdown-command';

const time = [
  '0', // sec
  '0', // min
  process.env.VUE_APP_REBOOT_TIME || '4', // hour
  '*', // dayofmonth 1-31
  '*', // month
  '*', // dayofweek sun-sat
].join(' ');

const cronJob = new CronJob(time, () => {
  reboot();
});

cronJob.start();