import { fromEvent, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import router from '../router';
import store from '../store';
import { reboot } from 'electron-shutdown-command';

function nowNetworkStatus() {
  console.log(navigator);
  // return navigator.onLine === 'online';
  return navigator.onLine;
}

const networkStatusChange$ = combineLatest([
  fromEvent(window, 'online'),
  fromEvent(window, 'offline'),
]).pipe(map(nowNetworkStatus), distinctUntilChanged());

/** 오프라인으로 변경시 2분이 경과하면 */
networkStatusChange$
  .pipe(
    debounceTime(2 * 60 * 1000),
    filter(state => !state),
  )
  .subscribe(
    () => {
      // 오류 페이지로 이동
      console.log('go');
      router.replace({
        name: 'Error',
        params: {
          title: '불편을 끼쳐드려 죄송합니다',
          message: '네트워크의 문제로 지금은 이용하실 수 없습니다',
        },
      });
    },
    () => {},
  );

/** 네트워크가 활성화되고 5초 뒤 */
networkStatusChange$
  .pipe(
    debounceTime(5 * 1000),
    filter(state => state),
    filter(() => store.state.remote.isSales),
  )
  .subscribe(
    () => {
      // 메인페이지로 이동
      router.replace({ name: 'Main' });
    },
    () => {},
  );

// /** 오프라인 상태가 15분간 유지되는 경우 */
// networkStatusChange$
//   .pipe(
//     debounceTime(15 * 60 * 1000),
//     filter(state => !state),
//   )
//   .subscribe(
//     () => {
//       // reboot
//       console.log('reboot!!');
//       reboot();
//     },
//     () => {},
//   );
