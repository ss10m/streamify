import React, { Component } from 'react';
import defaultPreview from '../../images/preview.jpg'
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

    toggleGameFollow = gameName => {
        var newArray = [...this.state.followedGames, gameName]
        this.setState({ followedGames: newArray});
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
            recent.map(recentGame => {
                recentGames.push(recentGame)
            })
        }

        return (
            <div>
                <div class="row">
                    {recentGames.map(recentGame =>
                        <div className="block"  onClick={() => this.toggleGameFollow(recentGame['name'])}>
                            {recentGame['name']}
                            <img src={recentGame['box_art_url']} alt="MISSING" />
                        </div>
                    )}
                </div>
            </div>
        )
    }


    render() {

        const followedGames = this.state.followedGames.map((name) => {
            return (
                <li>
                    {name}
                </li>
            )
        })

        return (
            <div>
                <div>
                    <div>
                        <img src={this.state.data['logo']} width="200" height="200" alt="MISSING" />
                        <h1>{this.state.data['display_name']}</h1>
                        <p>{this.state.data['description']}</p>

                    </div>
                    <p>{this.state.data['title']}</p>
                    <h2>{this.state.data['viewers']}</h2>
                    <h2>{this.state.data['game']}</h2>
                    {this.getFollowButton()}
                    <ol>{followedGames}</ol>
                    <div>
                        <img src={this.state.data['preview']} width="700" height="400" alt="MISSING" />
                    </div>
                    <div>
                        {this.getRecentGames()}
                    </div>
                </div>
            </div>
        );
    }

}

// ======================================
export default Streamer;