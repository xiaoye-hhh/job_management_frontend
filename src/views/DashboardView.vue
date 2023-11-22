<template>
    <el-container>
        <el-header>
            <div class="header">
                <div>
                    <el-avatar :src="logo.banner" :size="50"></el-avatar>
                </div>
                <h1>任务控制</h1>
                <div style="display: flex;">
                    <el-button type="success" @click="newJobDialogVisible = true">新增</el-button>
                    <el-button type="danger" @click="logout">退出</el-button>
                </div>
            </div>
        </el-header>
        <el-main>
            <el-card>
                <!-- 表格 -->
                <el-table :data="records" stripe border style="width: 100%">
                    <el-table-column header-align="center" align="center" prop="createTime" label="更新日期">
                    </el-table-column>
                    <el-table-column header-align="center" align="center" prop="dir" label="工作目录">
                    </el-table-column>
                    <el-table-column header-align="center" align="center" prop="cmd" label="命令简介">
                    </el-table-column>
                    <el-table-column header-align="center" align="center" label="操作">
                        <template slot-scope="scope">
                            <el-button :disabled="scope.$index === 0" @click="upJob(`${scope.row.id}`)" icon="el-icon-top"
                                plain></el-button>
                            <el-button :disabled="scope.$index === 0" @click="downJob(`${scope.row.id}`)"
                                icon="el-icon-bottom" plain></el-button>
                            <el-button :disabled="scope.$index === 0" @click="openUpdateJobDailog(`${scope.row.id}`)"
                                plain>修改</el-button>
                            <el-button type="danger" :disabled="scope.$index === 0" @click="deleteJob(`${scope.row.id}`)"
                                plain>删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="pageInfo.page" :page-sizes="[5, 10]" :page-size="pageInfo.pageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total">
                </el-pagination>
            </el-card>
        </el-main>

        <!-- 创建新任务 -->
        <el-dialog title="新建任务" :visible.sync="newJobDialogVisible" width="30%">
            <el-input placeholder="请输入工作目录" v-model="newDir" clearable>
            </el-input>
            <div style="margin: 10px 0;"></div>
            <el-input type="textarea" placeholder="请输入命令" v-model="newCmd" clearable>
            </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelNewJob">取 消</el-button>
                <el-button type="primary" @click="addJob">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改任务 -->
        <el-dialog title="修改任务" :visible.sync="updateJobDialogVisible" width="30%">
            <el-input placeholder="请输入工作目录" v-model="updateJobData.dir" clearable>
            </el-input>
            <div style="margin: 10px 0;"></div>
            <el-input placeholder="请输入命令" v-model="updateJobData.cmd" clearable>
            </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="updateJobDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateJob">确 定</el-button>
            </span>
        </el-dialog>
    </el-container>
</template>

<script>
import { Message } from 'element-ui'
import { doGet, doPut, doDelete, doPost } from '@/utils/axios'

export default {
    data() {
        return {
            logo: {
                banner: require("@/assets/img/logo.svg")
            },
            // 新建任务
            newJobDialogVisible: false,
            newCmd: '',
            newDir: '',

            // 修改任务
            updateJobDialogVisible: false,
            updateJobData: { cmd: '', dir: '' },

            // 表格列表
            records: [],

            // 分页信息
            pageInfo: {
                page: 1,
                pageSize: 5,
                total: 0,
            }
        }
    },
    mounted() {
        console.log(process.env)
        this.getPage()
        this.startTimerToFlush()
    },

    beforeDestroy() {
        // 在组件销毁前清除定时任务，防止内存泄漏
        clearInterval(this.timer)
    },

    methods: {
        // 取消新增
        cancelNewJob() {
            this.newJobDialogVisible = false
            this.newCmd = ''
        },

        // 新增任务
        addJob() {
            this.newJobDialogVisible = false
            doPut('/job', { 'cmd': this.newCmd, 'dir': this.newDir }, (result) => {
                this.getPage()
            })
        },

        // 修改任务
        updateJob() {
            doPost('/job/update', this.updateJobData, (result) => {
                this.getPage()
            })
            this.updateJobDialogVisible = false
        },

        // 打开修改对话框，绑定上修改的任务信息
        openUpdateJobDailog(jobID) {
            this.updateJobData = this.records.filter((x) => x.id == jobID)[0]
            this.updateJobDialogVisible = true
        },

        // 删除任务
        deleteJob(jobID) {
            doDelete(`/job/${jobID}`, null, (result) => {
                this.getPage()
            })
        },

        // 上移任务
        upJob(jobID) {
            doPost(`/job/up/${jobID}`, null, (result) => {
                this.getPage()
            })
        },

        // 下移任务
        downJob(jobID) {
            doPost(`/job/down/${jobID}`, null, (result) => {
                this.getPage()
            })
        },

        // 拉取信息
        getPage() {
            doGet(`/job/page`, { 'page': this.pageInfo.page, 'pageSize': this.pageInfo.pageSize }, (result) => {
                this.records = result.data.records
                this.pageInfo.total = result.data.total

                for (let i = 0; i < this.records.length; i++) {
                    this.records[i].enable = false
                }
            })
        },

        // 当pagesize改变
        handleSizeChange(newPageSize) {
            this.pageInfo.pageSize = newPageSize
            this.getPage()
        },

        // 当page改变
        handleCurrentChange(newPage) {
            this.pageInfo.page = newPage
            this.getPage()
        },

        // 退出: 返回登录页面，清空token
        logout() {
            this.$router.push("/login")
            Message.success("退出账户")
        },

        startTimerToFlush() {
            // 每隔一定时间执行一次任务
            this.timer = setInterval(() => {
                this.getPage()
            }, process.env.VUE_APP_FLUSH_INTERVAL) 
        },
    }
}
</script>

<style>
.header {
    display: flex;
    justify-content: space-between;
    height: 60px;
    align-items: center;
    position: relative;
}

.el-header {
    background-color: #f6f6f6;
}

.el-main {
    position: absolute;
    top: 60px;
    bottom: 0;
    width: 100%;
    overflow-y: scroll;
}

.el-avatar {
    background-color: white;
}

.el-upload {
    margin-right: 10px;
}

.urlInput {
    display: block;
    width: 78%;
    height: 35px;
    border-radius: 7px;
    outline: none;
    border: 1px solid #ccc;
    color: rgb(87, 87, 87);
    padding: 0 10px;
}

.centerBox {
    display: flex;
    justify-content: space-between;
}
</style>

