<template>
  <div class="head">
    <dl>
      <dt>
        <span>{{phone}}</span>님, 첫 방문을 환영합니다
      </dt>
    </dl>
    <p>생성하신 비밀번호를 입력해주세요.</p>
  </div>
</template>

<script>
export default {
  props: {
    phone: String,
  },
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