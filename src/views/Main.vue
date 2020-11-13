<template>
  <div class="home fill-height">
    <div class="main-bg">
      <span class="top" />
      <span class="bottom" />
      <span class="wave wave-1" />
      <span class="wave wave-2" />
      <span class="wave wave-3" />
    </div>

    <div class="main-head">
      <div class="logo">
        <v-icon>mdi-home-outline</v-icon>
        <h2>
          {{ companyName }}
          <span></span>
        </h2>
      </div>
      <div class="lang"></div>
    </div>

    <div class="inner">
      <div class="slide-view">
        <v-carousel
          v-model="adsIndex"
          :continuous="false"
          :cycle="false"
          :show-arrows="false"
          hide-delimiter-background
          delimiter-icon="mdi-minus"
          hide-delimiters
          height="1020"
          touchless
        >
          <v-carousel-item eager v-for="{ type, path, file } in ads" :key="file" class="slide-item">
            <video
              v-if="type === 'video'"
              class="ad"
              :src="`file://${path}`"
              muted
              style="height: 100%; width: auto;"
            />
            <img v-else class="ad" :src="`file://${path}`" />
          </v-carousel-item>
        </v-carousel>
        <!-- <video v-if="ads.length !== 0" class="ad" :src="`file://${ads[1].path}`" muted autoplay /> -->
      </div>
      <div class="notice">
        <label>
          NEWS
        </label>
        <div class="slide-text">
          <marquee scrollamount="10px" style="display: block;">
            {{ notification }}
          </marquee>
        </div>
      </div>
    </div>
    <!-- inner -->

    <div class="mainBtns">
      <div class="btns-inner">
        <div class="chage btn" v-ripple @click="nextStep(action[0])">
          <dl>
            <dt>충전하기</dt>
            <dd>미리 금액 충전하고 보너스 받기</dd>
          </dl>
          <v-icon>
            mdi-arrow-right-circle
          </v-icon>
        </div>
        <div class="use btn" v-ripple @click="() => $router.push('/userLogin')">
          <dl>
            <dt>이용하기</dt>
            <dd>충전금액 사용하기 (충전없이 사용가능)</dd>
          </dl>
          <v-icon>
            mdi-arrow-right-circle
          </v-icon>
        </div>
        <div class="search btn" v-ripple @click="() => $router.push('/userHistory')">
          <dl>
            <dt>조회하기</dt>
            <dd>나의 포인트 및 사용내역 조회하기</dd>
          </dl>
          <v-icon>
            mdi-arrow-right-circle
          </v-icon>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Footer from '@/components/layout/FooterComponent.vue';
/**
 *
 * 메인페이지
 *
 * 사용자는 해당페이지에서 3가지의 기능을 가질 수 있다
 * 1. 이용하기 : UseMachine
 * 2. 충전하기 : ChargeType
 * 3. 조회하기 : UserUseList
 */
export default {
  name: 'Main',
  components: {
    Footer,
  },
  data() {
    return {
      adsIndex: 0,
      ads: [],
      action: [
        { name: 'PointCharge', redirectRouteName: 'ChargeType', title: '충전하기' },
        { name: 'UseMachine', redirectRouteName: 'UseMachine', title: '이용하기' },
        { name: 'UseKioskList', redirectRouteName: 'UserUseList', title: '조회하기' },
      ],
    };
  },
  async created() {
    await this.initalAd();
  },
  mounted() {
    setTimeout(() => {
      this.adsIndex = 1;
    }, 4000);
  },
  computed: {
    ...mapState({
      companyName: state => state.company.name,
      notification: state => state.config.notice,
    }),
  },
  watch: {
    adsIndex(newValue) {
      this.nextAd(newValue);
    },
  },
  methods: {
    /** 광고 목록 가져오기 */
    async initalAd() {
      const list = await this.$adList();
      this.ads = list;
    },
    /**  */
    nextAd() {
      const nowIndex = this.adsIndex;
      const tag = document.getElementsByClassName('ad').item(nowIndex);
      const tagName = tag.tagName.toLowerCase();
      if (tagName === 'video') {
        const video = document.createElement('video');
        video.currentTime = 0;
        tag.play();
        tag.onended = () => {
          this.pageChangeAD();
        };
      } else {
        setTimeout(this.pageChangeAD, 4000);
      }
    },
    pageChangeAD() {
      const nextIndex = (this.adsIndex + 1) % this.ads.length;
      this.adsIndex = nextIndex;
    },
    /** 다음 단계로 이동 */
    nextStep({ name, redirectRouteName }) {
      this.$router.push({
        name: 'UserLogin',
        params: {
          mode: name,
          // 로그인이 완료된 후 이동되어야할 기능을 담은 함수 전달
          done: () => this.$router.push({ name: redirectRouteName }),
        },
      });
    },
  },
};
</script>

<style lang="scss">
.home {
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  .inner {
    position: relative;
    flex: 1;
    padding: 60px;
    padding-top: 0px;
    z-index: 2;
  }
  .main-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30px;
    height: 120px;
    z-index: 10;
    .logo {
      display: flex;
      align-items: center;
      h2 {
        position: relative;
        color: #000;
        letter-spacing: 0px;
        font-size: 30px;
        font-weight: 400;
        span {
          position: absolute;
          bottom: 0px;
          width: 100%;
          height: 12px;
          border-radius: 6px;
          display: inline-block;
          background: rgba(0, 133, 222, 0.2);
        }
      }
      .v-icon {
        color: #0085de;
        font-size: 54px;
        margin-right: 15px;
      }
    }
  }
  .slide-view {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 100%;
    height: 1020px;
    border-radius: 30px;
    overflow: hidden;
    background: #000;
    box-shadow: 10px 10px 45px rgba(0, 0, 0, 0.3);
    .slide-item {
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      img {
        display: block;
        height: 100%;
        position: relative;
        left: 50%;
        transform: translateX(-50%);
      }
      video {
        display: block;
        width: 100%;
        height: 100%;
        position: relative;
      }
    }
  }
  .notice {
    display: flex;
    align-items: center;
    width: 100%;
    background: #fff;
    border: 3px solid #ee2073;
    height: 100px;
    border-radius: 50px;
    margin-top: 45px;
    overflow: hidden;
    label {
      width: 180px;
      text-align: center;
      font-size: 28px;
      color: #ee2073;
      font-weight: 500;
      border-right: 3px solid #e2e2e2;
      letter-spacing: 1px;
    }
    .slide-text {
      flex: 1;
      font-size: 32px;
      color: #292929;
      overflow: hidden;
      padding: 0 30px;
    }
  }
  .mainBtns {
    width: 100%;
    position: absolute;
    bottom: 60px;
    padding: 0 15px;
    z-index: 5;
  }
  .btns-inner {
    display: flex;
    align-items: center;
    justify-content: space-around;
    border-radius: 30px 30px 0 0;
    overflow: hidden;
    border: 3px solid #c2c2c2;
    border-bottom: 0px;
    background: #fff;
    z-index: 3;
    box-shadow: 10px 10px 30px rgba(0, 0, 0, 0.1);
    .btn {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-end;
      height: 500px;
      padding: 45px;
      dl {
        dt {
          font-size: 39px;
          font-weight: 500;
        }
        dd {
          font-size: 28px;
          word-break: keep-all;
          margin-top: 15px;
          color: #888;
        }
      }
      .v-icon {
        font-size: 90px;
        color: #292929;
      }
    }
    .btn.chage {
      dl {
        dt {
          color: #ee2073;
        }
        dd {
          color: #888;
        }
      }
      .v-icon {
        color: #ee2073;
      }
    }
    .btn.use {
      border-left: 3px solid #e2e2e2;
      border-right: 3px solid #e2e2e2;
      dl {
        dt {
          color: #0085de;
        }
        dd {
          color: #888;
        }
      }
      .v-icon {
        color: #0085de;
      }
    }
    .btn.search {
      dl {
        dd {
          color: #888;
        }
      }
    }
  }
  .main-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0px;
    top: 0px;
    .top {
      position: absolute;
      top: -520px;
      right: 50px;
      width: 360px;
      height: 1000px;
      border-radius: 180px;
      z-index: 1;
      background: #0085de;
      transform: rotate(130deg);
      display: none;
    }
    .bottom {
      position: absolute;
      bottom: -80px;
      left: 0px;
      width: 600px;
      height: 1200px;
      border-radius: 300px;
      z-index: 1;
      background: #ee2073;
      transform: rotate(130deg);
      display: none;
    }
    .wave {
      position: absolute;
      bottom: 0;
      right: 0;
      border-radius: 43%;
    }
    .wave-1 {
      bottom: -500px;
      left: -800px;
      width: 1500px;
      height: 1500px;
      background: #ee2073;
      animation: wave 16s infinite linear;
    }
    .wave-2 {
      width: 800px;
      height: 800px;
      right: -400px;
      top: -400px;
      background: #0085de;
      animation: wave2 13s infinite linear;
    }
    .wave-3 {
      width: 300px;
      height: 300px;
      right: -150px;
      top: 350px;
      background: #0085de;
      animation: wave2 10s infinite linear;
    }
    @keyframes wave {
      from {
        transform: rotate(0deg);
      }
      from {
        transform: rotate(-360deg);
      }
    }
    @keyframes wave2 {
      from {
        transform: rotate(0deg);
      }
      from {
        transform: rotate(360deg);
      }
    }
  }
}
</style>
