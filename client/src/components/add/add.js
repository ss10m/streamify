import React, { Component } from 'react';
import 'font-awesome/css/font-awesome.min.css';

class Add extends Component {
    state = {
        response: '',
        post: '',
        responseToPost: '',
        apiResponse: "",
    };

    handleSubmit = async e => {
        e.preventDefault();
        const response = await fetch('/api/world', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ post: this.state.post }),
        });
        const body = await response.text();
        this.setState({ responseToPost: body });
    };

    render() {
        return (
            <div>
                <p>{this.state.response}</p>
                <form onSubmit={this.handleSubmit}>
                    <p>
                        <strong>Post to Server:</strong>
                    </p>
                    <input
                        type="text"
                        value={this.state.post}
                        onChange={e => this.setState({ post: e.target.value })}
                    />
                    <button type="submit">Submit</button>
                </form>












                <p>{this.state.responseToPost}</p>
            </div>
        )
    }


}

export default Add;