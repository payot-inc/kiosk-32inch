<template>
  <div class="login">
    <div class="contents">
      <div class="loginTitle" @click="exitCount++">KIOSK<span>PRO</span></div>

      <div class="loginBox">
        <label>키오스크 로그인</label>
        <input type="text" class="textInput" placeholder="아이디" v-model="form.email" />
        <input
          type="password"
          class="textInput"
          placeholder="비밀번호"
          v-model="form.password"
          @keydown.enter="kioskLogin"
        />
        <v-btn block outlined height="90px" class="loginBtn" dark @click="kioskLogin">로그인</v-btn>
      </div>
    </div>

    <AlertModal ref="error" :title="error.title" :message="error.message" />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Joi from 'joi';
import { remote } from 'electron';

const LoginFormValidate = Joi.object({
  email: Joi.string()
    .email({ tlds: false })
    .messages({
      'string.empty': '이메일을 입력해 주세요',
      'string.email': '이메일 형식이 맞는지 확인해 주세요',
    }),
  password: Joi.string()
    .min(4)
    .max(20)
    .messages({
      'string.empty': '비밀번호를 입력해 주세요',
      'string.min': '비밀번호는 최소 4자리 이상이어야 합니다',
      'string.max': '비밀번호는 20자를 넘을 수 없습니다',
    }),
});

export default {
  name: 'AccountLogin',
  data() {
    return {
      form: { email: '', password: '' },
      error: {
        title: '',
        message: '',
      },
      exitCount: 0,
    };
  },
  watch: {
    exitCount(newValue) {
      if(newValue === 15) {
        remote.app.exit();
      }
    },
  },
  methods: {
    ...mapActions({
      login: 'accountLogin',
    }),
    kioskLogin() {
      LoginFormValidate.validateAsync(this.form)
        .catch(({ message }) => {
          this.error.title = '정보 입력 오류';
          this.error.message = message;
          this.$refs.error.show(true);
        })
        .then(this.login)
        .then(() => this.$router.replace({ name: 'Main' }))
        .catch(err => {
          if (err.response) {
            this.error.title = '로그인 오류';
            let message = '';
            switch (err.response.status) {
              case 400:
                message = '비밀번호가 다릅니다';
                break;
              case 422:
                message = '존재하지 않는 계정입니다';
                break;
              default:
                message = '알 수 없는 오류가 발생하였습니다';
            }
            this.error.message = message;
          } else {
            this.error.title = '네트워크 오류';
            this.error.message = '네트워크 상태를 확인해 주세요';
          }
          this.$refs.error.show(true);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 120px;
  height: 100%;
  background: #292929;
}
.loginTitle {
  font-size: 130px;
  line-height: 110px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 60px;
  text-align: center;
  text-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
  vertical-align: middle;
  letter-spacing: 5px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  span {
    display: inline-block;
    height: 78px;
    line-height: 78px;
    font-size: 54px;
    border-radius: 10px;
    background: #fff;
    padding: 0 20px;
    margin-left: 20px;
    color: #393939;
    letter-spacing: 0px;
    text-shadow: none;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.3);
  }
}
.loginBox {
  width: 100%;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  padding: 60px;
  color: #fff;
  border-top: 4px solid rgba(255, 255, 255, 0.15);
  border-left: 4px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 60px rgba(255, 255, 255, 0.08);
  label {
    display: block;
    font-size: 36px;
    margin-bottom: 30px;
  }
  .textInput {
    font-size: 32px;
    height: 90px;
    background: #fff;
    width: 100%;
    border-radius: 10px;
    color: #292929;
    padding: 0 20px;
    margin-bottom: 30px;
  }
  input:focus {
    outline: 0;
    border-radius: 10px;
  }
  .checkLine {
    margin-bottom: 30px;
    display: flex;
    flex-direction: row;
    align-items: center;
    .check {
      width: 34px;
      height: 34px;
      vertical-align: middle;
      padding: 0px;
      margin-right: 15px;
    }
    p {
      font-size: 28px;
      margin: 0px;
      span {
        font-size: 24px;
        color: #aaa;
        margin-left: 10px;
      }
    }
  }
  .loginBtn {
    font-size: 32px;
    border-radius: 10px;
    background: #3f29d9;
    border: 0px;
  }
}
</style>
