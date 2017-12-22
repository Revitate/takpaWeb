import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Microgear from 'microgear'
import {
    Menu,
    Container,
    Header,
    Image,
    Statistic,
    Button,
    Icon
} from 'semantic-ui-react'
import logo from './logo.svg'

const FixedMenu = () => (
    <Menu size='large' inverted>
        <Container>
            <Menu.Item as='a' header>
                <Image
                    size='mini'
                    src={logo}
                    style={{ marginRight: '1.5em' }}
                />
                Takpa
            </Menu.Item>
        </Container>
    </Menu>
)

class ButtonToggle extends Component {

    render() {
        return (
            <Button size='massive' circular toggle active={this.props.active} onClick={this.props.handleClick}>
                {this.props.active ? 'ON' : 'OFF'}
        </Button>
        )
    }
}

const APPID = 'takpa';
const KEY = 'CTxSrwnrQP0LYVw';
const SECRET = 'vWSm4rTCnnAXJ0L2eHXjmudpD';
const ALIAS = "myhtml";
let microgear = Microgear.create({
    key: KEY,
    secret: SECRET,
    alias: ALIAS
});

class App extends Component {
    state = { width: window.innerWidth, active:false}

    constructor() {
        super();
        this.handleState();
    }

    handleState() {
        microgear.on('connected', function() {
            console.log('connected');
            microgear.subscribe('/data/takpa0');
        });
        microgear.on('message', (function (topic, msg) {
            let data = JSON.parse('{'+String.fromCharCode.apply(null, msg)+'}');
            this.setState({light:data.light,temp:data.temp});
            console.log(data);
        }).bind(this));
        microgear.connect(APPID);
    }
    componentWillMount() {
        window.addEventListener('resize', this.handleWindowSizeChange);
    }

    // make sure to remove the listener
    // when the component is not mounted anymore
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowSizeChange);
    }

    handleWindowSizeChange = () => {
        this.setState({ width: window.innerWidth });
    };

    handleClick = () => {
        if(this.state.active){
            microgear.chat('takpa0','off');
        }else{
            microgear.chat('takpa0','on');
        }
        this.setState({ active: !this.state.active })
    }

    render() {
        const { width, active,light,temp } = this.state;
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start', /* align items in Main Axis */
                alignItems: 'stretch', /* align items in Cross Axis */
                alignContent: 'stretch' /* Extra space in Cross Axis */
            }}>
                <FixedMenu />
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: '1'
                }}>
                    <div>
                        <Container text>
                            <Header as='h1' style={{ fontSize: '4em', fontWeight: 'normal' }}>Device 0</Header>
                        </Container>
                        <Container text style={{ marginTop: '2em' }}>
                            <Statistic.Group size='huge' widths={width < 770 ? 1 : 2}>
                                <Statistic>
                                    <Statistic.Label>
                                        <Icon size='big' name='thermometer half' />
                                        Temperature (°C)
                            </Statistic.Label>
                                    <Statistic.Value>{temp}</Statistic.Value>
                                </Statistic>

                                <Statistic>
                                    <Statistic.Label>
                                        <Icon size='big' name='sun' />
                                        Light Density
                            </Statistic.Label>
                                    <Statistic.Value>{light}</Statistic.Value>
                                </Statistic>
                            </Statistic.Group>
                        </Container>
                        <Container textAlign='center' style={{ marginTop: '3em', marginBottom: '3em' }}>
                            <ButtonToggle active={active} handleClick={this.handleClick} />
                        </Container>
                    </div>
                </div>
            </div>
        )
    }
}


ReactDOM.render(<App />, document.getElementById('root'));

