
<template>
  <el-container>
    <el-header style="font-size: 40px; background-color: rgb(238, 241, 246); display: flex; justify-content: center; align-items: center;">
      Quiz后台管理系统登录
    </el-header>
    <el-main>
      <el-form :model="form" :rules="rules" ref="loginForm" label-width="80px" class="login-form" @keyup.enter.native="onSubmit">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" autocomplete="username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" autocomplete="current-password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" :disabled="loading" @click="onSubmit">登录</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>


<script>
import axios from "axios";

export default {
  name: 'LoginView',
  data() {
    return {
      form: {
        username: '',
        password: '',
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      },
      loading: false,
    };
  },
  methods: {
    onSubmit() {
      if (this.loading) return;
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          axios.post('/login', {
            username: this.form.username,
            password: this.form.password
          }, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(res => {
            if (res.data.code === 1) {
              // 登录成功，保存 token 并跳转
              if (res.data.data) {
                const token = res.data.data;
                localStorage.setItem('jwt_token', token); // Save token to localStorage
                localStorage.setItem('jwt_token', res.data.data);
              }
              this.$message.success('登录成功');
              this.$router.push('/user');
            } else {
              this.$message.error('登录失败：' + (res.data.msg || res.data.message || '未知错误'));
            }
          })
          .catch(err => {
            let msg = '登录异常';
            if (err.response && err.response.data && (err.response.data.msg || err.response.data.message)) {
              msg = err.response.data.msg || err.response.data.message;
            }
            this.$message.error(msg);
          })
          .finally(() => {
            this.loading = false;
          });
        } else {
          this.$message.error('请填写完整的用户名和密码');
        }
      });
    },
  },
};
</script>


<style>
.login-form {
  max-width: 400px;
  margin: 50px auto;
}
</style>