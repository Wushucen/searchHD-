<template>
  <div id="home">
    <header-view></header-view>
    <div id="wrapper" class="container-fluid" style="padding:0px">
      <sidebar></sidebar>
      <toolsbar></toolsbar>
      <div id="content">
        <div v-if="activeIndex === 0">
          <OverView></OverView>
        </div>
        <div v-else-if="activeIndex === 1">
          <Search></Search>
        </div>
        <div v-else-if="activeIndex === 2">
          <Indices></Indices>
        </div>
        <div v-else-if="activeIndex === 3">
          <Mapping></Mapping>
        </div>
        <div v-else-if="activeIndex === 4">
          <Tools></Tools>
        </div>
        <div v-else-if="activeIndex === 5">
          <Help></Help>
        </div>
        <!-- <div v-else-if="activeIndex === 6">
          <Monitor></Monitor>
        </div>
        <div v-else-if="activeIndex === 7"> 
          <Queryui></Queryui>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import HeaderView from "./HeaderView.vue";
import Sidebar from "./Sidebar.vue";
import Toolsbar from "./Toolsbar";
import OverView from "./overview";
import Search from "./search";
import Indices from "./indices";
import Mapping from "./mapping";
import Help from "./help";
import Tools from "./tools";
// import Monitor from './monitor'
// import Queryui from './queryui'
export default {
  name: "home",
  components: {
    HeaderView,
    Sidebar,
    Toolsbar,
    OverView,
    Search,
    Indices,
    Mapping,
    Help,
    Tools
    // Monitor,
    // Queryui
  },
  computed: {
    ...mapGetters(["activeIndex"])
  },
  created: function() {
    // this.$store.commit('changeShowIndex')
    // console.log(this.$store.state.showIndex)
  }
};
</script>

<style>
body { padding-top: 0px; }
#wrapper {
    position: absolute;
    top: 55px;
    bottom: 0;
    left: 0px;
    right: 0px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    -moz-border-radius-topleft: 15px;
    -webkit-border-top-left-radius: 15px;
    border-top-left-radius: 15px;
    -moz-border-radius-topright: 15px;
    -webkit-border-top-right-radius: 15px;
    border-top-right-radius: 15px;
    -webkit-box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.04);
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.04);
    overflow: hidden
}

#content {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    margin-top: 51px;
    background-color: #F7F7FF;
    padding: 20px;
    left: 80px
}
</style>

