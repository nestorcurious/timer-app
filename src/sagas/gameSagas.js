import { take, takeLatest, put, delay, all } from 'redux-saga/effects'
import * as selectors from './selectors';
import {select} from 'redux-saga/effects';


function* ledsOff() {
    //yield delay(5000)
    yield put({
        type: 'UPDATE_BUTTON',
        payload: {
            channel: 1,
            state: 'N'
        }
    })  
    yield take('SUCCESS')
    yield put({
        type: 'UPDATE_BUTTON',
        payload: {
            channel: 2,
            state: 'F'
        }
    })  
    yield take('SUCCESS')
    
}

function* startAfterTime() {
    const gamePhase = yield select(selectors.gameState);
    console.log("startAftertime gamePhase:" + gamePhase);

    if (gamePhase === 'SLEEP' ){

        yield put({
            type: 'UPDATE_BUTTON',
            payload: {
                channel: 1,
                state: 'F'
            }
        })  
        yield take('SUCCESS')

        yield delay(5000);

        yield put({
            type: 'UPDATE_BUTTON',
            payload: {
                channel: 2,
                state: 'N'
            }
        })  
        yield take('SUCCESS')

        yield put({ type: 'START_TIMER' });
    }
}

function* restartAfterTime() {

    const gamePhase = yield select(selectors.gameState);
    console.log("restartAftertime gamePhase:" + gamePhase);

    if (gamePhase === 'SCORE' ){
        yield put({
            type: 'UPDATE_BUTTON',
            payload: {
                channel: 2,
                state: 'F'
            }
        })
        yield take('SUCCESS')

        yield delay(5000)
    
        yield put({
            type: 'UPDATE_BUTTON',
            payload: {
                channel: 1,
                state: 'N'
            }
        })
        yield take('SUCCESS')

        yield put({type: 'RESTART_GAME'})
    }
    
}

function* start_game(){
    yield takeLatest('START_GAME', () => startAfterTime());  
}

function* restart_game(){
    yield takeLatest('STOP_GAME', () => restartAfterTime());  
}
  
function* postConnectInit() {
     yield takeLatest('@@CURIOS_BUS_SERIAL_CONNECT',() => ledsOff())
} 

export function* gameSagas() {
    yield all([
      start_game(),
      restart_game(),
      postConnectInit()
    ])
}
  