import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import ReactDOM from 'react-dom';
import './search.css';

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            autocompleteList: [],
            inputField : ''
        };
    }
    
    handleChange = event => {
        var requestName = event.target.value.trim();
        this.setState({inputField : event.target.value})
        if(requestName.length > 0) {
            fetch("/search/" + requestName)
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
    }

    clearAutoInput = () => {
        this.setState({autocompleteList : [], inputField : ''});
    }

    getAutocompleteList = () => {
        var autoCompleteList = this.state.autocompleteList;
        return (
            <div className="autocomplete-items">
                {autoCompleteList.map(listItem =>
                    <Link to={"/streamer/" + listItem.name} key={listItem.name}>
                        <div key={listItem.name} onClick={this.clearAutoInput}>
                            <img className="seachLogo" src={listItem.logo} width="40" height="40" alt="MISSING" />
                            {listItem.display_name}
                        </div> 
                    </Link>
                )}
            </div>
        )
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
            <form autoComplete="off" action="/action_page.php">
                <div className="form-inline my-2 my-lg-0">
                    <div className="form-group has-search autocomplete">
                        <span className="fa fa-search form-control-feedback"></span>
                        <input id="myInput" type="text" className="form-control searchBar myInput" ref={this.myRef} onChange={this.handleChange} placeholder="Search" value={this.state.inputField}/>
                        {this.getAutocompleteList()}
                        
                    </div>
                </div>
            </form> 
        );
    }
}

export default withRouter (Search);