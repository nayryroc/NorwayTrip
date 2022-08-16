import "./Admin.css";
import {db} from "../firebase";
import {postConverter} from "../post";
import {useEffect, useState} from "react";
import Console from "./console/Console";
import {useNavigate} from "react-router-dom";

function Admin(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const nav = useNavigate();

    function login(){
        db.collection("Admin").where("username", "==", username).where("password", "==", password).get().then((snapshot) => {
            if(snapshot.empty){
                console.log("Invalid login");
                setError(true);
            }else{
                console.log("Successful Login");
                setError(false);
                localStorage.setItem("loggedin", new Date().toJSON());
                nav("/admin/console");
            }
        }).catch((error) => {
            console.log("Error reading document: " + error);
            setError(true);
        })
    }


    function expired(){
        let d = new Date(localStorage.getItem('loggedin'));
        return d.setDate(d.getDate() + 1) < new Date();
    }

    const navigate = useNavigate();
    useEffect(() => {
        if(localStorage.getItem("loggedin") != null && !expired()){
            navigate("/admin/console");
        }
    })




    return(
            <div className="section section_login">
                <div className="section__content">
                    <div className="login text">
                        <label className={"text"} htmlFor="username">Username</label>
                        <input type="text" onChange={(event)=>{setUsername(event.target.value)}} id={"username"} className={"login__username"}/>
                        <label className={"text"} htmlFor="password text">Password</label>
                        <input type="password" onChange={(event)=>{setPassword(event.target.value)}} id={"password"} className={"login__password"}/>
                        {(error) ? <p className={"error text"}>Invalid Login</p> : ""}
                        <button onClick={login} className={"login__login"}>Login</button>
                    </div>
                </div>
            </div>
    );
}
export default Admin;