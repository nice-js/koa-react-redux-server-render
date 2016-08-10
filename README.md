#koa-react-redux-server-render

react routes

```js

app.use(reactReduxServerRender(routes,createStore,render)

```

routes.js

```js
export default(history) => (
  <Router history={history}>
    <Route path='/home' component={Home}/>
    <Route path='/about' component={About}/>
  </Router>
)
```


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
