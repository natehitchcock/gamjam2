import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {levelManager} from './level';
import WeaponLogic from './components/weaponLogic';
import Entity from './entity';

interface IHUDState {
    shouldRenderHUD: boolean;
    currentAmmo: number;
    totalAmmo: number;
    currentHealth: number;
    totalHealth: number;
    soulCount: number;
}

export default class HUD extends React.Component<any, IHUDState> {
    private weaponLogic: WeaponLogic;
    private player: Entity;

    constructor(props) {
        super(props);

        this.state = {
            shouldRenderHUD: false,
            currentAmmo: 3,
            totalAmmo: 6,
            currentHealth: 100,
            totalHealth: 100,
            soulCount: 0,
        };
    }

    onWeaponFire() {
        this.setState({currentAmmo: this.weaponLogic.magazine});
    }

    onStatsUpdated() {
        this.setState({currentHealth: this.player.sharedData.health, soulCount: this.player.sharedData.souls});
    }

    levelLoaded() {
        if(levelManager.currentLevel === undefined) {
            console.error('current level not found');
            return;
        }

        this.player = levelManager.currentLevel.getEntityByLabel('player');

        if(this.player === undefined) {
            console.error('player not found');
            return;
        }

        const playerWeapon = levelManager.currentLevel.getEntityByLabel('wep1');

        if(playerWeapon === undefined) {
            console.error('player weapon not found');
            return;
        }
        const weaponLogic: WeaponLogic = playerWeapon.getComponent('weapon') as WeaponLogic;

        if(weaponLogic === undefined) {
            console.error('weapon logic not found');
            return;
        }

        this.weaponLogic = weaponLogic;

        playerWeapon.on('fired', this.onWeaponFire, this);
        playerWeapon.on('reloaded', this.onWeaponFire, this);

        this.player.on('statsUpdated', this.onStatsUpdated, this);

        this.setState({shouldRenderHUD: levelManager.currentLevel.getEntityByLabel('hud') !== undefined});
    }

    componentDidMount() {
        levelManager.onLevelLoad(this.levelLoaded.bind(this));
    }

    render() {

        if (!this.state.shouldRenderHUD) return <div/>;

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
            'background-image': `url("img/guns/revolver-hud-${this.state.currentAmmo}.png")`,
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
            <div>
                {this.player.sharedData.souls}
            </div>
            <div>
                {this.player.sharedData.health}
            </div>
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
