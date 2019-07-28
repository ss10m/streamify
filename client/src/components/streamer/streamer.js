import React, { Component } from 'react';

class Streamer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.getStreamerName(),
            data: {},
            modalShow: false
        };


    }

    getStreamerName() {
        var lastIndex = window.location.href.lastIndexOf('/');
        return window.location.href.substring(lastIndex + 1);
    }

    componentDidMount() {
        const jwt = this.props.session;
        fetch("/api/streamer/"+ this.state.name, {
            headers: {
                Authorization: JSON.stringify(jwt)
            }
        })
        .then(res => res.json())
        .then(data => this.setState({ data }));
    }

    handleSubmit = event => {
        event.preventDefault();
        const jwt = this.props.session;
        var apiCall = '/api/follow';
        if(this.state.data.isFollowed === 'true') {
            apiCall = '/api/unfollow';
        }


        fetch(apiCall, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: JSON.stringify(jwt)
            },
            body: JSON.stringify({ name: this.state.data['name'] }),
        }).then(response => {
            //var url = response['url'].replace('http://localhost:3000', '');
            this.props.history.push('/streamers');
            
        }).catch(function(err) {
            console.info(err);
        });
    }

    getFollowButton() {
        console.log(this.state.data.isFollowed)
        if(this.state.data.isFollowed === 'true') {
            return (
                <button className="btn btn-primary" onClick={this.handleSubmit}>Unfollow</button>
            )
        } else {
            return (
                <button className="btn btn-primary" onClick={this.handleSubmit}>Follow</button>
            )
        }
    }


    render() {
        return (
            <div>
                <div>

                    <img src={this.state.data['logo']} width="200" height="200" alt="MISSING" />
                    <h1>{this.state.data['name']}</h1>
                    <h2>{this.state.data['viewers']}</h2>
                    <h2>{this.state.data['game']}</h2>
                    <img src={this.state.data['preview']} width="500" height="200" alt="MISSING" />
                    {this.getFollowButton()}
                </div>
                <div>
                    <button onClick={this.props.modalOpen}>Log in</button>
                </div>
            </div>
        );
    }

}

// ======================================
export default Streamer;