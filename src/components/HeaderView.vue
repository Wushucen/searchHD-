<template>
  <!-- nav bar -->
  <nav
    class="navbar navbar-inverse navbar-fixed-top"
    style="margin-bottom: 0;"
    role="navigation"
    id="elastic-hd-header"
  >
    <div class="container-fluid navContai">
      <!--放置logo...-->
      <div class="navbar-header">
        <a class="navbar-brand" id="elastic-logo-color" href="/">
          <i class="fa fa-dashboard fa-x"></i> ElasticHD
        </a>
      </div>
      <!--end-->
      <!-- Collect the nav links, forms, and other content for toggling -->
      <div class="navbar-collapse collapse" id="bs-example-navbar-collapse-1">
        <form class="navbar-form navbar-left" role="search">
          <div class="form-group">
            <div class="input-group">
              <div class="input-group-addon">
                <i class="fa fa-sitemap fa-1x"></i>
              </div>
              <input class="form-control" v-model="serverhost" id="elastic-host" />
            </div>
            <button @click="elasticHDConnect" class="btn btn-primary">Connect</button>
          </div>
        </form>
        <p class="navbar-text">
          集群健康状态：
          <span id="elastic-status" :style="statusStyleObject">{{status}}</span>
        </p>
        <ul class="nav navbar-nav pull-right">
          <li>
            <a v-bind:href="githubUrl" target="_blank">
              <i class="fa fa-github"></i> Star On GitHub
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "elastic-hd-header",
  data: function() {
    return {
      serverhost: ""
    };
  },
  computed: {
    ...mapGetters(["githubUrl", "status", "statusStyleObject"])
  },
  methods: {
    elasticHDConnect: function() {
      this.$store.dispatch("CookieSetServerHost", this.serverhost);
    }
  },
  created() {
    this.$store.dispatch("CookieGetServerHost");
    this.serverhost = this.$store.getters.serverhost;
    this.$store.dispatch("HttpPost", {
      url: "/_cat/health",
      host: this.serverhost
    });
    this.$store.dispatch("GetIndexList", {
      url: "/_cat/indices",
      host: this.serverhost
    });
  }
};
</script>

<style lang="less" >
.navbar {
  padding: 0 !important;
}
.container-fluid {
  background-color: #2c3e50;
}
.navContai {
  background-color: #2c3e50;
  height: 50px;
  display: flex;
  #elastic-logo-color {
    flex: 1;
    float: left;
    color: #1dc07f;
  }
  #elastic-logo-color:hover {
    color: #19a26b;
  }
  .navbar-collapse {
    flex: 1;
    height: 35px;
    line-height: 1;
    .navbar-form {
      float: left;
      flex: 1;
    }
    .form-group {
      display: flex;
      .input-group {
        float: left;
        flex: 1;
        .input-group-addon {
          width: 35px;
          height: 35px;
          border-right: 20px;
          line-height: 35px;
          text-align: center;
          border-radius: 4px 0 0 4px;
        }
        #elastic-host {
          width: 14em;
          color: #181a1b;
          float: left;
          height: 35px;
        }
      }
      .btn-primary {
        height: 35px;
        line-height: 1;
        background-color: #337ab7;
        border-color: #2e6da4;
      }
    }
    .navbar-text {
      flex: 1;
      color: #9d9d9d;
      margin-left: 20px;
      // float: left !important;
    }
    .pull-right {
      li {
        a {
          color: #9d9d9d;
          line-height: 35px;
        }
      }
    }
  }
}
.collapse:not(.show) {
  display: block !important;
}

.input-group .input-group-addon {
  background: #f6f7f7;
  color: #1dc07f;
  float: left;
}
</style>


