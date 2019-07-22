import React, { Component } from 'react';
import LogInModal from '../navbar/loginmodal.js';

class Streamer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.match.params.streamerid,
            data: {},
            modalShow: false
        };


    }
    componentDidMount() {
        fetch("/api/streamer/"+ this.state.name)
            .then(res => res.json())
            .then(data => this.setState({ data }));
    }

    handleSubmit = event => {
        event.preventDefault();
        fetch('/api/follow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: this.state.data['name'] }),
        }).then(response => {
            //var url = response['url'].replace('http://localhost:3000', '');
            this.props.history.push('/streamers');
            
        }).catch(function(err) {
            console.info(err);
        });
    }


    render() {

        let modalClose = () => this.setState({ modalShow: false });
        return (
            <div>
                <div>
                    <img src={this.state.data['logo']} width="200" height="200" alt="MISSING" />
                    <h1>{this.state.data['name']}</h1>
                    <h2>{this.state.data['viewers']}</h2>
                    <h2>{this.state.data['game']}</h2>
                    <img src={this.state.data['preview']} width="1440" height="480" alt="MISSING" />
                    <form onSubmit={this.handleSubmit}>
                        <button className="btn btn-primary" type="submit">Follow</button>
                    </form>
                </div>
                <div>
                    <LogInModal
                        show={this.state.modalShow}
                        onHide={modalClose}
                    />
                    <button onClick={() => this.setState({ modalShow: true })}>Log in</button>
                </div>
            </div>
        );
    }

}

// ======================================
export default Streamer;