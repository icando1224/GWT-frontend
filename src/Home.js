import React, { Component } from 'react';
import image1 from './img/Java_logo_icon.png';
import image2 from './img/spring.png';
import image3 from './img/JS.png';
import image4 from './img/bootstrap.png';
import image5 from './img/react.png';
import image6 from './img/hibernate.png';
import $ from 'jquery';
import Loading from './Loading.js';

export class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount() {
    }
    render() {
        return (
            <div>
                <br/>
                <h1 class="text-center">Witaj,</h1>
                <h3 class="text-center">Strona powstała w ramach pracy końcowej na studiach podyplomowych<br/> "Technologie Internetowe" realizowanych na Politechnice Wrocławskiej.</h3><br/>
                <h4 class="text-center">Aplikacja ma na celu wsparcie administratora w zarządzaniu sprzętem komputerowym, <br/> który znajduje się w przedsiębiorstwie.</h4><br/>
                <h4 class="text-center">Technologie wykorzystane podczas realizacji aplikacji to:</h4><br/><br/>
                <div id="carousel" class="carousel slide" data-ride="carousel">
                    <div class="carousel-inner">
                        <div class="carousel-item active" >
                            <h4 class="text-center">Java</h4>
                            <img class="d-block  mx-auto" src={image1} alt="Java" />
                        </div>
                        <div class="carousel-item" >
                            <h4 class="text-center">Spring</h4>
                            <img class="d-block  mx-auto" src={image2} alt="Spring" />
                        </div>
                        <div class="carousel-item" >
                            <h4 class="text-center">Hibernate</h4>
                            <img class="d-block  mx-auto" src={image6} alt="Hibernate" />
                        </div>
                        <div class="carousel-item" >
                            <h4 class="text-center">JavaScript</h4>
                            <img class="d-block  mx-auto" src={image3} alt="JavaScript" />
                        </div>
                        <div class="carousel-item" >
                            <h4 class="text-center">Bootstrap</h4>
                            <img class="d-block mx-auto" src={image4} alt="Bootstrap" />
                        </div>
                        <div class="carousel-item" >
                            <h4 class="text-center">React</h4>
                            <img class="d-block mx-auto" src={image5} alt="React" />
                        </div>
                        <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="sr-only">Previous</span>
                        </a>
                        <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="sr-only">Next</span>
                        </a>
                    </div>
                    <br/><br/>
                    <h4 class="text-center">Zapraszam do zapoznania się ze stroną.</h4><br/>
                    <h4 class="text-center">W razie potrzeby kontakt z autorem znajduje się w stopce.</h4>
                    
                </div >
            </div>
        );
    }
}
export default Home