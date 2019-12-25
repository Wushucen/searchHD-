<template>
  <div class="login">
    <el-card class="box-card" shadow="hover">
      <h2>登录</h2>
      <el-input placeholder="账 号" v-model="username">
        <i slot="prefix" class="el-input__icon el-icon-user-solid"></i>
      </el-input>
      <el-input
        placeholder="密 码"
        v-model.trim="password"
        @keyup.native="loginKeyDown"
        show-password
      >
        <i slot="prefix" class="el-input__icon el-icon-more"></i>
      </el-input>
      <div class="tag" style="height:10px">
        <el-tag v-show="bigChar">大写锁定已打开</el-tag>
      </div>
      <el-link type="primary" @click="dialogVisible = true">注册</el-link>
      <el-button type="primary" @click="login">登录</el-button>
    </el-card>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="账 号" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="密 码" prop="password">
          <el-input v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: "",
      //存储用户名和密码的数据，随意填写
      userinfo: [{ "123": "321" }, { "345": "543" }],
      index: 0,
      bigChar: false,
      firstTochar: false,
      dialogVisible: false,
      ruleForm: {
        name: "",
        password: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入账号", trigger: "blur" }
          // {
          //   pattern: /^([a-zA-Z0-9_\u4e00-\u9fa5]{4,16})$/,
          //   message: "4-16位字母,数字,汉字,下划线"
          // }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" }
          // {
          //   pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/,
          //   message: "密码至少包含 数字和英文，长度6-20"
          // }
        ]
      }
    };
  },
  watch: {
    userinfo() {
      // this.$set(this.userinfo);
    }
  },
  methods: {
    loginKeyDown(event) {
      const _that = this;
      //是否输入过字母键，且判断是否按键为caps lock
      if (_that.firstTochar) {
        if (event.keyCode === 20) {
          _that.bigChar = !_that.bigChar;
          return;
        }
      }
      //未输入过字母键，或按键不是caps lock，判断每次最后输入的字符的大小写
      var e = event || window.event;
      var keyvalue = e.keyCode ? e.keyCode : e.which;
      var shifKey = e.shiftKey ? e.shiftKey : keyvalue == 16 ? true : false;
      if (typeof _that.password === "undefined") {
        return;
      }
      var strlen = _that.password.length;
      var password = _that.password;

      if (strlen) {
        var uniCode = password.charCodeAt(strlen - 1);
        if (keyvalue >= 65 && keyvalue <= 90) {
          //如果是字母键
          _that.firstTochar = true;
          if (
            (uniCode >= 65 && uniCode <= 90 && !shifKey) ||
            (uniCode >= 97 && uniCode <= 122 && shifKey)
          ) {
            _that.bigChar = true;
          } else {
            _that.bigChar = false;
          }
        }
      }
    },
    login() {
      const username = this.username;
      const password = this.password;
      // 检查非空
      if (username == "" || password == "") {
        this.$message({
          message: "必须填写用户名和密码",
          type: "warning"
        });
        return;
      }
      for (let i = 0; i < this.userinfo.length; i++) {
        if (
          Object.keys(this.userinfo[i]) == this.username &&
          Object.values(this.userinfo[i]) == this.password
        ) {
          localStorage.setItem("user", this.username);
          this.$message({
            message: "登录成功！",
            type: "success"
          });
          this.$router.push({ name: "Home" }); //路由跳转
          break;
        } else {
          this.$message({
            message: "请输入正确的用户名和密码！",
            type: "warning"
          });
          break;
        }
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.userinfo.push({ [this.ruleForm.name]: this.ruleForm.password });
          localStorage.setItem("userinfo", this.userinfo);
          console.log(this.userinfo);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
.bg-purple {
  height: 20px;
}
element.style {
  min-width: 455px !important;
  min-height: 320px !important;
}
.login {
  box-sizing: border-box;
  // padding: 50px;
  display: flex;
  width: 100%;
  height: 100%;
  text-align: center;
  .box-card {
    text-align: center;
    width: 480px;
    margin: 8% auto;

    // z-index: 99;
    .el-input {
      margin-top: 25px;
    }
    .tag {
      width: 105px;
    }
    .el-tag {
      margin-left: 0;
    }
    .el-button {
      margin-top: 20px;
      width: 100%;
    }
  }
  .box-card[data-v-7589b93f] {
    margin: 20px auto !important;
  }
}
</style>