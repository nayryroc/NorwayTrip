import './Unsubscribe.css';
import {db} from "../firebase";
import { useState } from 'react';

function Unsubscribe(){

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [disable, setDisable] = useState(false);


    function unsub(){
        let email = document.getElementById("email").value;
        setDisable(true);
        if(email != ""){

            db.collection("Email").where("email_address", "==", email).get().then((snap) => {
                if(snap.docs.length > 0){


                    db.collection("Email").doc(snap.docs[0].id).delete().then((snap)=>{
                        setError("");
                        setSuccess("Email Unsubscribed");
                    });

                }else{
                    setError("Email Not Subscribed");
                    setDisable(false);
                }
            })


        }else{
            setError("Please Enter an Email");
            setDisable(false);
        }
    }


    return (
        <div className="page">
            <div className="section">
                <div className="section__content">

                    
                        {((!success) ?
                            <div className="unsubscribe">
                                <label className="text" htmlFor="email">Please enter the email you want to unsubscribe</label>
                                <input type="text" id="email" />
                                <p className="unsubscribe-error error text">{error}</p>
                                <button className='button' onClick={()=>{unsub();}} disabled={(disable ? true : false)}>Unsubscribe</button>
                            </div>
                            :
                            <p className="unsubscribe-success text">{success}</p>
                        )}
                    
                </div>
            </div>
        </div>
    )
}

export default Unsubscribe;