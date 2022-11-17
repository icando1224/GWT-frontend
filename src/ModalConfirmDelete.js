import React, { Component } from 'react';
export class ModalConfirmDelete extends Component {
    render() {
        return (
            <div class="modal fade" id="modalConfirmDelete" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="staticBackdropLabel">Usuwanie elementu</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            Czy na pewno chcesz usunąć {this.props.toDelete}?
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-dismiss="modal" onClick={this.props.handleConfirmClick}>Potwierdzam</button>
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Zamknij</button>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}
export default ModalConfirmDelete


