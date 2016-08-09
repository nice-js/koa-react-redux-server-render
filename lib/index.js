'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _reactRouter = require('react-router');

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _reactHelmet = require('react-helmet');

var _reactHelmet2 = _interopRequireDefault(_reactHelmet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// get component fetchData promise
var _getFetchDataPromise = function _getFetchDataPromise(renderProps, store) {
  var query = renderProps.query;
  var params = renderProps.params;
  var location = renderProps.location;

  var component = renderProps.components[renderProps.components.length - 1];

  // if container read WrappedComponent
  if (component.WrappedComponent) {
    component = component.WrappedComponent;
  }

  return component.fetchData ? component.fetchData({
    query: query,
    params: params,
    store: store,
    location: location
  }) : _promise2.default.resolve();
};

// match react routes
var matchRoutes = function matchRoutes(_ref) {
  var routes = _ref.routes;
  var location = _ref.location;
  return new _promise2.default(function (resolve, reject) {
    (0, _reactRouter.match)({
      routes: routes,
      location: location
    }, function (error, redirectLocation, renderProps) {
      if (error) {
        reject(error);
        return;
      }
      resolve({
        redirectLocation: redirectLocation,
        renderProps: renderProps
      });
    });
  });
};

// render components
var _renderComponents = function _renderComponents(props, store) {
  return _server2.default.renderToStaticMarkup(_react2.default.createElement(
    _reactRedux.Provider,
    { store: store },
    _react2.default.createElement(_reactRouter.RouterContext, props)
  ));
};

// middleware

exports.default = function (routes, store, render) {
  if (!render) {
    throw new Error('render is required');
  }

  return _regenerator2.default.mark(function _callee(next) {
    var route, redirectLocation, renderProps, fetchData, initialState, html, head;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return matchRoutes({
              routes: routes,
              location: this.originalUrl
            });

          case 3:
            route = _context.sent;
            redirectLocation = route.redirectLocation;
            renderProps = route.renderProps;

            // redirect

            if (!redirectLocation) {
              _context.next = 9;
              break;
            }

            this.redirect(302, redirectLocation.pathname + redirectLocation.search);
            return _context.abrupt('return');

          case 9:
            if (!renderProps) {
              _context.next = 20;
              break;
            }

            // ensure static fetchData run
            fetchData = _getFetchDataPromise(renderProps, store);

            if (!fetchData) {
              this.throw(500, 'please check your static function "fetchData" return is a promise?');
            }

            // run fetchData
            _context.next = 14;
            return fetchData;

          case 14:

            // get state and render component
            initialState = store.getState();
            html = _renderComponents(renderProps, store);

            // title link meta init

            head = _reactHelmet2.default.rewind();

            // render view

            _context.next = 19;
            return render.call(this, {
              __body: html,
              state: initialState,
              head: head
            });

          case 19:
            return _context.abrupt('return');

          case 20:
            _context.next = 25;
            break;

          case 22:
            _context.prev = 22;
            _context.t0 = _context['catch'](0);

            this.throw(500, _context.t0);

          case 25:
            return _context.delegateYield(next, 't1', 26);

          case 26:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 22]]);
  });
};