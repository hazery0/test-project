<template>
  <div id="app">
    <!-- <h1 id="htitle">{{ message  }}</h1> -->
    <!-- <test-button></test-button>> -->

    <!-- <user-view></user-view> -->
    <!-- <question-view></question-view> -->
    <router-view></router-view>
  </div>
</template>

<script>
// import QuestionView from './views/element/QuestionView.vue';
// import TestButton from './views/element/TestButton.vue';
// import UserView from './views/element/UserView.vue';

export default {
  // components: { QuestionView },
  data() {
    return {
      message: 'Hello Vue',
      //num: 1,
    };
  },
  methods: {

  },
}
</script>