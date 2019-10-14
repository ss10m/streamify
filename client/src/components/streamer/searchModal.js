import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import Search from '../navbar/search.js'
import './searchModal.css'

class SearchModal extends React.Component {
    render() {
        return (
            <Modal
                {...this.props}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                    Search for games
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="search-container">
                        <Search 
                            {...this.props}
                            category="games"
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default withRouter (SearchModal);