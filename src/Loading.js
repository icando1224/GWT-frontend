import React, { Component } from 'react';
import { SemipolarSpinner } from 'react-epic-spinners'
export class Loading extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };

    }
    componentDidMount() {
    }
    render() {
        return (
            <div class="d-flex justify-content-center min-vh-100">
                <div class="align-self-center" >
                    <SemipolarSpinner color="black" size="400" />
                </div>
            </div>
        );
    }

}
export default Loading