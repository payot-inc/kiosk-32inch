<template>
  <div class="passwordModal">
    <v-dialog
      v-model="visible"
      width="100%"
      transition="dialog-bottom-transition"
      style="overflow:none"
      overlay-opacity="0.8"
      overlay-color="#000"
      persistent
    >
      <div class="modalBody">
        <v-btn
          @click="show(false)"
          width="140px"
          height="140px"
          class="closeBtn"
          elevation="0"
          style="background:#fff"
        >
          <v-icon size="80">fas fa-times-circle</v-icon>
        </v-btn>

        <ModalHeadNew
          v-if="type === 'newUser'"
          :phone="$store.state.user.phone"
          :setJoinAgree="setJoinAgree"
        />
        <ModalHeadRepeat 
          v-if="type === 'newUserPassword'" 
          :phone="$store.state.user.phone" 
        />
        <ModalHeadLogin 
          v-if="type === 'matchPassword' || type === 'inValidePassword' || type === 'matchResetPassword' || type === 'inValideResetPassword'" 
          :phone="$store.state.user.phone"
          :type="type"
          :findPassword="findPassword"
        />

        <ModalKeyPad 
          :type="type"
          @submit="setPassword($event)"
        />
      </div>
    </v-dialog>
  </div>
</template>

<script>
import ModalMixin from '@/mixins/modal';
import ModalHeadNew from '@/components/UserLogin/ModalHeadNew.vue';
import ModalHeadRepeat from '@/components/UserLogin/ModalHeadRepeat.vue';
import ModalHeadLogin from '@/components/UserLogin/ModalHeadLogin.vue';
import ModalKeyPad from '@/components/UserLogin/ModalKeyPad.vue';

export default {
  name: 'PasswordModal',
  components: {
    ModalHeadNew,
    ModalHeadRepeat,
    ModalHeadLogin,
    ModalKeyPad,
  },
  props: {
    type: String,
    registNewPassword: Function,
    login: Function,
    findPassword: Function,
    matchResetPassword: Function,
    updatePassword: Function,
  },
  data() {
    return {
      password: '',
      joinAgree: false,
    };
  },
  computed: {
    completeNew() {
      return this.joinAgree === true && this.password.length === 4;
    },
  },
  watch: {
    type(newValue) {
      this.setPassword('');
      if (newValue === 'findUser' || newValue === 'done') {
        this.show(false);
      } else {
        this.resetData();
        this.show(true);
      }
    },
    completeNew(isComplete) {
      if (isComplete) {
        this.registNewPassword(this.password);
      }
    },
    password(newValue) {
      if (newValue.length === 4) {
        if (this.type === 'newUserPassword') {
          this.login(newValue);
        } else if (this.type === 'matchPassword') {
          console.log('로그인시도');
          this.login(newValue);
        } else if(this.type === 'matchResetPassword') {
          const matching = this.matchResetPassword(this.password);
          console.log('matching', matching);
        } else if(this.type === 'inValideResetPassword') {
          this.updatePassword(newValue);
        }
      }
    },
  },
  methods: {
    resetData() {
      this.password = '';
      this.joinAgree = false;
    },
    setJoinAgree(state) {
      this.joinAgree = state;
    },
    setPassword(value) {
      this.password = value;
    },
  },
  mixins: [ModalMixin],
};
</script>

<style lang="scss" scoped>
.modalBody {
  border-radius: 60px 60px 0 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  position: relative;
  .closeBtn {
    position: absolute;
    background: #fff;
    border-radius: 70px;
    top: -70px;
    z-index: 10;
  }
}
.v-dialog__content {
  align-items: flex-end;
}
.v-dialog {
  overflow-y: initial;
}
</style>
