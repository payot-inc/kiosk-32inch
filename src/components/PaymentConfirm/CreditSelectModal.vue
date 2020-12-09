<template>
  <v-dialog v-model="visible" width="800px" overlay-color="#000" overlay-opacity="0.8">
    <div class="creditSelectModal">
      <h4><span>*</span> 결제방법을 선택해주세요</h4>

      <v-list>
        <v-list-item link @click="upDate('cash')">
          <dl>
            <dt><img src="@/assets/img/coin.png" /></dt>
            <dd>
              <label><b>현금</b>으로 결제하기</label>
              <span>최대 10% 추가적립</span>
            </dd>
          </dl>
        </v-list-item>

        <v-list-item link @click="upDate('card')">
          <dl>
            <dt><img src="@/assets/img/card.png" /></dt>
            <dd>
              <label><b>신용카드</b>로 결제하기</label>
              <span>최대 5% 추가적립</span>
            </dd>
          </dl>
        </v-list-item>
      </v-list>

      <div class="bottom">
        <v-btn outlined @click="open(false)">취소하기</v-btn>
      </div>
    </div>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
    };
  },
  watch: {
    visible(newValue) {
      // if (newValue) this.$sound.singlePlay('./sound/select_pay_type.mp3');
      if (newValue) this.$soundManager.singlePlay('select_pay_type.mp3');
    },
  },
  methods: {
    open(value) {
      this.visible = value;
    },
    upDate(type) {
      this.$emit('done', type);
      this.open(false);
    },
  },
};
</script>

<style lang="scss" scoped>
.creditSelectModal {
  background: #fff;
  font-size: 24px;
  border-radius: 10px;
  overflow: hidden;
  padding: 40px;
  h4 {
    display: inline-block;
    font-weight: 500;
    font-size: 40px;
    text-align: center;
    color: #292929;
    span {
      color: #ee2073;
    }
  }
  .v-list {
    margin-top: 20px;
    .v-list-item {
      padding: 30px;
      border: 1px solid #c2c2c2;
      border-radius: 10px;
      margin-bottom: 20px;
      box-shadow: 0 0 30px rgba(0, 0, 0, 0.08);
      dl {
        display: flex;
      }
      dt {
        width: 160px;
        height: 160px;
        background: #f2f2f2;
        border-radius: 50%;
        img {
          width: 160px;
        }
      }
      dd {
        flex: 1;
        margin-left: 40px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        label {
          font-size: 40px;
          font-weight: 500;
          b {
            color: #ee2073;
            font-weight: 500;
          }
        }
        span {
          font-size: 28px;
          color: #ee2073;
          margin-top: 5px;
        }
      }
    }
    .v-list-item:last-child {
      margin-bottom: 0px;
    }
  }
  .bottom {
    text-align: right;
    padding-top: 40px;
    .v-btn {
      width: 200px;
      height: 70px;
      border-radius: 10px;
      background: #e2e2e2;
      color: #797979;
      font-size: 32px;
      border: 0px;
    }
  }
}
</style>
