<template>
  <div class="register">
    <h1>회원가입 페이지입니다</h1>
    <form @submit.prevent="fnRegisterUser">
            <label for="">이메일</label>
            <input type="text" v-model="sEmail"> <br>
            <label for="">비밀번호</label>
            <input type="password" v-model="sPassword"> <br>
            <input type="submit" value="회원가입">
        </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
            sEmail : "",
            sPassword : ""
        }
  },
  methods : {
    fnRegisterUser() {
            this.$store.dispatch("fnRegisterUser", {
                pEmail : this.sEmail,
                pPassword : this.sPassword
            })
        }
  }
}
</script>