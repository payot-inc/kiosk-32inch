<template>
  <div id="wrap">
    <Header />
    <router-view />
    <Footer />
  </div>
</template>

<script>
import Header from './HeaderComponent.vue';
import Footer from './FooterComponent.vue';

export default {
  name: 'Layout',
  components: {
    Header,
    Footer,
  },
};
</script>
