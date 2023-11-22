<template>
    <div class="loginContainer">
        <el-card class="box-card">
            <!-- 登录区域 -->
            <el-form :model="loginForm" label-width="0px" class="login_box" ref="loginForm">
                <h2>任务管理系统</h2>
                <!-- 账号 -->
                <el-form-item prop="username">
                    <el-input placeholder="输入用户名" v-model="loginForm.username" clearable>
                        <i slot="prefix" class="el-icon-user-solid"></i>
                    </el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input placeholder="输入密码" type="password" v-model="loginForm.password" show-password clearable>
                        <i slot="prefix" class="el-icon-lock"></i>
                    </el-input>
                </el-form-item>
                <!-- 按钮 -->
                <el-form-item style="display: flex; justify-content: right;">
                    <el-button type="primary" @click="login" round>登录</el-button>
                    <el-button type="info" @click="resetLoginForm" round>重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>


<script>
import { doPost } from '@/utils/axios.js'

export default {
    components: {

    },
    data() {
        return {
            // 登录数据
            loginForm: {
                username: '',
                password: ''
            }
        }
    },
    methods: {
        // 登录
        login() {
            doPost("/user/login", this.loginForm, (resp) => {
                window.sessionStorage.setItem("token", resp.data)
                this.$router.push('/dashboard')
            })
        },
        // 清空登录信息
        resetLoginForm() {
            this.loginForm.username = ""
            this.loginForm.password = ""
        }
    }
}
</script>

<style scoped>
.loginContainer {
    background-image: url('@/assets/img/bg.svg');
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.box-card {
    width: 380px;
}

h2 {
    text-align: center;
    /* 水平居中 */
}
</style>