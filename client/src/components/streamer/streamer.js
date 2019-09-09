import React, { Component } from 'react';
import './streamer.css';

class Streamer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.match.params.id,
            data: {},
            followedGames: []
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
            .then(function(res) {
                if(res.error) { throw res }
                return res;
            })
            .then(data => {
                data.followedGames = JSON.parse(data.followedGames);
                this.setState({ data })
            }).catch(err => {
                console.log(err)
            });
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
        .then(function(res) {
            if(res.error) { throw res }
            return res;
        })
        .then(data => { 
            data.followedGames = JSON.parse(data.followedGames);
            this.setState({ data })
        }).catch(err => {
            console.log(err)
        });
    }

    followStreamer = event => {
        event.preventDefault();
        const jwt = this.props.session;
        var apiCall = '/api/follow';
        if(this.state.data.isFollowed) {
            apiCall = '/api/unfollow';
        }

        fetch(apiCall, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: JSON.stringify(jwt)
            },
            body: JSON.stringify({ name: this.state.data['name'] }),
        }).then(res => res.json())
        .then(function(res) {
            console.log(res)
            if(res.error) { throw res }
            return res;
        })
        .then(res => {
            if(res.code === "200") {
                var followed = this.state.data;
                followed.isFollowed = !followed.isFollowed;
                this.setState({ data : followed})
            }
        }).catch(err => {
            console.log(err)
            this.props.history.push('/streamers');
        })
    }

    toggleGameFollow = gameName => {
        if(!this.props.session || !this.state.data.isFollowed) {
            this.props.modalOpen();
            return;
        }
        var unique = !this.state.data.followedGames.includes(gameName)


        var requestUrl;
        if(unique) {
            requestUrl = 'followGame';
        } else {
            requestUrl = 'unfollowGame';
        }

        fetch('/api/' + requestUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: JSON.stringify(this.props.session)
            },
            body: JSON.stringify({ name: this.state.data['name'],
                                   gameName: gameName})
        }).then(res => res.json())
        .then(function(res) {
            if(res.error) { throw res }
            return res; 
        })
        .then(res => {
            var updatedData = this.state.data
            updatedData.followedGames = JSON.parse(res)
            this.setState({ data : updatedData});
        }).catch(err => {
            console.log(err)
        })
        
    }
    
    getFollowButton() {

        if(!this.props.session) {
            return <button className="btn btn-primary" onClick={this.props.modalOpen}>Follow</button>
        }

        if(this.state.data.isFollowed) {
            return (
                <button className="btn btn-primary" onClick={this.followStreamer}>Unfollow</button>
            )
        } else {
            return (
                <button className="btn btn-primary" onClick={this.followStreamer}>Follow</button>
            )
        }
    }

    getRecentGames() {
        var recentGames = []
        var recent =  this.state.data['recentGames'];

        if(recent) {
            recent = JSON.parse(this.state.data['recentGames']);
            recent.forEach(recentGame => {
                recentGames.push(recentGame)
            })
        }

        return (
            <div>
                <div className="row">
                    {recentGames.map(recentGame =>
                        <div className="block"  key={recentGame['name']} onClick={() => this.toggleGameFollow(recentGame['name'])}>
                            {recentGame['name']}
                            <img src={recentGame['box_art_url']} width="150" height="220"  alt="MISSING" />
                        </div>
                    )}
                </div>
            </div>
        )
    }

    getFollowedGames() {

        if(!this.state.data.followedGames) {
            return;
        }

        return (
            <div>
                {this.state.data.followedGames.map((gameName) => 
                    <p key={gameName}>{gameName}</p>
                )}
            </div>
        )
    }

    getBody() {
        if(this.state.data["error"]) {
            return (
                <p>{this.state.data["error"]}</p>
            )
        }

        return (
            <div>
                <div className="infoRow">
                    <div className="boxLeft">
                        <div className="flex-container">
                            <div className="fixed">
                                <img src={this.state.data['logo']}  width="200" height="200" alt="MISSING" />
                            </div>
                            
                            <div className="flex-item">
                                <h1>{this.state.data['display_name']}</h1>
                            </div>
                            
                        </div>

                        <div className="card">
                            <p>{this.state.data['title']}</p>
                            <p>{this.state.data['viewers']}</p>
                            <p>{this.state.data['game']}</p>
                            {this.getFollowButton()}
                        </div>
                        


                        <div className="card">
                            <img src={this.state.data['preview']} width="450" height="250" className="roundedImg" alt="MISSING" />
                        </div>
                    </div>

                    <div className="boxRight">
                        <div className="card">
                            <p>{this.state.data['description']}</p>
                        </div>
                        
                        <div className="card innerbox">
                            {this.getFollowedGames()}
                        </div>
                    </div>


                </div>
                
                <div>
                    {this.getRecentGames()}
                </div>   

            </div>
        )
    }


    render() {

        return (
            <div>
                {this.getBody()}
            </div>
        );
    }

}

// ======================================
export default Streamer;