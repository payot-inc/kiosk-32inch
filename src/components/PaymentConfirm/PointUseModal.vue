<template>
  <v-dialog
    v-model="visible"
    width="800px"
    transition="slide-y-transition"
    overlay-opacity="0.8"
    overlay-color="#000"
  >
    <div class="pointUse">
      <div class="dialogHead">
        <span>포인트사용하기</span>
        <v-btn icon v-touchEvent:tap="closeModal" width="80" height="80">
          <v-icon color="#000" size="50">mdi-close</v-icon>
        </v-btn>
      </div>
      <div class="dialogBody">
        <div class="myPoint">
          <div class="myPointCircle">
            <label>나의 포인트</label>
            <span>{{ point | numeral('0,0') }}P</span>
          </div>
        </div>
        <dl class="usePoint">
          <dt>사용할 포인트</dt>
          <dd>{{ usePoint }} <span>포인트</span></dd>
        </dl>

        <div class="btns">
          <div class="pointBtn">
            <v-btn outlined v-touchEvent:tap="() => addPoint(500)">500 추가</v-btn>
          </div>
          <div class="pointBtn">
            <v-btn v-touchEvent:tap="() => addPoint(1000)" click="" outlined>1,000 추가</v-btn>
          </div>

          <v-btn width="150px" outlined v-touchEvent:tap="() => usePoint = 0" class="clearBtn">초기화</v-btn>
        </div>

        <div class="divider"></div>

        <v-btn class="completeBtn" outlined v-touchEvent:tap="done">
          포인트 사용하기
        </v-btn>
      </div>
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: 'PointUseModal',
  props: {
    min: Number,
    max: Number,
    point: Number,
  },
  data() {
    return {
      visible: false,
      usePoint: 0,
    };
  },
  watch: {
    visible(newValue) {
      // if (newValue) this.$sound.singlePlay('./sound/use_point.mp3');
      // else this.$sound.singlePlay('./sound/pay_use_machine.mp3');
      if (newValue) this.$soundManager.singlePlay('use_point.mp3');
      else this.$soundManager.singlePlay('pay_use_machine.mp3');
    },
  },
  methods: {
    addPoint(value) {
      if (this.usePoint + value <= this.max && this.usePoint + value <= this.point) this.usePoint += value;
    },
    open(state) {
      this.visible = state;
    },
    closeModal() {
      this.visible = false;
    },
    done() {
      this.$emit('updateUsePoint', this.usePoint);
      this.closeModal();
    },
    setPoint(point) {
      this.usePoint = point;
    },
  },
};
</script>

<style lang="scss" scoped>
.pointUse {
  border-radius: 10px;
  overflow: hidden;
}
.dialogHead {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background: #fff;
  height: 100px;
  overflow: hidden;
  padding:0 20px 0 40px;

  span {
    font-size: 36px;
    color: #494949;
  }
  .v-icon {
    font-size: 36px;
  }
}
.dialogBody {
  padding: 40px;
  background: #fff;
  min-height: 200px;
  .myPoint {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px 0;
    .myPointCircle {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 320px;
      height: 320px;
      background: #f2f2f2;
      border-radius: 50%;
    }
    label {
      font-size: 28px;
      color: #888;
    }

    span {
      font-size: 44px;
      font-weight: 600;
      color: #0085de;
    }
  }
  dl.usePoint {
    display: flex;
    align-items: center;
    border-bottom: 6px solid #ee2073;
    flex-direction: row;
    justify-content: space-between;
    padding: 20px 0;
    dt {
      text-align: left;
      width: 100%;
      font-size: 32px;
      color: #888;
    }
    dd {
      width: 100%;
      text-align: right;
      font-size: 54px;
      font-weight: 600;
      color: #ee2073;
      span {
        font-size: 32px;
        color: #292929;
      }
    }
  }
  .btns {
    display: flex;
    align-items: center;
    margin: 30px 0;
    .pointBtn {
      flex: 1;
      margin-right: 20px;
      .v-btn {
        width: 100%;
        height: 80px;
        font-size: 32px;
        border-radius: 10px;
        border: 2px solid #ee2073;
        color: #ee2073;
      }
    }
    .pointBtn:last-child {
      margin-right: 0px;
    }
    .clearBtn {
      width: 150px;
      height: 80px;
      font-size: 32px;
      border-radius: 10px;
      border: 2px solid #c2c2c2;
    }
  }
  .v-btn.completeBtn {
    width: 100%;
    height: 90px;
    border: 0px;
    border-radius: 10px;
    background: #0085de;
    color: #fff;
    font-size: 32px;
  }
  .divider {
    height: 2px;
    background: #e2e2e2;
    margin: 40px 0;
  }
}
</style>
