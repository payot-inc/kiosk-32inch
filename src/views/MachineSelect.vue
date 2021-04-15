<template>
  <div class="product" id="container">
    <SubTitleBar title="장비 및 상품선택" />
    <UserInfo />

    <div class="productTab">
      <div class="tabHead">
        <v-tabs height="120px" v-model="tab" dark hide-slider left background-color="#e2e2e2">
          <v-tab
            v-for="category in categories"
            :key="category"
            class="tabTitle"
            active-class="tabTitleActive"
            @click="backList"
            translate="fade"
            :ripple="true"
            >{{ category }}</v-tab>
        </v-tabs>
      </div>

      <v-tabs-items v-model="tab" light touchless>
        <v-tab-item v-for="(category, i) in categories" :key="i" class="tabContents">
          <div class="listWrap">
            <div class="eqList" :class="eqListMove">
              <div class="listTitle">
                <v-icon size="60" color="#fff" class="mr-4">mdi-washing-machine</v-icon>
                <span>사용하실 장비를 선택해주세요</span>
                </div>
              <div class="itemList">
                <v-list flat three-line>
                  <v-list-item-group>
                    <v-list-item
                      v-for="machine in machinesByCategory[category]"
                      :key="machine.id"
                      @click="nextList(machine)"
                    >
                      <div class="eqItem">
                        <dl>
                          <dt>{{ machine.name }}</dt>
                          <dd>용량 {{ machine.size }}</dd>
                        </dl>
                        <v-icon size="60">mdi-chevron-right</v-icon>
                      </div>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </div>
            </div>
            <!-- eqList -->

            <div class="goodsList" :class="goodsListMove">
              <div class="listTitle">
                <v-btn width="100px" height="100px" elevation="0" class="backBtn" @click="backList">
                  <v-icon size="50" color="#fff">mdi-chevron-left</v-icon>
                </v-btn>
                <dl>
                  <dt>
                    <span>{{ selectedMachine.name }}</span
                    >(을)/를 선택하셨습니다
                  </dt>
                  <dd>상품을 선택해주세요</dd>
                </dl>
              </div>
              <div class="itemList">
                <v-list flat three-line>
                  <v-list-item-group>
                    <v-list-item
                      v-for="product in selectedMachine.products"
                      :key="product.id"
                      @click="nextPage(product)"
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
        </v-tab-item>
      </v-tabs-items>
    </div>

    <AlertModal
      ref="alter"
      title="네트워크 오류"
      message="장치와의 통신이 원활하지 않습니다"
      mode="alert"
    />
    <ProgressModal ref="progress" title="연결상태 확인 중" />
    <OverlayGuide>
      <img src="@/assets/img/overlay_guide01.png" />
    </OverlayGuide>
  </div>
</template>

<script>
import SubTitleBar from '@/components/SubTitleBar.vue';
import UserInfo from '@/components/UserInfo.vue';
import AlertModal from '@/components/modal/AlertModal.vue';
import ProgressModal from '@/components/modal/ProgressModal.vue';
import OverlayGuide from '@/components/MachineSelect/OverlayGuide.vue';
import { mapActions, mapMutations, mapState } from 'vuex';
import { groupBy, sortBy } from 'lodash';
export default {
  name: 'MachineSelect',
  components: {
    SubTitleBar,
    UserInfo,
    AlertModal,
    ProgressModal,
    OverlayGuide,
  },
  data() {
    return {
      tab: null,
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
      categories: state => state.kiosk.tabs,
    }),
    // categories() {
    //   return Object.keys(this.machinesByCategory);
    // },
  },
  mounted() {
    this.machinesByCategory = groupBy(sortBy(this.machines, 'sort'), machine => machine.category);

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
  margin-top: 60px;
}
.tabHead {
  padding: 0 60px;
  background: #e2e2e2;
  position: relative;
  height: 118px;
  padding-top: 22px;
}
.v-tab {
  width: 280px;
  background: unset;
  font-size: 36px;
  letter-spacing: 0;
  height: 100px;
  border-radius: 20px 20px 0 0;
}
.tabTitle {
  background: #e2e2e2;
  overflow: hidden;
  color: #888 !important;
}
.tabTitleActive {
  background:#fff;
  border-radius: 20px 20px 0 0;
  border: 0px;
  color: #0085de !important ;
}
.v-tabs-items {
  flex: 1;
}
.tabContents {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  height: 100%;
  padding: 60px;

  .listWrap {
    position: relative;
    height: 1100px;
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
          background-color: #ced4da;

          &:hover {
            background-color: #adb5bd;
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
          background-color: #ced4da;

          &:hover {
            background-color: #adb5bd;
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
        .backBtn {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
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
