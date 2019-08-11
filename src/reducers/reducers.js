//Reducer
export const reducer = (state = {}, action) => {
    
  if (action.type === '@@CURIOS_BUS_SERIAL_CONNECT'){
    return{
      ...state,
      isConnected: true,
      gamePhase: 'READY'
      //connectionType: action.payload.connectionType
    }
  }

  if (!state.isConnected ) return state

  switch(action.type){ 

    case 'START_GAME':
      if (state.gamePhase !== 'READY' ) return state

      return {
          ...state, 
          gamePhase: 'SLEEP'
        }
      
    case 'START_TIMER':
      if (state.gamePhase !== 'SLEEP' ) return state

      return{
        ...state,
        time: +new Date(),
        gamePhase: 'COUNTDOWN'
      }

    case 'STOP_GAME':
      if (state.gamePhase !== 'COUNTDOWN') return state;
      
      return {
          ...state,
          time: +new Date() - state.time,
          gamePhase: 'SCORE'
      }
        
    case 'RESTART_GAME':
      if (state.gamePhase !== 'SCORE') return state;
      
      return {
        isConnected: state.isConnected,
        gamePhase: 'READY'
      }

    case 'UPDATE_BUTTON':
      return state
    
    case 'SUCCESS':
      return state

    case 'FAILURE':
      return state

    default:
      return state
  }
}