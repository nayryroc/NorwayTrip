import './Updates.css';
import {Link, useNavigate} from "react-router-dom";
import Feed from '../feed/Feed';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import bg from '../images/png-bg.jpg';
import { useState } from 'react';
import {db} from "../firebase";

function Updates(){

    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [disable, setDisable] = useState(false);



    function addEmail(){
        let email = document.getElementById("email").value;
        setDisable(true);

        if(email != ""){

            db.collection("Email").where("email_address", "==", email).get().then((ref) => {
                if(ref.docs.length > 0){
                    console.log("already exists");
                    setError("Email Already Subscribed");
                    setDisable(false);
                }else{
                    db.collection("Email").add({email_address: email}).then((ref)=>{
                        setError(false);
                        setSuccess("Email Successfully Added.");
                        setTimeout(()=>{
                            setOpen(false);
                        }, 1500);
                    });
                }
            });
            
        }else{
            setError("Please Enter Your Email");
            setDisable(false);
        }
    }


    return (
        <div className={"page"  + (open ? " page_100vh" : "")}>
            <Header subpage={true} title={"Updates"} bg={bg} filter={true}/>


            <div className={"add-email" + (open ? "" : " add-email_closed") }>
                <div className="add-email__wrapper">
                    <label htmlFor="name" className='text add-email__label'>Email</label>
                    <input type="text" name='email' id="email" className="text add-email__email" />
                    <p className="text error email-error">{error}</p>

                    <div className="add-email__buttons">
                        <button className="button" onClick={()=>{setOpen(false)}} disabled={(disable) ? true : false} >Cancel</button>
                        <button className="button" onClick={()=>{addEmail()}} disabled={(disable) ? true : false}>Sign Up</button>
                    </div>
                    <p className='text email-success'>{success}</p>
                </div>
            </div>


            <div className='section'>
                <div className='section__content'>
                      
                    <div className='updates'>
                        <p className='title title_sm updates__text'>Want to get notified when there is a new post?</p>
                        <button onClick={()=>{setOpen(true); setSuccess(""); document.getElementById("email").value = ""; setError(false); setDisable(false)}} className='button'>Sign Up</button>
                    </div>     

                    <Feed/>
                </div>
            </div>

            <Footer alt={true}/>
        </div>
    );
}

export default Updates;