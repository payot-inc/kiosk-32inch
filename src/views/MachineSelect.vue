<template>
  <div class="product" id="container">
    <SubTitleBar title="장비 및 상품선택" />
    <UserInfo />

    <div class="productTab">

      <div class="listWrap">
        <div class="eqList" :class="eqListMove">
          <div class="listTitle">
            <v-icon>fa-washer</v-icon>사용하실 장비를 선택해주세요
          </div>
          <div class="itemList">
            <v-list flat three-line>
              <v-list-item-group>
                <v-list-item
                  v-for="machine in machinesByCategory"
                  :key="machine.id"
                  v-touchEvent:tap="() => nextList(machine)"
                >
                  <div class="eqItem">
                    <dl>
                      <dt>{{ machine.name }}</dt>
                      <dd>용량 {{ machine.size }}</dd>
                    </dl>
                    <v-icon size="50">mdi-chevron-right</v-icon>
                  </div>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </div>
        </div>
        <!-- eqList -->

        <div class="goodsList" :class="goodsListMove">
          <div class="listTitle">
            <v-btn
              width="100px"
              height="100px"
              elevation="0"
              class="backBtn"
              v-touchEvent:tap="backList"
            >
              <v-icon size="45">mdi-arrow-left</v-icon>
            </v-btn>
            <dl>
              <dt><span>{{ selectedMachine.name }}</span></dt>
              <dd>상품을 선택해주세요</dd>
            </dl>
          </div>
          <div class="itemList">
            <v-list flat three-line>
              <v-list-item-group>
                <v-list-item
                  v-for="product in selectedMachine.products"
                  :key="product.id"
                  v-touchEvent:tap="() => nextPage(product)"
                >
                  <div class="goodsItem">
                    <dl>
                      <dt>{{ product.name }}</dt>
                      <dd>{{ product.notice }}</dd>
                    </dl>
                    <strong>{{ product.amount | numeral('0,0') }}원</strong>
                  </div>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </div>
        </div>
        <!-- goodsList -->
      </div>
      <!--listWrap -->
    </div>

    <AlertModal
      ref="alter"
      title="네트워크 오류"
      message="장치와의 통신이 원활하지 않습니다"
      mode="alert"
    />
    <ProgressModal ref="progress" title="연결상태 확인 중" />
  </div>
</template>

<script>
import SubTitleBar from '@/components/SubTitleBar.vue';
import UserInfo from '@/components/UserInfo.vue';
import AlertModal from '@/components/modal/AlertModal.vue';
import ProgressModal from '@/components/modal/ProgressModal.vue';
import { mapActions, mapMutations, mapState } from 'vuex';
import { groupBy, sortBy } from 'lodash';
export default {
  name: 'MachineSelect',
  components: {
    SubTitleBar,
    UserInfo,
    AlertModal,
    ProgressModal,
  },
  data() {
    return {
      eqListMove: '',
      goodsListMove: '',
      machinesByCategory: {},
      selectedMachine: {},
    };
  },
  computed: {
    ...mapState({
      machines: state => state.machines,
      useDeviceInputMode: state => state.kiosk.useDeviceInputMode,
    }),
    // categories() {
    //   return Object.keys(this.machinesByCategory);
    // },
  },
  mounted() {
    const { category } = this.$route.params;
    this.machinesByCategory = this.machines.filter(machine => machine.category === category);
    // this.machinesByCategory = groupBy(sortBy(this.machines, 'sort'), machine => machine.category);

    // if (this.useDeviceInputMode === 'custom') this.$sound.singlePlay('./sound/select_machine.mp3');
    // else if (this.useDeviceInputMode === 'product')
    //   this.$sound.singlePlay('./sound/select_machine_product.mp3');
    if (this.useDeviceInputMode === 'custom') this.$soundManager.singlePlay('select_machine.mp3');
    else if (this.useDeviceInputMode === 'product')
      this.$soundManager.singlePlay('select_machine_product.mp3');
  },
  methods: {
    ...mapMutations({
      appendAction: 'APPEND_ACTION',
    }),
    ...mapActions({
      deviceNetworkTest: 'deviceNetworkTest',
    }),
    async nextList(machine) {
      const { id: machineId } = machine;
      try {
        // console.log('try');
        this.$refs.progress.show(true);
        await this.deviceNetworkTest(machine.mac);
        this.eqListMove = 'off';
        this.goodsListMove = 'on';
        this.selectedMachine = machine;
        this.selectedMachine.products = sortBy(this.selectedMachine.products, 'sort');
        if (this.useDeviceInputMode === 'custom') {
          // console.log(
          //   '선택장비와 통신 가능한지 확인 & 선택장비 userAction에 추가\n상품선택 방법: custom 다음페이지: CustomPay',
          //   machine,
          // );
          this.appendAction(Object.assign({}, { machineId, ProductId: null }));
          this.$router.push({ name: 'CustomPay' });
        }
      } catch (error) {
        // console.log('catch');
        this.$refs.progress.show(false);
        this.$refs.alter.show(true);
      } finally {
        // console.log('finally');
        this.$refs.progress.show(false);
      }
    },
    nextPage(product) {
      let { machineId, amount: inputAmount, id: ProductId } = product;
      inputAmount = parseInt(inputAmount, 10);

      // console.log(machineId, inputAmount);
      // console.log(
      //   '선택한 상품 vuex에 userAction에 추가\n상품선택 방법: prodcut 다음페이지: ProductPay',
      //   product,
      // );
      this.appendAction(Object.assign({}, { machineId, inputAmount, ProductId, type: 'use' }));
      this.$router.push({ name: 'PaymentConfirm', params: { productName: product.name } });
    },
    backList() {
      this.eqListMove = 'on';
      this.goodsListMove = 'off';
    },
  },
};
</script>

<style lang="scss" scoped>
.productTab {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  padding:60px;
}

.listWrap {
  position: relative;
  flex:1;
  width: 100%;
  border: 2px solid #d2d2d2;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 10px 10px 30px rgba(0, 0, 0, 0.1);

  .eqList {
    position: absolute;
    width: 100%;
    top: 0px;
    display: flex;
    flex: 1;
    flex-direction: column;
    height: 100%;
    z-index: 10;
    border-right: 1px solid #e2e2e2;
    

    .listTitle {
      display: flex;
      font-size: 36px;
      height: 160px;
      background: #0085de;
      color: #fff;
      justify-content: center;
      align-items: center;
    }

    .itemList {
      &::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background-color: #0085de;

        &:hover {
          background-color: #0085de;
        }
      }
      &::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0);
      }
      display: flex;
      flex: 1;
      flex-direction: column;
      background: #f2f2f2;
      overflow-y: scroll;

      .eqItem {
        display: flex;
        justify-content: space-between;
        width: 100%;

        dl {
          dt {
            font-size: 36px;
          }
          dd {
            font-size: 28px;
            color: #888;
          }
        }
      }
    }
  }

  .goodsList {
    position: absolute;
    width: 100%;
    top: 0px;
    display: flex;
    flex: 1;
    flex-direction: column;
    height: 100%;

    .itemList {
      &::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background-color: #0085de;

        &:hover {
          background-color: #327bc4;
        }
      }
      &::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0);
      }
      display: flex;
      flex: 1;
      flex-direction: column;
      background: #f2f2f2;
      overflow-y: scroll;
    }

    .listTitle {
      padding: 30px;
      height: 160px;
      display: flex;
      background: #0085de;
      color: #fff;
      align-items: center;

      dl {
        margin-left: 40px;

        dt {
          font-size: 42px;
          span {
            color: #fff500;
          }
        }
        dd {
          font-size: 26px;
          color: rgba(255, 255, 255, 0.8);
        }
      }

      .v-btn.backBtn{
        background:#fff;
        border-radius:15px;

        .v-icon{
          color:#292929;
        }
      }
    }

    .goodsItem {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;

      dl {
        display: flex;
        flex-direction: column;
        flex: 1;
        dt {
          font-size: 36px;
        }
        dd {
          font-size: 28px;
          color: #888;
        }
      }
      strong {
        display: block;
        width: 200px;
        text-align: right;
        font-size: 34px;
        font-weight: 600;
        color: #ee2073;
      }
    }
  }
}


.v-list {
  padding: 0px;
}
.v-list-item {
  flex: 1;
  border-bottom: 2px solid #d2d2d2;
  padding: 30px;
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.v-overlay__content {
  width: 100%;
}

.eqList.on {
  animation: eqListMoveOn 0.3s forwards;
}
.eqList.off {
  animation: eqListMoveOff 0.3s forwards;
}
.goodsList.on {
  animation: goodsListMoveOn 0.3s forwards;
}
.goodsList.off {
  animation: goodsListMoveOff 0.3s forwards;
}

@keyframes eqListMoveOn {
  0% {
    left: -100%;
  }
  100% {
    left: 0;
  }
}

@keyframes eqListMoveOff {
  0% {
    left: 0;
  }
  100% {
    left: -100%;
  }
}

@keyframes goodsListMoveOn {
  0% {
    left: 100%;
  }
  100% {
    left: 0;
  }
}

@keyframes goodsListMoveOff {
  0% {
    left: 0;
  }
  100% {
    left: 100%;
  }
}
</style>
