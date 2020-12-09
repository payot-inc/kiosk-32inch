import { ipcRenderer, remote } from 'electron';
import { reboot, shutdown } from 'electron-shutdown-command';
import store from '../store';
import router from '../router';
import sound from './sound.js';

/**
 * 프로그램 실행시 키오스크 이벤트 푸시 구독하기
 */
function subscribe() {
  const { id } = store.state.company;
  if (!id) return;
  ipcRenderer.invoke('login', id);
}

ipcRenderer.on('hook', (event, { topic, message: payload }) => {
  const [, , , action] = topic.split('/');
  let soundList = [];
  let delayList = [];
  // console.log('받은 mqtt :', action);
  switch (action) {
    case 'shutdown':
      // 키오스크 PC 종료
      shutdown();
      break;
    case 'reboot':
      // 키오스크 PC 리부팅
      reboot();
      break;
    case 'restart':
      // 키오스크 프로그램 재실행
      remote.app.relaunch();
      remote.app.exit();
      break;
    case 'exit':
      // 키오스크 프로그램 종료
      remote.app.exit();
      break;
    case 'sale':
      // 키오스크 이용 가능 상태 변경
      router.replace({ name: 'Main' });
      break;
    case 'fix':
      // 키오스크 이용 불가 상태 변경
      router.replace({
        name: 'Error',
        params: {
          title: '점검중 입니다',
          message: '이용에 불편을드려 죄송합니다',
        },
      });
      break;
    case 'warning':
      // sound.warningPlay();
      store.dispatch('warningPlay');
      break;
    case 'warningExit':
      store.dispatch('warningPlay', 'warning_exit.mp3');
      break;
    case 'warningCCTV':
      store.dispatch('warningPlay', 'warning_cctv.mp3');
      break;      
    default:
      // 키오스크 상태 정보 갱신
      // console.log(payload, '갱신');
      store.dispatch('refreshKioskConfig');
      break;
  }
});

subscribe();
