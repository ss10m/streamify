import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import Search from '../navbar/search.js'

class SearchModal extends React.Component {

    getGames() {
        return (
            <p>test</p>
        )
    }


    render() {
        return (
            <Modal
                {...this.props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"

                
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                    Search for games
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Search 
                        {...this.props}
                        category="games"
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }

}

export default withRouter (SearchModal);