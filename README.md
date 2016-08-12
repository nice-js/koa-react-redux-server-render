#koa-react-redux-server-render



> react redux server render middleware for [koa](https://github.com/koajs/koa)

* react-router服务器端处理.
* SEO的完美支持.
* 服务端store的数据加载.

Demo

[m.botdir.io](http://m.botdir.io/list)

## 安装

Install using [npm](https://www.npmjs.org/):

```sh
npm install koa-react-redux-server-render --save
``` 

## 使用

### react-router

createRoutes.js
```js

  import {Route, Router} from 'react-router'
  import {Home,About} from './containers'
  
  export default(history) => (
  <Router history={history}>
    <Route path='/home' component={Home}/>
    <Route path='/about' component={About}/>
  </Router>
)
```

### 在koa中使用 (目前只支持1.0)

`app.use(reactReduxServerRender(routes,createStore,render)`


| 参数 | 类型 | 说明 |
| --- | --- | --- |
| routes | Router | reacr-router的路由 |
| createStore() | Function | 创建store的function |
| render({__body,state,head}) | Function | 渲染react的处理方法，<br> * _body:解析后的React Component的StaticMarkup <br>state: 当前的store数据<br>head: 当前的头处理数据，比如title,meta等（目前使用的是[react-helmet](https://github.com/nfl/react-helmet)）|

使用example
```js

import Koa from 'koa'
import reactReduxServerRender from 'koa-react-redux-server-render'
import configureStore from '../src/store/configureStore'
import createMemoryHistory from 'history/lib/createMemoryHistory'
import createRoutes from '../src/routes'

const app=Koa()

// apply react server render
const history = createMemoryHistory()
app.use(reactReduxServerRender(createRoutes(history), () => {
  return configureStore({}, history)
}, function* (models) {
  yield this.render('index', models)
}))

```

### SEO相关处理

#### 1. React控件

```js

import React, {Component, PropTypes} from 'react'
import Helmet from 'react-helmet'

class Home extends Component {
  render() {
    return (
      <div>
        <Helmet title='首页' meta={[
          {
            'name': 'description',
            'content': 'test application'
          }, {
            'property': 'og:type',
            'content': 'article'
          }
        ]}/>
      </div>
    )
  }
}

Home.propTypes = {
  blogs: PropTypes.object.isRequired,
  fetchBlogs: PropTypes.func.isRequired
}

export default Home

```
#### 2. render 处理

```html

<!DOCTYPE html>
<html>
  <head>
    {{head.title}}
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
    {{head.meta}}
    <link rel="apple-touch-icon" sizes="57x57" href="/images/apple-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="60x60" href="/images/apple-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="72x72" href="/images/apple-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="76x76" href="/images/apple-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="114x114" href="/images/apple-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="120x120" href="/images/apple-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="/images/apple-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="/images/apple-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-icon-180x180.png">
    <link rel="icon" type="image/png" sizes="192x192"  href="/images/android-icon-192x192.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="96x96" href="/images/favicon-96x96.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png">
    <meta name="msapplication-TileImage" content="/images/ms-icon-144x144.png">
    {{head.link}}
    <script>
      window.___INITIAL_STATE__ = {{state|json|safe}}
    </script>
  </head>
  <body>
    <div id="root">
      {{__body|safe}}
    </div>
  </body>
</html>

```

### 服务端获取数据解决方案

> 在组建中实现static fetchData() -> Promise 方法

```js

class HomeConatiner extends Component {

  static fetchData({store, params, location}) {
    return store.dispatch(actions.fetchAll())
  }

  render() {
    return (
      <div>
        Test
      </div>
    )
  }
}

```

具体使用可以参考 [nicejs](http://github.com/nice-js/nicejs-web)


