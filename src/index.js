import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { reducer } from './reducers/reducers';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import rootSaga from './sagas/saga';

const sagaMiddleware = createSagaMiddleware();

export const store = createStore(
    reducer, 
    applyMiddleware(sagaMiddleware, logger)
);
    

sagaMiddleware.run(rootSaga);

store.dispatch({type: '@@CURIOS_INIT'}) // this is the desfault action which tells the serial to attempt to connect

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
