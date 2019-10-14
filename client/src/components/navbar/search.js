import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import ReactDOM from 'react-dom';
import './search.css';

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            autocompleteList: [],
            inputField: '',
        };

        this.getNewSuggestions.bind(this);
    }

    
    handleChange = event => {
        var requestName = event.target.value.trim();
        this.setState({inputField : event.target.value});
        setTimeout(function() {
            this.getNewSuggestions(requestName);
        }.bind(this), 500)
    }

    getNewSuggestions = (requestName) => {
        if(requestName !== this.state.inputField || requestName.length === 0) {
            return;
        }
        
        console.log('fetching' + requestName)
        fetch("/search/" + this.props.category + '/'  + requestName)
            .then(res => res.json())
            .then(function(res) {
                if(res.error) { throw res }
                return res;
            })
            .then(data => {
                this.setState({ autocompleteList : data })
            }).catch(err => {
                console.log(err)
            });
    }

    clearAutoInput = () => {
        this.setState({autocompleteList : [], inputField : ''});
    }

    getAutocompleteList = () => {
        var autoCompleteList = this.state.autocompleteList;
        var displayStyle = "none";
        if(autoCompleteList.length > 0) displayStyle = "block";
        switch(this.props.category){
            case('channels'):
                return (
                    <div className="cus-search__results" style={{display: displayStyle}} >
                        {autoCompleteList.map(listItem =>
                            <Link className="cus-search__result" 
                                  style={{ textDecoration: 'none', color: 'white' }} 
                                  to={"/streamer/" + listItem.name} 
                                  key={listItem.name}
                                  onClick={() => {this.props.minimizeNav(); this.clearAutoInput()}}>
                                <div key={listItem.name}>
                                    <img className="cus-search__result__channel-logo" src={listItem.logo} width="40" height="40" alt="MISSING" />
                                    {listItem.display_name}
                                </div> 
                            </Link>
                        )}
                    </div>
                )
            case('games'):
                return (
                    <div className="cus-search__results" style={{display: displayStyle}}>
                        {autoCompleteList.map(listItem =>
                            <div className="cus-search__result" key={listItem.name}>
                                <div className="cus-search__result__game-logo">
                                    <img src={listItem.box.small} width="36" height="50" alt="MISSING" /> 
                                </div>
                                
                                <div className="cus-search__result__game-name">
                                    <div>{listItem.name}</div>
                                </div>
                                <div className="cus-search__result__game-follow-btn">
                                    <button type="button" onClick={() => this.props.followGame('follow', listItem.name)} className="btn btn-primary btn-sm followGameButton">Follow</button>
                                </div>
                                
                            </div> 
                        )}
                    </div>
                )
            default:
        }

    }

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, true);
    }
    
    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true);
    }
    
    handleClickOutside = event => {
        const domNode = ReactDOM.findDOMNode(this);
        if (!domNode || !domNode.contains(event.target)) {
            this.clearAutoInput();
        }
    }

    render() {
        
        return (
            <div className="form-inline my-2 my-lg-0">
                <div className="form-group has-search cus-search" >
                    <span className="fa fa-search form-control-feedback"></span>
                    <input autoComplete="off" spellcheck="false" type="text" className="form-control cus-search__search-bar" ref={this.myRef} onChange={this.handleChange} placeholder="Search" value={this.state.inputField}/>
                    {this.getAutocompleteList()}
                </div>
            </div>
        );
    }
}

export default withRouter (Search);