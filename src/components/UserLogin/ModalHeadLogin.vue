<template>
  <div class="head">
    <dl>
      <dt>
        <span>{{ phone }}</span> 님,
      </dt>
      <dd v-if="type === 'matchPassword'">비밀번호를 입력해주세요</dd>
      <dd v-else-if="type === 'inValidePassword'" class="red--text">
        비밀번호를 틀리셨습니다 <br />다시 입력해주세요
      </dd>
      <dd v-else-if="type === 'matchResetPassword'">
        휴대폰에 발송된 <br />임시비밀번호를 입력해주세요
      </dd>
      <dd v-else-if="type === 'inValideResetPassword'">
        새롭게 설정할 <br />비밀번호를 입력해주세요
      </dd>
    </dl>
    <v-btn v-if="type !== 'matchResetPassword' && type !== 'inValideResetPassword'" 
      @click="$refs.confirm.show(true)"
      height="60"
      class="pa-5"
      style="font-size:24px;border-radius:30px;border:3px solid #d2d2d2;"
      outlined 
    >
      <span>비밀번호가 생각나지 않습니다</span>
      <v-icon size="36" style="margin-left:15px;">mdi-chevron-right</v-icon>
    </v-btn>
    <ConfirmModal
      ref="confirm"
      :title="phone + ' 으로'"
      message="임시비밀번호를 발송할까요?"
      submitButtonText="네 발송합니다"
      cancelButtonText="아니오"
      @submit="$refs.massage.show(true); findPassword();"
    />
    <AlertModal
      ref="massage"
      mode="pass"
      message="휴대폰의 문자메세지를 확인해주세요"
      @done="$refs.passFind.open(true);"
    >
      <span style="color:#0085DE">{{ phone }}</span> 님의 번호로 임시비밀번호를
      발송하였습니다
    </AlertModal>

    <!-- <PassFind ref="passFind"></PassFind> -->
  </div>
</template>

<script>
import ConfirmModal from '@/components/modal/ConfirmModal.vue';
import AlertModal from '@/components/modal/AlertModal.vue';
export default {
  name: 'ModalHeadLogin',
  components: {
    ConfirmModal,
    AlertModal,
  },
  props: {
    phone: String,
    type: String,
    findPassword: Function,
  },
}
</script>

<style lang="scss" scoped>
.head {
  width: 100%;
  padding: 120px 60px 60px 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  dl{
    font-size:46px;
    font-weight:500;
    margin-bottom:30px;
    dt{
      span{
        color:#0085de;
        font-weight:600;
      }
    }


  }
  p {
    font-size: 32px;
    letter-spacing: -0.7px;
    word-break: keep-all;
    color: #888;
    span {
      color: #d22828;
    }
  }
  .aggreBox{
    display:flex;
    margin-top:30px;
    border-radius:10px;
    align-items:center;
    border:2px solid #e2e2e2;
    padding:20px 30px;
    .v-btn{background:#e2e2e2;border:0px;border-radius:50%;color:#292929;overflow:hidden;}
    .v-btn.active{background:#0085de;color:#fff;}
    span{font-size:24px;text-align:left;margin-left:30px;}
  }
}


</style>