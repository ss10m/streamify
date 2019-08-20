import React, { Component } from 'react';
import defaultPreview from '../../images/preview.jpg'

class Streamer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.match.params.id,
            data: {}
        };


    }

    static getDerivedStateFromProps(nextProps, prevState) {
        var next = nextProps.match.params.id;
        var previous = prevState.name;
        if(next !== previous) {
            return { name: next};
        } 
        else {
            return null;
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.match.params.id !== this.state.name){
            const jwt = this.props.session;
            fetch("/api/streamer/" + this.state.name, {
                headers: {
                    Authorization: JSON.stringify(jwt)
                }
            })
            .then(res => res.json())
            .then(data => this.setState({ data }));
        }
      }
    
    componentDidMount() {
        const jwt = this.props.session;
        fetch("/api/streamer/" + this.props.match.params.id, {
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
            this.props.history.push('/streamers');
        }).catch(function(err) {
            console.info(err);
        });
    }

    getFollowButton() {
        // check if logged in

        if(!this.props.session) {
            return <button className="btn btn-primary" onClick={this.props.modalOpen}>Follow</button>
        }

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

    getRecentGames() {
        var recentGames = []
        var recent =  this.state.data['recentGames'];
        for(var a in recent) {
            recentGames.push(recent[a])
        }
        recentGames.map(streamer =>
            console.log(streamer)
        )

        return (
            <ul>
                {recentGames.map(recentGame =>
                    <li>
                        <p>{recentGame}</p>
                    </li>
                )}
            </ul>
        )
    }

    render() {
        


   

        return (
            <div>
                <div>
                    <div>
                        <img src={this.state.data['logo']} width="200" height="200" alt="MISSING" />
                        <img src={this.state.data['profile_banner']} width="700" height="200" alt="MISSING" />
                    </div>
                    <h1>{this.state.data['name']}</h1>
                    <h2>{this.state.data['viewers']}</h2>
                    <h2>{this.state.data['game']}</h2>
                    {this.getFollowButton()}
                    <div>
                        {this.state.data['preview'] ? (
                            <img src={this.state.data['preview']} alt="MISSING" />
                        ) : (
                            <img src={defaultPreview} alt="MISSING" />
                        )

                        }
                        
                    </div>
                    {this.getRecentGames()}
                </div>
            </div>
        );
    }

}

// ======================================
export default Streamer;