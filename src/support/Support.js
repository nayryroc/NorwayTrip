import './Support.css';
import {Link, useNavigate} from "react-router-dom";
import Header from '../header/Header';
import Footer from '../footer/Footer';
import bg from '../images/mountains2.jpg';

function Support(size){

    return (
        <div className="page">
            <Header subpage={true} title={"Support"} bg={bg} filter={true}/>

            <div className="section">
                <div className="section__content section__content_sm">


                    <div className="support">
                        <p className="text support__intro-text">Thank you for your interest in supporting me in my journey. While staffing in Ålesund I will not be receiving a salary so all of my expenses will need to be covered by either my savings or support from others. The leaders at the base recommend that I raise around $550 - $800 a month in support to cover housing, food, and other expenses. If you are interested in supporting me financially you can see the options below. Most importantly, please keep me in your prayers as I go on this new adventure. Thank you!   </p>
                
                        <h2 className="title title_md">Tax Deductible Support</h2>
                        <p className="text support__text">Checks can be made out in the following way:</p>
                        <p className="text"><strong>To:</strong> Marrietta Community Chapel</p>
                        <p className="text"><strong>Memo:</strong> YWAM Norway</p>
                        <p className="text address-text"><strong>Mail to:</strong> 1125 River Rd, Marietta PA 17547</p>
                
                        <div className="support__donate">
                            <div className="support__monthly">
                                <h2 className="title title_md">Monthly Support</h2>
                                <p className="text support__desc">If you are interested in supporting monthly click on the following link to donate.</p>
                                <a target="_blank" href="https://donorbox.org/cory-s-ywam-trip?default_interval=m" className="button support__button custom-dbox-popup">Donate</a>
                            </div>
                            
                            <div className="support__once">
                                <h2 className="title title_md">One Time Donation</h2>
                                <p className="text support__desc">If you want to make a one time donation click on the following link.</p>
                                <a target="_blank" href="https://buy.stripe.com/3cscNl1jD1qraswdQQ" className="button support__button custom-dbox-popup">Donate</a>
                            </div>  
                        </div> 
                    </div>



                </div>
            </div> 


            <Footer alt={true}/>
        </div>
    );
}

export default Support;