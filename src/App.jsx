import React from "react";

export default class App extends React.Component {


    componentDidMount() {
        const script = document.createElement("script");

        script.src = "https://code.createjs.com/1.0.0/createjs.min.js";
        script.async = true;
        script.onload = () => {
            const Main = require("./assets/js/main.js");
            Main.init(this.props.cFactor.callback);
        }

        document.body.appendChild(script);
    }

    render() {
        return (
            <canvas id={'minigame-canvas'} width={430} height={750} style={{margin: 'auto', display: 'block'}}/>
        )
    }
}
