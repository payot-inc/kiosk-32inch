<template>
  <v-dialog
    v-model="visible"
    class="dialog"
    width="960px"
  >
    <div class="terms">
      <div class="termsHead" @click="touchHead">
        {{serviceTerms.title}}
      </div>

      <div class="termsBody" v-html="serviceTerms.body" @click="touchBody">

      </div>

      <div class="termsBottom">
        <v-btn outlined @click="close">닫기</v-btn>
      </div>
    </div>
  </v-dialog>
</template>

<script>
import { info, user as userInfo } from '@/assets/docs/terms';
import { ipcRenderer, remote } from 'electron';
export default {
  data(){
    return{
      visible:false,
      serviceTerms: {
        title: '개인정보 취급방침',
        body: userInfo.replace(/\n/g, '<br />')
      },      
      exitCount: 0,
      logoutCount: 0,
      type: '',
    }
  },
  watch: {
    visible(newValue) {
      this.logoutCount = 0;
      this.exitCount = 0;
    },
    logoutCount(newValue) {
      if(newValue === 15) {
        this.$router.push({ name: 'AccountLogin' });
      }
    },
    exitCount(newValue) {
      if(newValue === 15) {
        ipcRenderer.invoke('exit-app');
        // remote.app.exit();
      }
    },
  },
  methods:{
    open(type){
      this.type = type;
      if(type === 'user') {
        this.serviceTerms.title = '개인정보 취급방침';
        this.serviceTerms.body = userInfo.replace(/\n/g, '<br />');
        this.visible = !this.visible;
      } else if(type === 'info') {
        this.serviceTerms.title = '키오스크 이용약관';
        this.serviceTerms.body = info.replace(/\n/g, '<br />');
        this.visible = !this.visible;
      }
    },
    close() {
      this.visible = false;
    },
    touchBody() {
      this.logoutCount++;
    },
    touchHead() {
      this.exitCount++;
    },
  }
}
</script>


<style lang="scss" scoped>
.terms{
  
  background:#fff;
  border-radius:20px;
  overflow:hidden;
  
  .termsHead{
    display:flex;
    align-items: center;
    font-size:36px;
    font-weight:500;
    height:100px;
    padding:0 40px;
    border-bottom:2px solid #e2e2e2
  }
  .termsBody{
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

    height:1200px;
    padding:40px;
    overflow-y:auto;
    font-size:24px;
    iframe{
      border:0px;
      font-size:24px;
    }
  }
  .termsBottom{
    display:flex;
    justify-content: center;
    align-items:center;
    height:150px;
    border-top:2px solid #e2e2e2;
    .v-btn{
      font-size:32px;
      width:300px;
      height:80px;
      background:#292929;
      color:#fff;
      font-weight:500;
      border-radius:40px;
    }
  }
}
</style>