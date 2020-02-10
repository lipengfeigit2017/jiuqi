# gmc-cfas

> gmc-cfas

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
# 修改npm仓库源
```
npm config set registry http://10.2.3.180:8081/repository/npm-public/
npm config set registry https://registry.npmjs.org/

```
# 开发模式配置
## 配置调用后端的服务地址
打开配置文件 gmc-cfas/config/index.js

全服务启动时，只修改网关地址。

单服务启动时，配置单个服务转发的地址
```
proxyTable: {
        // 本地单服务启动
        /*'/api/kettle(服务名)': {
          target: 'http://127.0.0.1:9110',
          secure: false,
          changeOrigin: true,
          pathRewrite: {'^/api' : ''},
        },*/
        // Spring Cloud后台服务网关地址
        '/api': {
            target: 'http://10.2.6.47:9999',
            secure: false,
            changeOrigin: true,
            pathRewrite: {'^/api' : ''},
        },
    },
```
## 单服务启动时axios插件配置
打开文件 gmc-cfas/src/utils/axiosPlugin.js
```
axios.interceptors.request.use((config) => {
    // 附加token信息
    if (sessionStorage.token) {
        config.headers.Authorization = sessionStorage.token
    }
    // 单服务启动
    // config.url = `${config.url }?JTOKENID=${sessionStorage.token}`
    return config
}, (error) => {
    return Promise.reject(error)
})
```
## cfas-web源码依赖va-web
1、修改va-web的package.json文件，调整main属性
```
"main": "./src/lib.js",
```
2、修改cfas-web的package.json文件，调整"va-web": 相对路径
```
"va-web": "file:../../../va/front-end/va-web",
```
3、cfas-web下执行npm install va-web


