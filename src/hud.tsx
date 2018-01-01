import * as React from 'react';
import * as ReactDOM from 'react-dom';

export default class HUD extends React.Component<any, any> {
    render() {
        const healthStyle: React.CSSProperties = {
            'width': '100%',
            'height': '100%',
            'background-image': 'url("img/characters/playable1/hudview-100.png")',
            'position': 'absolute',
        };

        const healthBGStyle: React.CSSProperties = {
            'width': '100%',
            'height': '100%',
            'background-color': 'black',
            'position': 'absolute',
            'opacity': 0.6,
            'border-radius': '20px',
        };

        const healthContainerStyle: React.CSSProperties = {
            width: '128px',
            height: '128px',
            position: 'absolute',
            left:  '40px',
            bottom:  '10px',
        };

        const ammoStyle: React.CSSProperties = {
            'width': '100%',
            'height': '100%',
            'background-image': 'url("img/guns/revolver-hud-6.png")',
            'position': 'absolute',
        };

        const ammoBGStyle: React.CSSProperties = {
            'width': '100%',
            'height': '100%',
            'background-color': 'black',
            'opacity': 0.6,
            'border-radius': '20px',
            'position': 'absolute',
        };

        const ammoContainerStyle: React.CSSProperties = {
            width: '128px',
            height: '128px',
            position: 'absolute',
            right:  '40px',
            bottom:  '10px',
        };

        return <div>
            <h1> This is the HUD </h1>
            <div style={healthContainerStyle}>
                <div style={healthBGStyle}></div>
                <div style={healthStyle}></div>
            </div>
            <div style={ammoContainerStyle}>
                <div style={ammoBGStyle}> </div>
                <div style={ammoStyle}> </div>
            </div>
        </div>;
    }
}
