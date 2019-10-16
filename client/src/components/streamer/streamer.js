import React, { Component } from 'react';
import './streamer.css';
import SearchModal from './searchModal.js'
import twitchPreview from'../../images/preview.jpg';
import twitchLogo from'../../images/logo.png';

class Streamer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.match.params.id,
            data: {},
            followedGames: [],
            showSearchModal: false
        };


    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.match.params.id !== this.props.match.params.id){
            console.log('ids dont match')
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
      }
    
    componentDidMount() {
        console.log('componentDidMount')
        var jwt = this.props.session;

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

    followGame = (type, gameName) => {
        if(!this.props.session || !this.state.data.isFollowed) {
            this.props.modalOpen();
            return;
        }

        fetch('/api/' + type + 'Game/', {
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
            var updatedData = this.state.data;
            updatedData.followedGames = JSON.parse(res)
            this.setState({ data : updatedData});
        }).catch(err => {
            console.log(err)
        })
        
    }
    
    getFollowButton() {

        if(!this.props.session) {
            return (
                <button className="btn btn-primary" onClick={this.props.modalOpen}>Follow</button>
            )
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
                <div className="streamer-recent-games">
                    {recentGames.map(recentGame =>
                        <div className="streamer-recent-game"  key={recentGame['name']} onClick={() => this.followGame('follow', recentGame['name'])}>
                            <p className="streamer-recent-game__name">{recentGame['name']}</p>
                            <img className="streamer-recent-game__logo" src={recentGame['box_art_url']} alt="MISSING" />
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
                    <div className="streamer-game-tag" key={gameName}>
                        <p className="streamer-game-tag__name" key={gameName}>{gameName}</p>
                        <p className="streamer-game-tag__remove" onClick={() => this.followGame('unfollow', gameName)}>&#x2715;</p>
                    </div>
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
            <div className="streamer-container">
                <div className="streamer-info">
                    <div className="streamer-left-container">
                        <div className="streamer-left">
                            <div className="streamer-left-box">
                                {this.state.data['logo'] ? (
                                    <img src={this.state.data['logo']}  width="200" height="200" alt="MISSING" />
                                ) : (
                                    <img src={twitchLogo} width="200" height="200" alt="MISSING" />
                                )}
                            </div>
            
                            <div className="streamer-left-box">
                                <h2 className="streamer-name">{this.state.data['display_name']}</h2>
                                {this.getFollowButton()}
                            </div>
                        </div>
                        
                        <div className="streamer-left">
                            <div className="streamer-left-box streamer-preview">
                                {this.state.data['preview'] ? (
                                    <img src={this.state.data['preview']} className="streamer-logo streamer-preview-img" alt="MISSING" />
                                ) : (
                                    <img src={twitchPreview} className="streamer-logo streamer-preview-img" alt="MISSING" />
                                )}
                            </div>
                            <div>
                                <div className="streamer-personal-info">
                                    <p>{this.state.data['title']}</p>
                                    <p>{this.state.data['viewers']}</p>
                                    <p>{this.state.data['game']}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="streamer-right">
                        <div className="streamer-personal-info">
                            <p>{this.state.data['description']}</p>
                        </div>
                        
                        <h3 className="streamer-followed-games__title">Followed Games</h3>
                        <div className="streamer-followed-games__container">
                            {this.getFollowedGames()}
                        </div>
                    </div>
                </div>
                
                <div className="streamer-recent-games__container">
                    <div className="streamer-search-recent-games_container">
                        <div className="streamer-search-recent-games">
                            <div className="streamer-search-recent-games__title__container">
                                <h3 className="streamer-search-recent-games__title">Games recently played by {this.state.data['display_name']}</h3>
                            </div>
                            <div className="streamer-search-recent-games__btn__container">
                                <button type="button" className="btn btn-primary btn-sm streamer-search-recent-games__btn" onClick={this.modalOpen}>Search for more games</button>
                            </div>
                        </div>
                    </div>
                    {this.getRecentGames()}
                </div>   
            </div>
        )
    }

    modalClose = () => this.setState({ showSearchModal: false });

    modalOpen = () => this.setState({ showSearchModal: true });


    render() {
        return (
            <div className="streamer">
                <SearchModal
                    show={this.state.showSearchModal}
                    onHide={this.modalClose}
                    followGame={this.followGame}
                />
                {this.getBody()}
            </div>
        );
    }

}

// ======================================
export default Streamer;