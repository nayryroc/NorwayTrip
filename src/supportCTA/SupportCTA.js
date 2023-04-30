import './SupportCTA.css';
import {Link, useNavigate} from "react-router-dom";

function SupportCTA(size){

    return (
        <div className={"section section_blue " + ((size.size == "sm") ? "section_sm" : "")}>
            <div className="section__content section__content_sm">
                <div className="supportCTA">
                    <div className="supportCTA__content">
                        <p className="supportCTA__title title title_sm">Want to support me on my journey?</p>
                        <Link to={"/support"} className={"supportCTA__link button button_alt"}>Learn More</Link>
                    </div>
                    <div className="supportCTA__image"></div>
                </div>
            </div>
        </div>
    );
}

export default SupportCTA;