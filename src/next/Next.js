import './Next.css';
import {Link, useNavigate} from "react-router-dom";

function Next(){

    return (
        <div className="section section_blue section_sm">
            <div className="section__content section__content_sm">
                <div className="next">
                    <p className="next__title title title_sm">What am I up to now?</p>
                    <p className="next__text text">In August 2023 I will be heading back to Ålesund Norway to help staff at the YWAM base. Some of the responsibilities that I will have include: leading a small group, one-on-ones, helping with the outdoor track, and co-leading an outreach team. I am excited to see what God has in store for me over the next year and look forward to helping others grow while in turn growing myself. </p>
                </div>
            </div>
        </div>
    );
}

export default Next;