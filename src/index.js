// import 'pixi';
// import 'p2';
// import 'phaser';
// import 'phaser-ce';

import React from 'react';
import ReactDOM from 'react-dom';
import App from "./App";


export var initGame = (cFactor) => {
    // console.log('cFactor ' + JSON.stringify(cFactor));
    // console.log('cFactor ' + cFactor.state);
    console.log(cFactor);
    ReactDOM.render(<App cFactor={cFactor}/>, document.getElementById(cFactor.canvas));
}

window.MyNamespace = initGame;
// window.MyNamespace(undefined);
//// let a = new Game();
// window.MyNamespace();
