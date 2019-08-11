import { all } from 'redux-saga/effects';
import { gameSagas } from './gameSagas'
import { serialMiddleWare } from './serialMiddleware'


export default function* rootSaga () {
    yield all ([
        gameSagas(), // saga1 can also yield [ fork(actionOne), fork(actionTwo) ]
        serialMiddleWare()
    ])
}