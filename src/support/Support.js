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
                    
                    
                    <p className="text text_lg" style={{textAlign:"center"}}>More information coming soon!</p>


                    {/* <div className="support">
                        <p className="text support__intro-text">Thank you for your interest in supporting me in my journey. Please keep me in your prayers over the next year. While staffing in Ålesund I will not be receiving a salary so all of my expenses will need to be covered by either my savings or support from others. The leaders at the base recommend that I raise around $500 a month in support to cover housing, food, and other expenses. If you are interested in supporting me financially you can see the options below. Thank you!   </p>
                
                        <h2 className="title title_md">Tax Deductible Support</h2>
                        <p className="text support__text">Checks can be made out in the following way:</p>
                        <p className="text"><strong>To:</strong> Marrietta Community Chapel</p>
                        <p className="text"><strong>Memo:</strong> YWAM Norway</p>
                        <p className="text address-text"><strong>Mail to:</strong> 255 Black Swamp Rd. Bainbridge, PA 17502</p>
                
                        <div className="support__donate">
                            <div className="support__monthly">
                                <h2 className="title title_md">Monthly Support</h2>
                                <p className="text support__desc">If you are interested in supporting monthly click on the following link to learn more.</p>
                                <a href="#" className="button support__button">Learn More</a>
                            </div>
                            
                            <div className="support__once">
                                <h2 className="title title_md">One Time Donation</h2>
                                <p className="text support__desc">If you want to make a one time donation click on the following link.</p>
                                <a href="#" className="button support__button">Learn More</a>
                            </div>  
                        </div> 
                    </div>*/}



                </div>
            </div> 


            <Footer alt={true}/>
        </div>
    );
}

export default Support;