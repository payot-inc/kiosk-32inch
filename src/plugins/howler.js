import { Howl, Howler } from 'howler';
import Vue from 'vue';

class SoundManager {
  info_volum = 0.7;
  warning_volum = 1;
  sound = null;
  touchSound = null;

  constructor() {
    this.touchSound = new Howl({
      src: ['./sound/touch.mp3'],
      volume: this.info_volum,
    });
  }

  singlePlay(fileName) {
    if(this.sound !== null) {
      this.sound.stop();
    }
    this.sound = new Howl({
      src: [`./sound/${fileName}`],
      volume: this.info_volum,
    });
    this.sound.play();
  }

  listPlay(fileList, delayList) {
    if(this.sound !== null) {
      this.sound.stop();
    }
    this.sound = new Howl({
      src: [`./sound/${fileList[0]}`],
      volume: this.info_volum,
      onend: () => {
        setTimeout(() => {
          delayList.shift();
          fileList.shift();
          if(delayList.length === 0) this.singlePlay(fileList[0]);
          else this.listPlay(fileList, delayList);
        }, delayList[0]);
      },
    });
    this.sound.play();
  }

  warningPlay(fileName) {
    if(this.sound !== null) {
      this.sound.stop();
    }
    this.sound = new Howl({
      src: [`./sound/${fileName}`],
      volume: this.warning_volum,
    });
    this.sound.play();
  }

  playTouchSound() {
    this.touchSound.play();
  }

}

const soundManager = new SoundManager();

Vue.prototype.$soundManager = soundManager;

export default soundManager;