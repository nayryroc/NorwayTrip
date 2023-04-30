import './Updates.css';
import {Link, useNavigate} from "react-router-dom";
import Feed from '../feed/Feed';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import bg from '../images/png-bg.jpg';

function Updates(){

    return (
        <div className={"page"}>
            <Header subpage={true} title={"Updates"} bg={bg} filter={true}/>
            <Feed/>
            <Footer alt={true}/>
        </div>
    );
}

export default Updates;