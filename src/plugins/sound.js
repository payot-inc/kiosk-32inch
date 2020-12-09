import Vue from 'vue';
import path from 'path';

class AudioManager extends Audio {
  info_volum = 0.7;
  warring_volum = 1;

  constructor(infoVolum = 0.7, warringVolume = 1) {
    super();
    this.speak_volum = infoVolum;
    this.warring_volum = warringVolume;
    this.touchSound = new Audio('./sound/touch.mp3');
    this.touchSound.volume = 0.7;
  }

  warningPlay(source = '/sound/alertSound.mp3') {
    this.volume = this.warring_volum;
    this.src = process.env.BASE_URL + source;
    // this.src = path.join('app://', process.env.BASE_URL, source);
    this.play();
    this.onended = () => {};
  }

  play() {
    this.currentTime = 0;
    this.pause();
    super.play();
  }

  singlePlay(soundSrc) {
    this.volume = this.speak_volum;
    this.src = soundSrc;
    this.play();
    this.onended = () => {};
  }

  // 1. 재생이 되어야할 파일 목록
  // 2. 재생간 딜레이
  listPlay(playList, delayList) {
    this.volume = this.speak_volum;
    this.src = playList[0];
    this.onended = () => {
      if (playList.length > 1) { 
        setTimeout(() => {
          playList.shift();
          delayList.shift();
          this.listPlay(playList, delayList);
        }, delayList.length === 0 ? 0 : delayList[0]);
      }
    };
    this.play();
  }
  // listPlay(playList, startIndex) {
  //   this.volume = this.speak_volum;
  //   this.src = playList[startIndex];
  //   this.onended = () => {

  //     if (playList.length - 1 > startIndex) { 
  //       this.listPlay(playList, startIndex + 1);
  //     }
  //   };
  //   this.play();
  // }

  playTouchSound() {
    this.touchSound.play();
  }
}

const sound = new AudioManager();

Vue.prototype.$sound = sound;

export default sound;
