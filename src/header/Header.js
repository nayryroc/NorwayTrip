import './Header.css';
import {Link, useNavigate} from "react-router-dom";
import { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import isExpired from '../Expired';
import { getAuth, signOut } from "firebase/auth";

function Header({subpage, title, bg, filter, post}){
    const [open, setOpen] = useState(false);
    const [admin, setAdmin] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])


    firebase.auth().onAuthStateChanged(user => {
        if (user && !isExpired(user)) {
            if(!admin)setAdmin(true);
        }else{
            if(admin)setAdmin(false);
        }
    })


    function openMenu(){
        setOpen(true);
        document.getElementById("root").classList.add("menu-open");
    }

    function closeMenu(){
        setOpen(false);
        document.getElementById("root").classList.remove("menu-open");
    }

    function logout(){
        const auth = getAuth();
        signOut(auth).then(() => {
        // Sign-out successful.
        }).catch((error) => {
        // An error happened.
        });
    }

    return (
        <div className={"header " + ((subpage) ? "header_subpage " : "")} style={{backgroundImage:"url(" + bg + ")"}}>
            <div className={"header-overlay " + ((open) ? "visible" : "")}>
                <button className="header-overlay__x" onClick={()=>{closeMenu()}}></button>
                <div className="header-overlay__logo-wrapper">
                    <Link to={"/"}><div className={"header-overlay__logo"} role={"img"} aria-label={"CS initials logo"} onClick={closeMenu}/></Link>
                </div>
                <nav className={"header-overlay-nav"}>
                    <Link to={"/"} className={"header-overlay-nav__item title title_md"} onClick={closeMenu}>Home</Link>
                    <Link to={"/updates"} className={"header-overlay-nav__item title title_md"} onClick={closeMenu}>Updates</Link>
                    <Link to={"/support"} className={"header-overlay-nav__item title title_md"} onClick={closeMenu}>Support</Link>
                    <Link to={"/contact"} className={"header-overlay-nav__item title title_md"} onClick={closeMenu}>Contact</Link>
                </nav>
            </div>
            <div className={"header-wrapper " + ((filter) ? "header-filter" : "")}>

                {
                    ((admin) ?
                    
                    <div className='admin-bar'>
                        <div className='admin-bar__nav'>
                            <Link to={"/admin/console"} className="nav__item title title_sm admin-bar__nav-item">Admin Console</Link>
                            {(post != null) ? <Link to={"/admin/console/post?id=" + post} className="nav__item title title_sm admin-bar__nav-item">Edit Post</Link> : ""}
                        </div>
                        
                        <button className='button header__logout' onClick={() => {logout()}}>Log Out</button>
                    </div> 
                    
                    : "")
                }


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
        </div>
    );
}

export default Header;