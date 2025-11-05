<template>
    <div>
        <el-row>
            <el-button>默认按钮</el-button>
            <el-button type="primary">主要按钮</el-button>
            <el-button type="success">成功按钮</el-button>
            <el-button type="info">信息按钮</el-button>
            <el-button type="warning">警告按钮</el-button>
            <el-button type="danger">危险按钮</el-button>
        </el-row>

        <el-input-number v-model="num" @change="handleChange" :min="1" :max="10" label="描述文字">
        </el-input-number>
    </div>
</template>

<script>
export default {
    data() {
        return {
            message: 'Hello Vue',
            num: 1,
        };
    },
    methods: {
        handleChange(value) {
            console.log('当前值：', value);
        },
    },
}
</script>

<style></style>