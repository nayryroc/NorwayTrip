import './Footer.css';
import {Link, useNavigate} from "react-router-dom";
import mountains from "../images/mountains.png";

function Footer(alt){

    return (
        
        <div className={"footer " + ((alt.alt) ? "footer__white" : "")} >
            <img className="footer__mountains" src={mountains}/>
            <div className="footer__content-wrapper">
                <div className="footer__content">
                    <Link to={"/"} className={"footer__logo-wrapper"}><div className="footer__logo"></div></Link>
                    <nav className="footer__nav">
                        <Link to={"/"} className="footer__nav-item title title_sm title_light">Home</Link>
                        <Link to={"/updates"} className="footer__nav-item title title_sm title_light">Updates</Link>
                        <Link to={"/support"} className="footer__nav-item title title_sm title_light">Support</Link>
                        <Link to={"/contact"} className="footer__nav-item title title_sm title_light">Contact</Link>
                    </nav>
                </div>
            </div>
        </div>
    );
}

export default Footer;