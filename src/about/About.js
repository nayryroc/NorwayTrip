import './About.css';
import {Link, useNavigate} from "react-router-dom";
import cory from '../images/cory.jpg';

function About(subpage){

    return (
        <div className={"section"}>
            <div className={"section__content section__content_sm"}>
                <div className={"about"}>
                    <img className="about__img" src={cory}/>
                    <div className={"about__content"}>
                        <p className={"about__title title title_sm"}>About Me</p>
                        <p className={"about__text text"}>Hello! My name is Cory. I am from Lancaster County, Pennsylvania and have graduated from Penn State Harrisburg in April 2022 with a degree in Computer Science. In September 2022 I left the US to head to Norway to join a YWAM DTS. This is one of the greatest decisions I have ever made as I was able to build my relationship with God and others. I built this website as a way for you to follow along with my journey. Please stay tuned to see what God is doing in my life over the next months/years. </p>
                    </div>
                </div>
                
            </div>
        </div>
    );
}

export default About;