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


    render() {
        return (
            <div>
                <h1>{this.state.data['name']}</h1>
                <h2>{this.state.data['viewers']}</h2>
                <h2>{this.state.data['game']}</h2>
                <img src={this.state.data['logo']} width="100" height="100" alt="MISSING" />
                <img src={this.state.data['preview']} alt="MISSING" />
                <a className="btn btn-primary" href={"/api/follow/" + this.state.data['name']} role="button">Follow</a>
            </div>
        );
    }

}

// ======================================
export default Streamer;