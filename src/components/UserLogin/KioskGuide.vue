<template>
  <div class="guide">
    <h4>키오스크 사용방법</h4>
    <v-row>
      <v-col cols="3">
        <dl>
          <dt><img src="@/assets/img/guide-01.png" /></dt>
          <dd>
            <strong>장비 사용</strong>
            <span
              >키오스크를 이용하기 전 장비사용을 위해 이용하실 코스 및 서비스 선택을 해주세요</span
            >
          </dd>
        </dl>
      </v-col>
      <v-col cols="3">
        <dl>
          <dt><img src="@/assets/img/guide-02.png" /></dt>
          <dd>
            <strong>전화번호 입력</strong>
            <span>키오스크에서 포인트 적립을 위한 전화번호를 입력해주세요</span>
          </dd>
        </dl>
      </v-col>
      <v-col cols="3">
        <dl>
          <dt><img src="@/assets/img/guide-03.png" /></dt>
          <dd>
            <strong>장비&상품선택</strong>
            <span>키오스크에서 사용하고자 하는 장비선택 후 상품을 선택합니다</span>
          </dd>
        </dl>
      </v-col>
      <v-col cols="3">
        <dl>
          <dt><img src="@/assets/img/guide-04.png" /></dt>
          <dd>
            <strong>포인트 사용 및 결제</strong>
            <span>사용할 포인트를 설정 후 신용카드 및 현금 중 결제방법을 선택하고 결제합니다</span>
          </dd>
        </dl>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.guide {
  margin-top: 80px;
  h4 {
    font-size: 36px;
    color: #292929;
    font-weight: 500;
  }
  dl {
    flex: 1;
    margin-top: 20px;
    dt {
      width: 100%;
      height: 240px;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      border: 3px solid #e2e2e2;
      img {
        height: 100%;
      }
    }
    dd {
      margin-top: 30px;
      strong {
        display: block;
        color: #292929;
        font-weight: 500;
        font-size: 24px;
        text-align: left;
      }
      span {
        display: block;
        color: #888;
        font-size: 22px;
        font-weight: 400;
        margin-top: 10px;
        text-align: left;
      }
    }
  }
}
</style>
