<template>
  <div id="container">
    <SubTitleBar  title="사용내역조회"/>
    <div id="contents" class="userHistory">
      <div class="pointInfo">
        <span><strong>{{user.phone}}</strong>님의</span> 
        <span>남은 포인트는 <strong style="color:#0085DE">{{user.point | numeral(0, 0)}}</strong>점입니다</span>
      </div>
      <div class="list">
        <ul>
          <li>
            <div class="itemHead">
              <div>
                <span class="cate chage">충전</span>
                <span class="date">2020-10-24 12:34:15</span>
              </div>
              <div>
                <!-- <span class="eqName">장비이름</span> -->
              </div>
            </div>
            <div class="itemBody">
              <dl class="order">
                <dt>결제금액</dt>
                <dd>5,000 원</dd>
              </dl>
              <dl>
                <dt>사용포인트</dt>
                <dd>0</dd>
              </dl>
              <dl>
                <dt>적립포인트</dt>
                <dd>500</dd>
              </dl>
              <dl class="oddPoint">
                <dt>남은포인트</dt>
                <dd>80,500</dd>
              </dl>
            </div>
          </li>

          <li v-for="item in 10" :key="item">
            <div class="itemHead">
              <div>
                <span class="cate use">사용</span>
                <span class="date">2020-10-24 12:34:15</span>
              </div>
              <div>
                <span class="eqName">1번 세탁기</span>
              </div>
            </div>
            <div class="itemBody">
              <dl class="order">
                <dt>결제금액</dt>
                <dd>0 원</dd>
              </dl>
              <dl>
                <dt>사용포인트</dt>
                <dd>5,000</dd>
              </dl>
              <dl>
                <dt>적립포인트</dt>
                <dd>250</dd>
              </dl>
              <dl class="oddPoint">
                <dt>남은포인트</dt>
                <dd>75,000</dd>
              </dl>
            </div>
          </li>
        </ul>
      </div>
      <div class="btns">
        <v-btn text class="eq-use" @click="$router.push({ name: 'MachineSelect' })">
          <label>장비사용 바로가기</label>
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
        <v-btn text class="chage-use" @click="$router.push({ name: 'ChargeType' })">
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
export default {
  components: {
    SubTitleBar,
  },
  computed: {
    ...mapState({
      user: state => state.user,
    }),
  }
  
}
</script>

<style lang="scss" scoped>
.pointInfo{
  text-align:right;
  font-size:48px;
  span{display:block;}
  strong{font-weight:600;color: #292929;}
}
.list{
  height:100%;
  margin-top:40px;
  border-radius:30px;
  border:3px solid #e2e2e2;
  background:#f2f2f2;
  box-shadow: 10px 10px 30px rgba(0,0,0,0.1);
  overflow-y: scroll;
  ul{
    padding:0px;
    
    li{
      background:#fff;
      border-bottom:3px solid #e2e2e2;
      min-height:150px;
      padding:45px;
      .itemHead{
        display:flex;
        justify-content: space-between;
        align-items: center;
        font-size:28px;
        >div{
          display:flex;
          align-items: center;
        }
        .cate{
          display:inline-block;
          color:#fff;
          height:45px;
          line-height:45px;
          padding:0 30px;
          border-radius:22.5px;
          margin-right:30px;
        }
        .cate.chage{background:#0085DE}
        .cate.use{background:#EE2073}
        .date{
          color:#888;
        }
        .eqName{
          color:#292929;
        }
      }
      .itemBody{
        display:flex;
        align-items: center;
        margin-top:30px;
        dl{
          flex:1;
          display:flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-end;
          border-left:3px solid #e2e2e2;
          margin-left:30px;
          dt{
            color:#888;
            text-align:right;
          }
          dd{
            font-size:30px;
            margin-top:9px;
            font-weight:500;
            text-align:right;
          }
        }
        dl.order{
            dd{color:#EE2073}
          }
        dl.oddPoint{
          dd{color:#0085DE}
        }
        dl:first-child{border:0px;}
      }
    }
  }
}
.btns{
  display:flex;
  align-items: center;
  margin-top:60px;
  border-radius:50px;
  height:120px;
  background:#fff;
  overflow: hidden;
  box-shadow: 10px 10px 30px rgba(0,0,0,0.1);
  .v-btn{
    flex:1;;
    min-height:120px;
    label{
      font-size:30px;
      font-weight:400;
      color:#fff;
    }
    .v-icon{
      margin-left:15px;
      font-size:50px;
      color:#fff;
    }
  }
  .v-btn.eq-use{
    background:#0085DE;
  }
  .v-btn.chage-use{
    background:#EE2073;
  }
}
</style>