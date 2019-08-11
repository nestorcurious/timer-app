import BSSerialPort from 'BSSerialPort'
import { take, takeEvery, takeLatest, put, delay, all, call} from 'redux-saga/effects'
import {store} from '../index'


// '2' is the first externally connected USB  port on Cheetah
var serial = new BSSerialPort(2);

serial.SetBaudRate(115200);
serial.SetDataBits(8);
serial.SetStopBits(1);
serial.SetParity("none");
serial.SetEcho(true);

serial.SetGenerateByteEvent(true);
serial.SetGenerateLineEvent(true);

function* checkConnection() {
    yield put({type: '@@CURIOS_BUS_SERIAL_CONNECT'})
}

function* sendSerial(action) {
        
    let ch = action.payload.channel;
    let st = action.payload.state;
    let message = "<" + st + "," + ch + ">"
    console.log("message: "+ message)
    
    yield serial.SendBytes(message);
}


function* connectInit() {
    yield takeLatest('@@CURIOS_INIT',() => checkConnection())
} 

function* updateButton() {
    yield takeEvery('UPDATE_BUTTON', sendSerial)
} 
        
serial.onserialline = function(e){
    const action = JSON.parse(e.sdata);
    
    //Use redux event channel
    store.dispatch(action);
       
    console.log('### onserialline: ' + e.sdata); 

}

export function* serialMiddleWare() {
    yield all([
      updateButton(),
      connectInit()
    ])
}
  


