import "./Admin.css";
import {db} from "../firebase";
import firebase from 'firebase/compat/app';
import {postConverter} from "../post";
import {useEffect, useState} from "react";
import Console from "./console/Console";
import {useNavigate} from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import isExpired from "../Expired";
import Header from "../header/Header";
import bg from '../images/mountains2.jpg';
import Footer from "../footer/Footer";

function Admin(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const nav = useNavigate();


    function login(){
        const auth = getAuth();
        signInWithEmailAndPassword(auth, username, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log("Successful Login");
                    setError(false);
        })
        .catch((error) => {
            console.log("Invalid login");
            setError(true);
        });
    }
    
    
    firebase.auth().onAuthStateChanged(user => {
        if (user && !isExpired(user)) {
          nav("/admin/console");
        }
      })




    return(
        <div className="page">
            <Header subpage={true} title={"Log In"} bg={bg} filter={true}/>
            <div className="section section_blue">
                <div className="section__content">
                    <div className="login text">
                        <label className={"title title_sm"} htmlFor="username">Email</label>
                        <input type="text" autoComplete={"username"} onChange={(event)=>{setUsername(event.target.value)}} name={"username"} id={"username"} className={"login__username"}/>
                        <label className={"title title_sm"} htmlFor="password text">Password</label>
                        <input type="password" autoComplete={"password"} onChange={(event)=>{setPassword(event.target.value)}} name={"password"} id={"password"} className={"login__password"}/>
                        {(error) ? <p className={"error text"}>Invalid Login</p> : ""}
                        <button onClick={login} className={"button button_alt"}>Login</button>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}
export default Admin;