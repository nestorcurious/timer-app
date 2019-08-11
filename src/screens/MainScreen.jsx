import React from 'react';

export const MainScreen = ({props}) => {
    
    const {
        state,
        //dispatch
    } = props

  return (
    <div style = {{
        backgroundColor: state.gamePhase === 'COUNTDOWN'? 'red': 'white',
        width: '100%',
        height: '100%',
        position: 'absolute',
        margin: 0,
        padding: 0
    }}>
      { state.gamePhase === 'READY' ? <h2> Reaction Timer </h2> : null}
      { state.gamePhase === 'READY' ? <h3> Push the START button </h3> : null}
      { state.gamePhase === 'READY' ? <h3> When the screen turns RED push the STOP button </h3> : null}
     
      { state.gamePhase === 'SCORE' ? <h3>Your time is: {state.time} ms </h3> : null}

      { state.connectionType === 'STUB'? <h3>Warning: not USB found</h3> : null}

    </div>
  );
};

