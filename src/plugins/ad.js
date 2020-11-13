import { ipcRenderer } from 'electron';
import Vue from 'vue';

function getVideoDurationTime(path) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.src = `file://${path}`;
    video.onloadedmetadata = () => {
      const duration = video.duration;
      if (duration) {
        return resolve(Math.floor(duration * 1000));
      } else {
        return reject(new Error('읽을 수 없습니다'));
      }
    };
  });
}

async function getFileVisibleDurationTimes(files) {
  let result = [];
  for (const file of files) {
    let duration = 4000;
    if (file.type === 'video') {
      duration = await getVideoDurationTime(file.path);
    }
    result.push(Object.assign({}, file, { duration }));
  }
  return result;
}

Vue.prototype.$adList = async () => {
  const filesData = await ipcRenderer.invoke('ad_list');
  const result = await getFileVisibleDurationTimes(filesData);

  return result;
};
