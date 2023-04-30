import './Header.css';
import {Link, useNavigate} from "react-router-dom";
import { useState } from 'react';

function Header({subpage, title, bg, filter}){
    const [open, setOpen] = useState(false);

    function openMenu(){
        setOpen(true);
        document.getElementById("root").classList.add("menu-open");
    }

    function closeMenu(){
        setOpen(false);
        document.getElementById("root").classList.remove("menu-open");
    }

    return (
        <div className={"header " + ((subpage) ? "header_subpage " : "") + ((filter) ? "header_filter" : "")} style={{backgroundImage:"url(" + bg + ")"}}>
            <div className={"header-overlay " + ((open) ? "visible" : "")}>
                <button className="header-overlay__x" onClick={()=>{closeMenu()}}></button>
                <div className="header-overlay__logo-wrapper">
                    <Link to={"/"}><div className={"header-overlay__logo"} role={"img"} aria-label={"CS initials logo"}/></Link>
                </div>
                <nav className={"header-overlay-nav"}>
                    <Link to={"/"} className={"header-overlay-nav__item title title_md"}>Home</Link>
                    <Link to={"/updates"} className={"header-overlay-nav__item title title_md"}>Updates</Link>
                    <Link to={"/support"} className={"header-overlay-nav__item title title_md"}>Support</Link>
                    <Link to={"/contact"} className={"header-overlay-nav__item title title_md"}>Contact</Link>
                </nav>
            </div>
            <div className={"header__content"}>
                <Link to={"/"}><div className={"header__logo"} role={"img"} aria-label={"CS initials logo"}/></Link>

                <nav className={"nav"}>
                    <Link to={"/"} className={"nav__item title title_sm"}>Home</Link>
                    <Link to={"/updates"} className={"nav__item title title_sm"}>Updates</Link>
                    <Link to={"/support"} className={"nav__item title title_sm"}>Support</Link>
                    <Link to={"/contact"} className={"nav__item title title_sm"}>Contact</Link>
                </nav>

                <button className={"menu"}  onClick={()=>{openMenu()}}></button>
            </div>
            <div className={"header__text"}>
                <h1 className={"header__title title"}>{title}</h1>
            </div>

        </div>
    );
}

export default Header;