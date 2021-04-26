<template>
  <div id="container">
    <SubTitleBar title="장비선택" />
    <UserInfo />

    <div id="contents">
      <dl class="visualTitle">
        <dt>사용하실 장비를 선택해주세요</dt>
        <dd>아래 버튼을 터치해주세요</dd>
      </dl>

      <div class="divider" />

      <div class="eqCateList">

        <div 
          class="btn" 
          @click="nextPage('MachineSelect', '세탁기')" 
          v-ripple 
          v-if="tabs.includes('세탁기')"
        >
          <dl>
            <dt>
              <img src="@/assets/img/washer-icon.png">
            </dt>
            <dd>
              <strong>세탁기</strong>
              <span>WASHER</span>
            </dd>
          </dl>
          <div class="arrow-icon">
            <v-icon>mdi-chevron-right-circle-outline</v-icon>
          </div>
        </div>

        <div 
          class="btn" 
          @click="nextPage('MachineSelect', '건조기')" 
          v-ripple 
          v-if="tabs.includes('건조기')"
        >
          <dl>
            <dt>
              <img src="@/assets/img/dryer-icon.png">
            </dt>
            <dd>
              <strong>건조기</strong>
              <span>DRYER</span>
            </dd>
          </dl>
          <div class="arrow-icon">
            <v-icon>mdi-chevron-right-circle-outline</v-icon>
          </div>
        </div>

        <div 
          v-for="tab in tabsExceptDefaults"
          :key="tab.id"
          class="btn" 
          @click="nextPage('MachineSelect', tab)" 
          v-ripple
        >
          <dl>
            <dt>
              <v-icon>mdi-cube-outline</v-icon>
            </dt>
            <dd>
              <strong>{{ tab }}</strong>
            </dd>
          </dl>
          <div class="arrow-icon">
            <v-icon>mdi-chevron-right-circle-outline</v-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SubTitleBar from '@/components/SubTitleBar';
import { mapState } from 'vuex';
import UserInfo from '@/components/UserInfo';

export default {
  name: 'CategorySelect',
  components: {
    SubTitleBar,
    UserInfo,
  },
  computed: {
    ...mapState({
      tabs: state => state.kiosk.tabs,
    }),
    tabsExceptDefaults() {
      return this.tabs.filter(tab => tab !== '세탁기' && tab !== '건조기');
    },
  },
  methods: {
    nextPage(value, category) {
      this.$router.push({
        name: value,
        params: {
          category,
        },
      });
    }
  },
}
</script>

<style lang="scss" scoped>

.visualTitle{ 
  color:#0085DE;
  dt{font-size:64px;font-weight:500;word-break: keep-all;}
  dd{font-size:36px;margin-top:20px;color:#888}
}

.divider{height:3px;background:#e2e2e2;margin:60px 0}

.eqCateList{
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
  height:960px;
  overflow-y: scroll;
  padding-right: 20px;

  .btn{
    display:flex;
    justify-content: space-between;
    align-items: center;
    border:3px solid #d2d2d2;
    border-radius:15px;
    min-height:200px;
    margin-bottom:30px;

    dl{
      display:flex;
      align-items: center;
      
      dt{
        width:180px;
        text-align:center;

        .v-icon{
          font-size:80px;
        }
      }
      dd{
        strong{
          display:block;
          font-size:56px;
          line-height:56px;
          font-weight:500;
        }
        span{
          display:block;
          font-size:27px;
          color:#888;
          letter-spacing: 0px;
          font-family:'Roboto';
          font-weight:500;
          margin-top:10px;
        }
      }
    }

    .arrow-icon{
      margin-right:45px;
      .v-icon{
        font-size:70px;
        color:#EE2073
      }
    }

  }
}

/* .eqCateList::-webkit-scrollbar{
  display:none;
} */


</style>