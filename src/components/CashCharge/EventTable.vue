<template>
  <div class="eventTable">
    <dl>
      <dt>구간별 추가적립 보너스</dt>
      <dd>
        <v-row>
          <v-col cols="4">
            <div class="eventItem" 
              :class="{active:realAmount<10000}"
            >
              <span class="name">
                1만원미만 결제시
              </span>
              <span class="cont">
                {{rules[0]}}% 포인트적립
              </span>
            </div>
          </v-col>
          <v-col cols="4">
            <div class="eventItem" 
              :class="{active:realAmount>=10000 && realAmount<20000}"
            >
              <span class="name">
                1만원 ~ 2만원 미만
              </span>
              <span class="cont">
                {{rules[1]}}% 포인트적립
              </span>
            </div>
          </v-col>
          <v-col cols="4">
            <div class="eventItem" 
              :class="{active:realAmount>=20000&&realAmount<30000}"
            >
              <span class="name">
                2만원 ~ 3만원 미만
              </span>
              <span class="cont">
                {{rules[2]}}% 포인트적립
              </span>
            </div>
          </v-col>
          <v-col cols="4">
            <div class="eventItem" 
              :class="{active:realAmount>=30000&&realAmount<40000}"
            >
              <span class="name">
                3만원 ~ 4만원 미만
              </span>
              <span class="cont">
                {{rules[3]}}% 포인트적립
              </span>
            </div>
          </v-col>
          <v-col cols="4">
            <div class="eventItem" 
              :class="{active:realAmount>=40000&&realAmount<50000}"
            >
              <span class="name">
                4만원 ~ 5만원 미만
              </span>
              <span class="cont">
                {{rules[4]}}% 포인트적립
              </span>
            </div>
          </v-col>
          <v-col cols="4">
            <div class="eventItem" 
              :class="{active:realAmount>=50000}"
            >
              <span class="name">
                5만원이상 결제시
              </span>
              <span class="cont">
                {{rules[5]}}% 포인트적립
              </span>
            </div>
          </v-col>
        </v-row>
      </dd>
    </dl>
  </div>
</template>

<script>
export default {
  props: {
    realAmount: Number,
    rules: Array,
  },
  data() {
    return {
      
    };
  },
}
</script>

<style lang="scss" scoped>
.eventTable{
  position:relative;
  z-index:3;
  margin-top:40px;
  dl{
    overflow:hidden;
    dt{
      font-size:32px;
      font-weight:500;
      background:#292929;
      height:80px;
      display:flex;
      align-items: center;
      padding:0 40px;
      color:#fff;
      margin-top:-1px;
      border-radius:10px;
    }
    dd{
      overflow-y:auto;
      margin-top:15px;
      .eventItem{
        background:#fff;
        padding:20px;
        border-radius:10px;
        border:3px solid #e2e2e2;
        text-align:center;
        span{display:block;}
        span.name{font-size:24px;color:#292929;}
        span.cont{font-size:28px;color:#EE2073;font-weight:500}
        
      }
      .eventItem.active{
        border:4px solid #EE2073;
        box-sizing: border-box;
      }
    }
  }
}
</style>