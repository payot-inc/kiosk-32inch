<template>
  <div id="container">
    <SubTitleBar title="사용내역조회" />
    <div id="contents" class="userHistory">
      <div class="pointInfo">
        <span
          ><strong>{{ user.phone }}</strong
          >님의</span
        >
        <span
          >남은 포인트는 <strong style="color:#0085DE">{{ user.point | numeral('0,0') }}</strong
          >점 입니다</span
        >
      </div>
      <div class="list" ref="listDiv">
        <ul>
          <li v-for="history in historyList" :key="history.id">
            <div class="itemHead">
              <div>
                <span v-if="history.type === 'use'" class="cate use">사용</span>
                <span v-if="history.type === 'charge'" class="cate chage">충전</span>
                <span v-if="history.type === 'edit'" class="cate edit">관리자변동</span>
                <span class="date">{{ history.createdAt | moment("YYYY-MM-DD HH:mm") }}</span>
              </div>
              <div>
                <span v-if="history.machine" class="eqName">{{ history.machine.name }}</span>
              </div>
            </div>
            <div class="itemBody">
              <dl class="order">
                <dt>결제금액</dt>
                <dd>{{ history.realAmount | numeral('0,0') }} 원</dd>
              </dl>
              <dl>
                <dt>사용포인트</dt>
                <dd>{{ history.inputAmount | numeral('0,0') }} P</dd>
              </dl>
              <dl>
                <dt>적립포인트</dt>
                <dd>{{ history.appendPoint | numeral('0,0') }} P</dd>
                <!-- <dd>없음</dd> -->
              </dl>
              <dl class="oddPoint">
                <dt>변동포인트</dt>
                <dd>{{ history.totalPoint | numeral('0,0') }} P</dd>
              </dl>
            </div>
          </li>
        </ul>
      </div>
      <div class="btns">
        <v-btn text class="eq-use" v-touchEvent:tap="() => $router.push({ name: 'CategorySelect' })">
          <label>장비사용 바로가기</label>
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
        <v-btn text class="chage-use" v-touchEvent:tap="() => $router.push({ name: 'ChargeType' })">
          <label>충전하러 바로가기</label>
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import SubTitleBar from '@/components/SubTitleBar.vue';
import { mapState } from 'vuex';
import { kioskAPI } from '../plugins/axios';
import { debounce } from 'lodash';
export default {
  name: 'UseList',
  components: {
    SubTitleBar,
  },
  data() {
    return {
      offset: 0,
      limit: 10,
      historyList: [],
      debounceEventer: null,
    };
  },
  computed: {
    ...mapState({
      user: state => state.user,
      machines: state => state.machines,
    }),
  },
  methods: {
    async getList() {
      const { data } = await kioskAPI({
        method: 'GET',
        url: `/user/${this.user.id}/list`,
        params: {
          offset: this.offset,
          limit: this.limit,
        },
      });

      this.offset += this.limit;

      let rows = data.data;
      rows = rows.map(({ machineId, ...item }) => {
        if (!machineId) return Object.assign({}, item);
        const targetMachineName = this.machines.find(({ id }) => id === machineId).name;
        return Object.assign({}, item, { machine: { name: targetMachineName } });
      });

      this.historyList = this.historyList.concat(rows);
      if(this.historyList.length >= data.totalCount) {
        this.$refs.listDiv.removeEventListener('scroll', this.debounceEventer);
      }
    },
    scrolling(e) {
      if((e.target.scrollTop + e.target.clientHeight) > e.target.scrollHeight * 0.9) {
        this.getList();
      }
    },
  },
  mounted() {
    this.getList();
    this.debounceEventer = debounce(this.scrolling, 300);
    this.$refs.listDiv.addEventListener('scroll', this.debounceEventer);
  },
};
</script>

<style lang="scss" scoped>
.pointInfo {
  text-align: right;
  font-size: 48px;
  span {
    display: block;
  }
  strong {
    font-weight: 600;
    color: #292929;
  }
}
.list {
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
  height: 100%;
  margin-top: 40px;
  border-radius: 30px;
  border: 3px solid #e2e2e2;
  background: #f2f2f2;
  box-shadow: 10px 10px 30px rgba(0, 0, 0, 0.1);
  overflow-y: scroll;
  max-height: 1100px;
  ul {
    padding: 0px;

    li {
      background: #fff;
      border-bottom: 3px solid #e2e2e2;
      min-height: 150px;
      padding: 45px;
      .itemHead {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 28px;
        > div {
          display: flex;
          align-items: center;
        }
        .cate {
          display: inline-block;
          color: #fff;
          height: 45px;
          line-height: 45px;
          padding: 0 30px;
          border-radius: 22.5px;
          margin-right: 30px;
        }
        .cate.chage {
          background: #0085de;
        }
        .cate.use {
          background: #ee2073;
        }
        .cate.edit {
          background: #20ee3b;
        }
        .date {
          color: #888;
        }
        .eqName {
          color: #292929;
        }
      }
      .itemBody {
        display: flex;
        align-items: center;
        margin-top: 30px;
        dl {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-end;
          border-left: 3px solid #e2e2e2;
          margin-left: 30px;
          dt {
            color: #888;
            text-align: right;
          }
          dd {
            font-size: 30px;
            margin-top: 9px;
            font-weight: 500;
            text-align: right;
          }
        }
        dl.order {
          dd {
            color: #ee2073;
          }
        }
        dl.oddPoint {
          dd {
            color: #0085de;
          }
        }
        dl:first-child {
          border: 0px;
        }
      }
    }
  }
}
.btns {
  display: flex;
  align-items: center;
  margin-top: 60px;
  border-radius: 50px;
  height: 120px;
  background: #fff;
  overflow: hidden;
  box-shadow: 10px 10px 30px rgba(0, 0, 0, 0.1);
  .v-btn {
    flex: 1;
    min-height: 120px;
    label {
      font-size: 30px;
      font-weight: 400;
      color: #fff;
    }
    .v-icon {
      margin-left: 15px;
      font-size: 50px;
      color: #fff;
    }
  }
  .v-btn.eq-use {
    background: #0085de;
  }
  .v-btn.chage-use {
    background: #ee2073;
  }
}
</style>
