import React, { Component } from 'react';

class Streamer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.match.params.streamerid,
            data: {}
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
            // HTTP 301 response
            window.location.href = response['url'];
            
        })
        .catch(function(err) {
            console.info('error');
        });
    }


    render() {
        return (
            <div>
                <h1>{this.state.data['name']}</h1>
                <h2>{this.state.data['viewers']}</h2>
                <h2>{this.state.data['game']}</h2>
                <img src={this.state.data['logo']} width="100" height="100" alt="MISSING" />
                <img src={this.state.data['preview']} alt="MISSING" />
                <form onSubmit={this.handleSubmit}>
                    <button className="btn btn-primary" type="submit">Follow</button>
                </form>
            </div>
        );
    }

}

// ======================================
export default Streamer;