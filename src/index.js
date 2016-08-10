import {
  RouterContext,
  match
} from 'react-router'
import ReactDOMServer from 'react-dom/server'
import React from 'react'
import {
  Provider
} from 'react-redux'
import Helmet from 'react-helmet'

// get component fetchData promise
const _getFetchDataPromise = (renderProps, store) => {
  const {
    query,
    params,
    location
  } = renderProps
  let component = renderProps.components[renderProps.components.length - 1]

  // if container read WrappedComponent
  if (component.WrappedComponent) {
    component = component.WrappedComponent
  }

  return component.fetchData ?
    component.fetchData({
      query,
      params,
      store,
      location
    }) :
    Promise.resolve()
}

// match react routes
const matchRoutes = ({
  routes,
  location
}) => new Promise((resolve, reject) => {
  match({
    routes,
    location
  }, (error, redirectLocation, renderProps) => {
    if (error) {
      reject(error)
      return
    }
    resolve({
      redirectLocation,
      renderProps
    })
  })
})

// render components
const _renderComponents = (props, store) => {
  return ReactDOMServer.renderToStaticMarkup(
    <Provider store={store}>
      <RouterContext {...props}/>
    </Provider>
  )
}

// middleware
export default (routes, createStore, render) => {
  if (!render) {
    throw new Error('render is required')
  }

  return function*(next) {
    try {
      // match react route
      const route = yield matchRoutes({
        routes,
        location: this.originalUrl
      })
      const {
        redirectLocation,
        renderProps
      } = route

      // redirect
      if (redirectLocation) {
        this.redirect(302, redirectLocation.pathname + redirectLocation.search)
        return
      }

      // render props
      if (renderProps) {

        //create new store
        const store = createStore()
        // ensure static fetchData run
        const fetchData = _getFetchDataPromise(renderProps, store)

        if (!fetchData) {
          this.throw(500, 'please check your static function "fetchData" return is a promise?')
        }

        // run fetchData
        yield fetchData

        // get state and render component
        const initialState = store.getState()
        const html = _renderComponents(renderProps, store)

        // title link meta init
        const head = Helmet.rewind()

        // render view
        yield render.call(this, {
          __body: html,
          state: initialState,
          head
        })
        return
      }
    } catch (error) {
      this.throw(500, error)
    }

    yield * next
  }
}
