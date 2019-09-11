import React, { Component } from 'react';
import './search.css';

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            autocompleteList: []
        };
    }

    search = () => {
        console.log('search')
        this.props.history.push('/add');
    }

    
    handleChange = event => {
        console.log(event.target.value)
        var a = [...this.state.autocompleteList];
        a.push(event.target.value)
        this.setState({autocompleteList : a});

    }

    getAutocompleteList = () => {

        var autoCompleteList = this.state.autocompleteList;
        return (


            <div id="myInputautocomplete-list" className="autocomplete-items">

                {autoCompleteList.map(listItem =>
                    <div key={listItem} onClick={this.search}>
                        <strong>{listItem}</strong>
                    </div>  
                )}

            </div>
        )
    }

    toggleDropdown() {
        if(this.state.autocompleteList !== []) {
            this.setState({autocompleteList : []});
        } 
    }

    render() {

        return (
            <form autoComplete="off" action="/action_page.php">
                <div className="form-inline my-2 my-lg-0">
                    <div className="form-group has-search autocomplete" onBlur={() => this.toggleDropdown()} onFocus={() => this.toggleDropdown()}>
                        <span className="fa fa-search form-control-feedback"></span>
                        <input id="myInput" type="text" className="form-control searchBar myInput" ref={this.myRef} onChange={this.handleChange} placeholder="Search"/>
                        {this.getAutocompleteList()}
                        
                    </div>
                </div>
            </form> 
        );
    }
}

export default Search;