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
                    <el-form-item label="题目">
                        <el-input v-model="formInline.keyword" placeholder="请输入题目关键词"
                            @keyup.enter="onSearch"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSearch">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onAddNewQuestion">添加题目</el-button>
                    </el-form-item>
                </el-form>

                <!-- 显示的table -->
                <el-table :data="tableData" style="width: 100%">
                    <el-table-column label="序号" width="80">
                        <template slot-scope="scope">
                            <span>{{ scope.row.id }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="题目" width="300">
                        <template slot-scope="scope">
                            <div class="name-wrapper">
                                <span>{{ scope.row.questionText }}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="选项" width="350">
                        <template slot-scope="scope">
                            <span>{{ scope.row.options }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="答案" width="150">
                        <template slot-scope="scope">
                            <span>{{ scope.row.answer }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="150">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button size="mini" type="danger"
                                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <!-- 分页 -->
                <div style="margin-top: 20px; text-align: center;">
                    <el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="total"
                        :current-page="currentPage" @current-change="handlePageChange">
                    </el-pagination>
                </div>

                <!-- 添加题目的对话框 -->
                <el-dialog title="添加新题目" :visible.sync="dialogFormVisible" @closed="resetForm">
                    <el-form :model="form">
                        <el-form-item label="题目" :label-width="formLabelWidth">
                            <el-input v-model="form.question" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="选项A" :label-width="formLabelWidth">
                            <el-input v-model="form.optiona" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="选项B" :label-width="formLabelWidth">
                            <el-input v-model="form.optionb" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="选项C" :label-width="formLabelWidth">
                            <el-input v-model="form.optionc" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="选项D" :label-width="formLabelWidth">
                            <el-input v-model="form.optiond" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="答案" :label-width="formLabelWidth">
                            <el-input v-model="form.answer" autocomplete="off" placeholder="请输入正确答案，如：A"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                        <el-button type="primary" @click="onSubmitQuestion">确 定</el-button>
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
            pageSize: 5,
            total: 0,
            currentPage: 1,
            loading: false,

            form: {
                question: '',
                optiona: '',
                optionb: '',
                optionc: '',
                optiond: '',
                answer: '',
            },

            formInline: {
                keyword: '',
            },

            tableData: []
        }
    },
    methods: {
        // 加载题目列表
        loadQuestions() {
            axios
                .get(`/questions?page=${this.currentPage}&pageSize=${this.pageSize}`)
                .then((response) => {
                    this.tableData = response.data.data.qsBeanList;
                    this.total = response.data.data.total;
                })
                .catch((error) => {
                    console.error("Error fetching questions:", error);
                    this.$message.error('加载题目失败');
                });
        },

        // 分页处理
        handlePageChange(page) {
            this.currentPage = page;
            if (this.formInline.keyword.trim()) {
                this.onSearch();
            } else {
                this.loadQuestions();
            }
        },

        // 打开添加题目对话框
        onAddNewQuestion() {
            this.dialogFormVisible = true;
        },

        // 提交新题目
        onSubmitQuestion() {
            console.log("Submitting question:", this.form);
            axios
                .post("/addQuestion", JSON.parse(JSON.stringify(this.form)), {
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                .then((response) => {
                    console.log("Question added successfully:", response.data);
                    this.$message({
                        type: 'success',
                        message: '题目添加成功!'
                    });
                    this.dialogFormVisible = false;
                    this.resetForm();
                    // 刷新当前页数据
                    this.handlePageChange(this.currentPage);
                })
                .catch((error) => {
                    console.error("Error adding question:", error);
                    this.$message.error('题目添加失败');
                });
        },

        // 搜索题目
        onSearch() {
            if (!this.formInline.keyword.trim()) {
                this.loadQuestions();
                return;
            }

            this.loading = true;
            const keyword = this.formInline.keyword.trim();

            axios
                .get(`/findQuestion?keyword=${encodeURIComponent(keyword)}`)
                .then((response) => {
                    console.log("Search results:", response.data);
                    this.tableData = response.data.data || [];
                    this.total = this.tableData.length;
                    this.currentPage = 1;

                    // 搜索后清空关键词（作业要求）
                    this.formInline.keyword = '';

                    if (this.tableData.length === 0) {
                        this.$message.info('未找到相关题目');
                    }
                })
                .catch((error) => {
                    console.error("Error searching questions:", error);
                    this.$message.error('搜索失败');
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        // 编辑题目
        handleEdit(index, row) {
            this.$message.info('编辑功能待实现');
            console.log('编辑:', index, row);
            // 实现编辑功能
            // 1. 打开编辑对话框
            // 2. 填充当前题目数据
            // 3. 调用更新接口
        },

        // 删除题目
        handleDelete(index, row) {
            const id = row.id;
            this.$confirm("此操作将永久删除该题目, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    axios
                        .get(`/delQuestion?id=${id}`)
                        .then((response) => {
                            console.log(response.data);
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            // 删除成功后刷新当前页数据
                            this.handlePageChange(this.currentPage);
                        })
                        .catch((error) => {
                            console.error("Error deleting question:", error);
                            this.$message.error("删除失败，请稍后重试!");
                        });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除",
                    });
                });
        },

        // 重置表单
        resetForm() {
            this.form = {
                question: '',
                optiona: '',
                optionb: '',
                optionc: '',
                optiond: '',
                answer: '',
            };
        },

        // 回车搜索
        handleEnter(event) {
            if (event.key === 'Enter') {
                this.onSearch();
            }
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
    },
    mounted() {
        // 初始化加载第一页数据
        this.handlePageChange(1);
    }
}
</script>

<style scoped>
.name-wrapper {
    word-break: break-word;
}

.el-table {
    margin-top: 20px;
}
</style>