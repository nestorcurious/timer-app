
/*

export const serialConnection  = () => {
   
    const serialEmitter = new Emitter();
   
    const connect = () => {
        let serial;
        try{
                
            serial = new BSSerialPort(2);
    
            serial.SetBaudRate(115200);
            serial.SetDataBits(8);
            serial.SetStopBits(1);
            serial.SetParity("none");
            serial.SetEcho(true);
            serial.SetGenerateByteEvent(true);
            serial.SetGenerateLineEvent(true);
            
            serialEmitter.emit('connect')


        }
        catch(err){
    
            serialEmitter.emit('connect')
        }

        return {
            listen,
            publish
        }
    }
    
    const message = () => {
        serialEmitter.emit('message')
    }
    
    
    const publish = () => {
        serialEmitter.emit('publish')
    }

    return {
        connect
    }

}

*/