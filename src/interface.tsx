import * as React from 'react';
import * as ReactDOM from 'react-dom';

import HUD from './hud';

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
container.setAttribute("style", "width: 100%; height: 100%");
document.body.appendChild(container);

ReactDOM.render(<App/>, container);
