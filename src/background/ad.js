import { ipcMain, app } from 'electron';
import fs from 'fs';
import path from 'path';
import util from 'util';

const hasDirectory = path => util.promisify(fs.stat)(path);
const createDirectory = path => util.promisify(fs.mkdir)(path, { recursive: true });
const readDirectoryFiles = path => util.promisify(fs.readdir)(path);

/** 파일이 이미지파일인지 확인 */
const isImageFile = fileName =>
  ['.jpeg', 'jpg', 'png'].some(ext => fileName.toLowerCase().endsWith(ext));

/** 파일이 비디오파일인지 확인 */
const isVideoFile = fileName => ['.mp4'].some(ext => fileName.toLowerCase().endsWith(ext));

/** 광고 가능한 파일인지 확인 */
const isValideAdFile = fileName =>
  [isImageFile(fileName), isVideoFile(fileName)].some(state => state);

const AD_DIR =
  process.env.NODE_ENV === 'production'
    ? path.join('C:', 'kiosk', 'ad')
    : path.join(app.getPath('documents'), 'kioks', 'ad');

/** 광고 리소스 디렉토리가 없으면 생성 */
hasDirectory(AD_DIR)
  // .then(console.log)
  .catch(() => createDirectory(AD_DIR));

ipcMain.handle('ad_list', async eventer => {
  const files = await readDirectoryFiles(AD_DIR);
  return files
    .filter(isValideAdFile) // 이미지 혹은 비디오 파일만을 추출
    .sort() // 이름 순서대로 정렬
    .map(fileName => {
      const filePath = path.join(AD_DIR, fileName);
      return {
        type: isImageFile(fileName) ? 'image' : 'video',
        file: fileName,
        path: filePath,
      };
    });
});
