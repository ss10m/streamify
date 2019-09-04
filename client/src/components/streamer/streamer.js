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
            this.setState({ followedGames: [] });
            const jwt = this.props.session;
            fetch("/api/streamer/" + this.state.name, {
                headers: {
                    Authorization: JSON.stringify(jwt)
                }
            })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                this.setState({ data })
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

    toggleGameFollow = gameName => {
        if(!this.props.session) {
            this.props.modalOpen();
            return;
        }
        var unique = !this.state.followedGames.includes(gameName)

        var newArray = [];
        if(unique) {
            newArray = [...this.state.followedGames, gameName]
        } else {
            newArray = [...this.state.followedGames]
            var index = newArray.indexOf(gameName)
            newArray.splice(index, 1);
        }
        this.setState({ followedGames: newArray});

        fetch('/api/followGame', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: JSON.stringify(this.props.session)
            },
            body: JSON.stringify({ name: this.state.data['name'],
                                   gameName: gameName})
        }).then(res => res.json())
          .then(res => console.log(res))
        
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

    getBody() {
        if(this.state.data["error"]) {
            return (
                <p>{this.state.data["error"]}</p>
            )
        }


        const followedGames = this.state.followedGames.map((name) => {
            return (
                <p>
                    {name}
                </p>
            )
        })
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
                            
                            <p>{this.state.data['title']}</p>
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
                            {followedGames}
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