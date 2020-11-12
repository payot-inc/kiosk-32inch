import Vue from 'vue';

class AudioManager extends Audio {
  info_volum = 0.7;
  warring_volum = 1;

  play_list = []; // 재생 목록
  offset_duration = []; // 재생 간격

  constructor(infoVolum = 0.7, warringVolume = 1) {
    super();
    this.speak_volum = infoVolum;
    this.warring_volum = warringVolume;
  }

  /** mode = 'info' | 'warring' */
  speak(mode = 'info') {
    if (this.play_list.length >= 0) throw new Error('재생할 파일이 없습니다');
    this.volume = mode === 'info' ? this.info_volum : this.warring_volum;
    const source = this.play_list.shift();
    this.play(source);
  }

  setPlayList(list = []) {
    this.play_list = list;
    return this;
  }

  setOffsetTime(list = []) {
    if (this.play_list.length !== list.length + 1)
      throw new Error('재생간격의 횟수를 확인해 주세요');
    this.offset_duration = list;
  }

  play(source) {
    this.pause();
    this.currentTime = 0;
    this.source = source;
    super.play();
  }

  // 재생 중지
  stop() {
    this.play_list = [];
    this.offset_duration = [];
    this.pause();
  }

  /** 재생될 파일이 많다면 */
  onended() {
    if (this.play_list.length === 0) return;
    const source = this.play_list.shift();
    const offset = this.offset_duration.shift() || 0;
    setTimeout(this.play, offset, source);
  }
}

const manager = new AudioManager();

Vue.prototype.$sound = manager;
