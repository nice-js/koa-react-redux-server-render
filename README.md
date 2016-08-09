#koa-react-redux-server-render

react routes

routes.js
```
export default(history) => (
  <Router history={history}>
    <Route path='/home' component={Home}/>
    <Route path='/about' component={About}/>
  </Router>
)
```

```
import Koa from 'koa'
import reactReduxServerRender from 'koa-react-redux-server-render'
import configureStore from '../src/store/configureStore'
import createMemoryHistory from 'history/lib/createMemoryHistory'
import createRoutes from '../src/routes'

const app=Koa()

const history = createMemoryHistory()
app.use(reactReduxServerRender(createRoutes(history), store, function* (models) {
  yield this.render('index', models)
}))
```
