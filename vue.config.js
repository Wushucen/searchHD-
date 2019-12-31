

module.exports = {
  productionSourceMap: false,
  //禁用eslint
  lintOnSave: false,
  devServer: {
    overlay: {
      warning: false,
      errors: false
    },
    host: "0.0.0.0",
    port: 8080, // 端口号
    open: true, //配置自动启动浏览器
    hot: true,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:9800/", // 要访问的接口域名
        ws: true, // 是否启用websockets
        changeOrigin: true,//允许跨域
        pathRewrite: {
          '^/api': '' //这里理解成用'/api'代替target里面的地址,比如我要调用'http://40.00.100.100:3002/user/add'，直接写'/api/html/user/add'即可
        }
      }
    }
  },
}