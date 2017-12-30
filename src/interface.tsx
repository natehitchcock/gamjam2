import * as React from 'react';
import * as ReactDOM from 'react-dom';

class HUD extends React.Component<any, any> {
    render() {
        return <h1> This is the HUD </h1>;
    }
}

interface IAppState {
    HUDActive: boolean;
}

class App extends React.Component<any, IAppState> {
    constructor(props) {
        super(props);
        this.state =  {
            HUDActive: true,
        };
    }

    render() {
        return this.state.HUDActive ? <HUD/> : <div/>;
    }
}

const container = document.createElement('div');
container.setAttribute("id", "app-wrapper");
document.body.appendChild(container);

ReactDOM.render(<App/>, container);
