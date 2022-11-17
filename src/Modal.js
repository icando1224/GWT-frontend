import React, { Component } from 'react';
export class Modal extends Component {
    render() {
        return (
            <div class="modal fade" id={this.props.id} data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="staticBackdropLabel">{this.props.header}</h5>
                            <button type="button" class="close" data-dismiss="modal" onClick={this.props.onCloseClicked} aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            {this.props.body}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal" onClick={this.props.onCloseClicked}>Zamknij</button>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}
export default Modal


