<template>
  <div class="head">
    <dl>
      <dt>
        <span>{{phone}}</span>님, 첫 방문을 환영합니다
      </dt>
    </dl>
    <p>첫 방문자는 비밀번호 생성이 필요합니다<br><span>사용하실 비밀번호 4자리</span>를 입력해주세요</p>
    <div class="aggreBox">
      <v-btn
        width="60px"
        height="60px"
        elevation="0"
        outlined
        v-bind:class="{active: joinAgree}"
        @click="toggleJoinAgree"
      >
        <v-icon>mdi-check</v-icon>
      </v-btn>
      <span>
        멤버쉽 회원가입을 위한<br>개인정보 수집 및 이용 및 제공에 동의합니다
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    phone: String,
    setJoinAgree: Function,
  },
  data() {
    return {
      joinAgree: false,
    };
  },
  methods: {
    toggleJoinAgree() {
      this.joinAgree = !this.joinAgree;
      this.setJoinAgree(this.joinAgree);
    },
  }
}
</script>

<style lang="scss" scoped>
.head {
  width: 100%;
  padding: 120px 60px 60px 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  dl{
    font-size:46px;
    font-weight:500;
    margin-bottom:30px;
    dt{
      span{
        color:#0085de;
        font-weight:600;
      }
    }
  }
  p {
    font-size: 32px;
    letter-spacing: -0.7px;
    word-break: keep-all;
    color: #888;
    span {
      color: #d22828;
    }
  }
  .aggreBox{
    display:flex;
    margin-top:30px;
    border-radius:10px;
    align-items:center;
    border:2px solid #e2e2e2;
    padding:20px 30px;
    .v-btn{background:#e2e2e2;border:0px;border-radius:50%;color:#292929;overflow:hidden;}
    .v-btn.active{background:#0085de;color:#fff;}
    span{font-size:24px;text-align:left;margin-left:30px;}
  }
}
</style>