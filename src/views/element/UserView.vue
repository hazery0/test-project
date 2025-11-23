<template>
    <el-container>
                <el-header style="font-size: 40px; background-color: rgb(238,241,246)">
                    Quiz后台管理
                    <el-button type="danger" size="mini" style="float:right;margin-top:8px;" @click="logout">退出</el-button>
                </el-header>
        <el-container>
            <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
                <el-menu :default-openeds="['1']">
                    <el-submenu index="1">
                        <template slot="title"><i class="el-icon-message"></i>管理选项</template>
                        <el-menu-item-group>
                            <el-menu-item index="1-1">
                                <router-link to="/user">用户管理</router-link>
                            </el-menu-item>
                            <el-menu-item index="1-2">
                                <router-link to="/question">题目管理</router-link>
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <!-- 顶部的查询表单 -->
                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                    <el-form-item label="用户名">
                        <el-input v-model="formInline.keyword" placeholder="请输入用户名关键词"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSearch">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="success" @click="onAddNewUser">添加用户</el-button>
                    </el-form-item>
                </el-form>

                <el-table :data="tableData" style="width: 100%">
                    <el-table-column label="ID" width="80" prop="id" align="center"></el-table-column>
                    
                    <el-table-column label="用户名" width="180" prop="userName" align="center">
                        <template slot-scope="scope">
                            <el-tag type="primary">{{ scope.row.userName }}</el-tag>
                        </template>
                    </el-table-column>
                    
                    <el-table-column label="添加日期" width="200" align="center">
                        <template slot-scope="scope">
                            <i class="el-icon-time"></i>
                            <span style="margin-left: 8px">{{ formatDate(scope.row.createTime) }}</span>
                        </template>
                    </el-table-column>
                    
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button size="mini" type="danger"
                                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <!-- 换行符 -->
                <br />
                <!-- 分页 -->
                <el-pagination 
                    background 
                    layout="prev, pager, next" 
                    :page-size="pageSize"
                    :total="total"
                    :current-page="currentPage"
                    @current-change="handlePageChange"
                >
                </el-pagination>

                <!-- 弹出添加用户的会话框 -->
                <el-dialog title="添加新用户" :visible.sync="dialogFormVisible">
                    <el-form :model="form">
                        <el-form-item label="用户名" :label-width="formLabelWidth">
                            <el-input v-model="form.name" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" :label-width="formLabelWidth">
                            <el-input v-model="form.password" type="password" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="确认密码" :label-width="formLabelWidth">
                            <el-input v-model="form.confirmpassword" type="password" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                        <el-button type="primary" @click="onSubmitUser">确 定</el-button>
                    </div>
                </el-dialog>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            formLabelWidth: '120px',
            dialogFormVisible: false,
            
            // 分页相关数据
            pageSize: 5,
            total: 0,
            currentPage: 1,

            form: {
                name: '',
                password: '',
                confirmpassword: '',
            },

            formInline: {
                keyword: '',
            },

            tableData: []
        }
    },
    methods: {
        onAddNewUser() {
            this.dialogFormVisible = true;
        },

        // 提交新用户
        onSubmitUser() {
            console.log("Submitting user:", this.form);
            
            // 验证输入
            if (!this.form.name || !this.form.password) {
                this.$message.error('用户名和密码不能为空！');
                return;
            }
            
            if (this.form.password !== this.form.confirmpassword) {
                this.$message.error('两次输入的密码不一致！');
                return;
            }

            // 使用 URLSearchParams 发送表单数据
            const formData = new URLSearchParams();
            formData.append('username', this.form.name);
            formData.append('password', this.form.password);
            formData.append('checkpassword', this.form.confirmpassword);

            console.log("发送的表单数据:", formData.toString());
            
            // 发送请求 - 使用 application/x-www-form-urlencoded
            axios
                .post("/register", formData, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                })
                .then((response) => {
                    console.log("注册响应:", response.data);
                    
                    if (response.data.code === 1) {
                        // 关闭对话框
                        this.dialogFormVisible = false;
                        
                        // 清空表单
                        this.form = {
                            name: '',
                            password: '',
                            confirmpassword: '',
                        };
                        
                        // 显示成功提示
                        this.$message({
                            type: 'success',
                            message: '用户添加成功！',
                            duration: 3000,
                            showClose: true
                        });
                        
                        // 刷新数据
                        this.handlePageChange(this.currentPage);
                    } else {
                        // 显示后端返回的错误信息
                        this.$message.error(response.data.msg || '注册失败');
                    }
                    
                })
                .catch((error) => {
                    console.error("注册错误详情:", error);
                    
                    let errorMessage = '添加用户失败，请稍后重试！';
                    if (error.response && error.response.data) {
                        errorMessage = error.response.data.msg || errorMessage;
                    }
                    
                    this.$message.error(errorMessage);
                });
        },

        // 查询用户
        onSearch() {
            console.log("Searching for:", this.formInline.keyword);
            if (this.formInline.keyword) {
                // 有关键词时调用搜索接口
                axios
                    .get(`/findUser?keyword=${this.formInline.keyword}`)
                    .then((response) => {
                        this.tableData = response.data.data;
                        console.log("Search results:", response.data);
                        this.total = this.tableData.length; // 搜索结果的条数
                    })
                    .catch((error) => {
                        console.error("Error searching users:", error);
                    });
            } else {
                // 没有关键词时显示第一页
                this.handlePageChange(1);
            }
        },

        // 分页处理
        handlePageChange(page) {
            this.currentPage = page;
            axios
                .get(`/users?page=${this.currentPage}&pageSize=${this.pageSize}`)
                .then((response) => {
                    this.tableData = response.data.data.row;
                    this.total = response.data.data.total;
                })
                .catch((error) => {
                    console.error("Error fetching users:", error);
                });
        },

        // 删除用户
        handleDelete(index, row) {
            const id = row.id;
            this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
            .then(() => {
                axios
                    .get(`/deleteById?id=${id}`)
                    .then((response) => {
                        console.log(response.data);
                        // 删除成功后刷新当前页数据
                        this.handlePageChange(this.currentPage);
                        
                        // 显示成功消息
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    })
                    .catch((error) => {
                        console.error("Error deleting user:", error);
                        this.$message({
                            type: "error",
                            message: "删除失败，请稍后重试!",
                        });
                    });
            })
            .catch(() => {
                this.$message({
                    type: "info",
                    message: "已取消删除",
                });
            });
        },

        handleEdit(index, row) {
            console.log(index, row);
            // 编辑功能待实现
            this.$message.info('编辑功能待实现');
        },

        // 退出登录
        logout() {
            localStorage.removeItem('jwt_token');
            this.$router.push('/login');
            this.$message({
                type: 'success',
                message: '已退出登录',
            });
        },

        // 格式化日期
        formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleDateString('zh-CN') + ' ' + date.toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    },
    
    mounted() {
        // 组件挂载时加载第一页数据
        this.handlePageChange(1);
    }
}
</script>

<style>
/* 可以保留原有的样式 */
</style>