<template>
  <div id="overview">
    <section class="overview-panel-widget">
      <el-row :gutter="10" class="navtotal">
        <el-col :xs="24" :sm="4" :md="4" :lg="4" v-for="item in panelWidget" :key="item.name">
          <div class="panel panel-widget" v-bind:class="item.colors">
            <el-row>
              <el-col :span="8">
                <div class="widget-left">
                  <i v-bind:class="item.fontAwesome"></i>
                </div>
              </el-col>
              <el-col :span="16">
                <div class="widget-right">
                  <div class="large">{{item.value}}</div>
                  <div class="text-muted">{{item.name}}</div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="24" :md="24" :lg="24">
          <div style="background-color:#ffffff;">
            <div class="chart" id="cpu-chart" style="width: 100%; height:300px;"></div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12">
          <el-table :data="clusterInfo" border style="width: 100%">
            <el-table-column prop="name" label="Cluster Health" width="200"></el-table-column>
            <el-table-column prop="value"></el-table-column>
          </el-table>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12">
          <el-table :data="statsInfo" border style="width: 100%">
            <el-table-column prop="name" label="ElasticSearch Stats Info" width="200"></el-table-column>
            <el-table-column prop="value"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="24" :md="12" :lg="12">
          <div style="background-color:#ffffff;">
            <p class="overview-p">
              <b>Index Templates中Type个数统计</b>
            </p>
            <div class="chart" id="temp-chart" style="width: 100%; height:401px;"></div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12">
          <el-table :data="indexList.slice(0, 9)" border style="width: 100%">
            <el-table-column label="Indices list">
              <el-table-column type="expand">
                <template scope="props">
                  <el-form label-position="left" inline class="demo-table-expand">
                    <el-form-item label="索引名称">
                      <span>{{ props.row.index }}</span>
                    </el-form-item>
                    <el-form-item label="文档个数">
                      <span>{{ props.row.docs }}</span>
                    </el-form-item>
                    <el-form-item label="文档删除个数">
                      <span>{{ props.row.delete }}</span>
                    </el-form-item>
                    <el-form-item label="STORE SIZE">
                      <span>{{ props.row.size }}</span>
                    </el-form-item>
                    <el-form-item label="主分片大小">
                      <span>{{ props.row.prisize }}</span>
                    </el-form-item>
                    <el-form-item label="分片个数">
                      <span>{{ props.row.pri }}</span>
                    </el-form-item>
                    <el-form-item label="副本个数">
                      <span>{{ props.row.rep }}</span>
                    </el-form-item>
                    <el-form-item label="索引状态">
                      <span>{{ props.row.status }}</span>
                    </el-form-item>
                    <el-form-item label="健康状态">
                      <span>{{ props.row.health }}</span>
                    </el-form-item>
                    <el-form-item label="UUID">
                      <span>{{ props.row.uuid }}</span>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column prop="index" label="Index" show-overflow-tooltip></el-table-column>
              <el-table-column prop="docs" label="Docs" sortable show-overflow-tooltip></el-table-column>
              <el-table-column prop="size" label="Size" sortable show-overflow-tooltip></el-table-column>
              <el-table-column prop="status" label="Status" show-overflow-tooltip></el-table-column>
              <el-table-column label="操作">
                <template scope="scope">
                  <el-popover
                    ref="popover{{$index}}"
                    placement="top"
                    width="160"
                    v-model="scope.row.visible"
                    trigger="click"
                  >
                    <p>这个索引确定删除吗？Are you sure?</p>
                    <div style="text-align: right; margin: 0">
                      <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
                      <el-button
                        type="primary"
                        size="mini"
                        @click="handleDelete(scope.$index, scope.row)"
                      >确定</el-button>
                    </div>
                  </el-popover>
                  <el-button size="small" type="danger" v-popover:popover{{$index}}>删除</el-button>
                  <!--<el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </section>
  </div>
</template>

<script>
import echarts from "echarts";
import { mapGetters } from "vuex";
import { red } from "color-name";
export default {
  name: "overview",
  data: function() {
    return {};
  },
  computed: {
    ...mapGetters([
      "panelWidget",
      "statsInfo",
      "clusterInfo",
      "health",
      "serverhost",
      "charts",
      "templateInfo",
      "indexList",
      "DeleteIndexSuccess",
      "DeleteIndexError"
    ])
  },
  created: function() {
    this.$store.dispatch("SetClusterInfo", this.health);
    this.$store.dispatch("SetStats", {
      url: "/_cluster/stats",
      host: this.serverhost
    });
    this.$store.dispatch("GetTemplateInfo", {
      url: "/_template",
      host: this.serverhost
    });
  },
  watch: {
    health(val, oldval) {
      this.$store.dispatch("SetClusterInfo", val);
    },
    charts(val, oldval) {
      echarts
        .init(document.getElementById("cpu-chart"))
        .setOption(this.circle(this.charts));
    },
    templateInfo(val, oldval) {
      echarts
        .init(document.getElementById("temp-chart"))
        .setOption(this.tempChart(this.templateInfo));
    },
    DeleteIndexSuccess() {
      this.$message.success(this.DeleteIndexSuccess);
    },
    DeleteIndexError() {
      this.$message.error(this.DeleteIndexError);
    }
  },
  mounted: function() {
    echarts
      .init(document.getElementById("cpu-chart"))
      .setOption(this.circle(this.charts));
    echarts
      .init(document.getElementById("temp-chart"))
      .setOption(this.tempChart(this.templateInfo));
  },
  methods: {
    handleDelete(index, row) {
      row.visible = false;
      var tmp = {
        url: "/_indices/delete",
        index: row.index,
        host: this.serverhost
      };
      this.$store.dispatch("DeleteIndexByName", tmp);
    },
    circle: function(charts) {
      var labelFromatter = {
        normal: {
          label: {
            position: "center",
            formatter: function(params) {
              // console.log(params.name);
              // console.log(charts);
              var gb = 1024 * 1024 * 1024;
              var mb = 1024 * 1024;
              var kb = 1024;
              if (params.value > gb) {
                return Math.ceil(params.value / gb) + "GB";
              }
              if (params.value > mb) {
                return Math.ceil(params.value / mb) + "MB";
              }
              if (params.value > kb) {
                return Math.ceil(params.value / kb) + "KB";
              }
              return params.value;
            },
            textStyle: {
              baseline: "top"
            }
          }
        }
      };
      var labelBottom = {
        normal: {
          color: "#ccc",
          label: {
            show: true,
            position: "center"
          },
          labelLine: {
            show: false
          }
        }
      };
      var labelTop = {
        normal: {
          label: {
            show: true,
            position: "center",
            formatter: "{b}",
            textStyle: {
              baseline: "bottom"
            }
          },
          labelLine: {
            show: false
          }
        }
      };
      function b2b(value) {
        var gb = 1024 * 1024 * 1024;
        var mb = 1024 * 1024;
        var kb = 1024;
        if (value > gb) {
          return Math.ceil(value / gb) + "GB";
        }
        if (value > mb) {
          return Math.ceil(value / mb) + "MB";
        }
        if (value > kb) {
          return Math.ceil(value / kb) + "KB";
        }
        return value + "B";
      }
      var option = {
        tooltip: {
          trigger: "item",
          show: true, // 必须引入 tooltip 组件
          formatter: function(params) {
            if (params.name === "CPU") {
              return "CPU利用率: " + charts.cpuused + "%";
            }
            if (params.name === "CPUFree") {
              return "CPU剩余利用率: " + (100 - charts.cpuused) + "%";
            }
            if (params.name === "Jvm") {
              return "JVM已用内存: " + b2b(params.value);
            }
            if (params.name === "Jvm-mem") {
              return (
                "JVM剩余最大可用内存: " + b2b(charts.memtotal - charts.memused)
              );
            }
            if (params.name === "Mem") {
              return "内存已用: " + b2b(charts.memused);
            }
            if (params.name === "Fs-total") {
              return "存储容量剩余: " + b2b(charts.fsfree);
            }
            if (params.name === "Fs") {
              return "存储已用: " + b2b(charts.fstotal - charts.fsfree);
            }
            if (params.name === "FieldData") {
              return "Fielddata占用内存: " + b2b(charts.fielddata_mem_used);
            }
            if (params.name === "QueryCache") {
              return (
                "QueryCache占用内存: " + b2b(charts.query_cache_memory_size)
              );
            }
            if (
              params.name === "QueryCache-mem" ||
              params.name === "Field-mem" ||
              params.name === "Mem-total"
            ) {
              return "内存剩余可用: " + b2b(charts.memtotal - charts.memused);
            }
            return params.name + ":" + b2b(params.value);
          }
        },
        toolbox: {
          show: true,
          showTitle: false, // 隐藏默认文字，否则两者位置会重叠
          feature: {
            saveAsImage: {
              show: true,
              title: "Save As Image"
            },
            dataView: {
              show: true,
              title: "Data View"
            }
          },
          tooltip: {
            // 和 option.tooltip 的配置项相同
            show: true,
            // formatter: function(param) {
            //   return console.log(param) // 自定义的 DOM 结构
            // },
            backgroundColor: "#222",
            textStyle: {
              fontSize: 12
            },
            extraCssText: "box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);" // 自定义的 CSS 样式
          }
        },
        legend: {
          x: "center",
          y: "bottom",
          data: ["Jvm", "Mem", "Fs", "FieldData", "QueryCache", "CPU"]
        },
        title: {
          text: "ElasticSearch Cluster Status",
          subtext: "内存,硬盘,JVM状态",
          x: "center"
        },
        series: [
          {
            type: "pie",
            center: ["7%", "50%"],
            radius: [40, 55],
            x: "0%",
            label: {
              normal: {
                show: true,
                position: "center",
                formatter: function() {
                  let jvm = Math.ceil(
                    charts.vm_mem_used / (1024 * 1024 * 1024)
                  );
                  return `JVM\n${jvm}GB`;
                },
                textStyle: {
                  color: "rgb(194,53,49)"
                }
              }
            },
            data: [
              {
                name: "Jvm-mem",
                value: charts.memfree,
                itemStyle: labelBottom
              },
              { name: "Jvm", value: charts.vm_mem_used, itemStyle: labelTop }
            ]
          },
          {
            type: "pie",
            center: ["23%", "50%"],
            radius: [40, 55],
            x: "0%",
            label: {
              normal: {
                show: true,
                position: "center",
                formatter: function() {
                  let jvm = Math.ceil(charts.memfree / (1024 * 1024 * 1024));
                  return `Mem\n${jvm}GB`;
                },
                textStyle: {
                  color: "rgb(47,69,84)"
                }
              }
            },
            data: [
              {
                name: "Mem-total",
                value: charts.memfree,
                itemStyle: labelBottom
              },
              { name: "Mem", value: charts.memused, itemStyle: labelTop }
            ]
          },
          {
            type: "pie",
            center: ["39%", "50%"],
            radius: [40, 55],
            x: "0%",
            label: {
              normal: {
                show: true,
                position: "center",
                formatter: function() {
                  let jvm = Math.ceil(charts.fsfree / (1024 * 1024 * 1024));
                  return `Fs\n${jvm}GB`;
                },
                textStyle: {
                  color: "rgb(97,160,168)"
                }
              }
            },
            data: [
              {
                name: "Fs-total",
                value: charts.fsfree,
                itemStyle: labelBottom
              },
              {
                name: "Fs",
                value: charts.fstotal - charts.fsfree,
                itemStyle: labelTop
              }
            ]
          },
          {
            type: "pie",
            center: ["55%", "50%"],
            radius: [40, 55],
            x: "0%",
            label: {
              normal: {
                show: true,
                position: "center",
                formatter: function() {
                  let jvm = Math.ceil(charts.memfree / (1024 * 1024 * 1024));
                  return `FieldData\n${jvm}GB`;
                },
                textStyle: {
                  color: "rgb(212,130,101)"
                }
              }
            },
            data: [
              {
                name: "Field-mem",
                value: charts.memfree,
                itemStyle: labelBottom
              },
              {
                name: "FieldData",
                value: charts.fielddata_mem_used,
                itemStyle: labelTop
              }
            ]
          },
          {
            type: "pie",
            center: ["71%", "50%"],
            radius: [40, 55],
            x: "0%",
            label: {
              normal: {
                show: true,
                position: "center",
                formatter: function() {
                  let jvm = Math.ceil(charts.memfree / (1024 * 1024 * 1024));
                  return `QueryCache\n${jvm}GB`;
                },
                textStyle: {
                  color: "rgb(145,199,174)"
                }
              }
            },
            data: [
              {
                name: "QueryCache-mem",
                value: charts.memfree,
                itemStyle: labelBottom
              },
              {
                name: "QueryCache",
                value: charts.query_cache_memory_size,
                itemStyle: labelTop
              }
            ]
          },
          {
            type: "pie",
            center: ["87%", "50%"],
            radius: [40, 55],
            x: "0%",
            label: {
              normal: {
                show: true,
                position: "center",
                formatter: function() {
                  return `CPU\n${charts.cpufree}%`;
                },
                textStyle: {
                  color: "rgb(116,159,131)"
                }
              }
            },
            data: [
              {
                name: "CPUFree",
                value: charts.cpufree,
                itemStyle: labelBottom
              },
              { name: "CPU", value: charts.cpuused, itemStyle: labelTop }
            ]
          }
        ]
      };
      return option;
    },
    tempChart: function(templateInfo) {
      var tempOption = {
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: templateInfo.templateName,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        series: [
          {
            name: "表数量",
            type: "bar",
            barWidth: "40%",
            data: templateInfo.typeCount
          }
        ],
        label: {
          normal: {
            show: true,
            position: "top",
            formatter: "{c}"
          }
        },
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "rgba(17, 168,171, 1)"
              },
              {
                offset: 1,
                color: "rgba(17, 168,171, 0.1)"
              }
            ]),
            shadowColor: "rgba(0, 0, 0, 0.1)",
            shadowBlur: 10
          }
        }
      };
      return tempOption;
    }
  }
};
</script>


<style lang="less">
.el-table .cell {
  white-space: normal;
  word-break: break-all;
  line-height: 24px;
  overflow: hidden !important;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
}
.panel-pad {
  padding-right: 40px;
}
.widget-left {
  border-bottom-left-radius: 4px;
  border-top-left-radius: 4px;
  height: 80px;
  padding-top: 15px;
  text-align: center;
}

.widget-right {
  background: #ffffff none repeat scroll 0 0;
  border-bottom-right-radius: 4px;
  border-top-right-radius: 4px;
  color: #f8f8f8;
  font-weight: 300px;
  font-size: 0.8rem;
  height: 80px;
  line-height: 1.6em;
  margin: 0;
  padding: 20px;
  text-align: left;
}

.widget-right .text-muted {
  color: #9fadbb;
}

.widget-right .large {
  color: #5f6468;
  font-size: 1.3em;
}

.panel-pink .widget-left {
  background: #875ea2 none repeat scroll 0 0;
  color: #fff;
}

.panel-yellow .widget-left {
  background: #dc69aa none repeat scroll 0 0;
  color: #fff;
}

.panel-blue .widget-left {
  background: #58b7ff none repeat scroll 0 0;
  color: #fff;
}

.panel-teal .widget-left {
  background: #1ebfae none repeat scroll 0 0;
  color: #fff;
}

.panel-orange .widget-left {
  background: #f7ba2a none repeat scroll 0 0;
  color: #fff;
}

.panel-red .widget-left {
  background: #475669 none repeat scroll 0 0;
  color: #fff;
}

.panel-widget {
  background: #fff none repeat scroll 0 0;
  color: #1ebfae;
}

.overview-panel-widget {
  background: #f7f7ff none repeat scroll 0 0;
  .navtotal {
    margin-bottom: 25px;
  }
}

.panel .tabs {
  margin: 0;
  padding: 0;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.overview-p {
  word-wrap: normal;
  text-overflow: ellipsis;
  line-height: 39px;
  width: 100%;
  box-sizing: border-box;
  background-color: #eef1f6;
  border: 1px solid #dfe6ec;
  margin-right: 20px;
  padding: 0 20px;
}
</style>
