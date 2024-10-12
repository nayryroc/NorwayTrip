import './Prayer.css';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import bg from '../images/mountains2.jpg';
import PrayerCard from './prayer-card/PrayerCard';
import { useEffect, useState } from 'react';
import PrayerReq from '../prayer';
import firebase from 'firebase/compat/app';
import isExpired from "../Expired";

import {db} from '../firebase';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {prayerConverter} from '../prayer';

function Prayer(){
    const [open, setOpen] = useState(false);
    const [requests, setRequests] = useState([]);
    const [didLoad, setDidLoad] = useState(false);
    const [nameErr, setNameErr] = useState("");
    const [textErr, setTextErr] = useState("");


    useEffect(() => {
        if(!didLoad){
            loadRequests();
            window.scrollTo(0, 0);
            setDidLoad(true);
        }
    })

    function loadPublic(prayers){
        db.collection('PrayerReq').orderBy("date", "desc").where("isPrivate", "==", false).withConverter(prayerConverter).get().then((querySnapshot) => {
            querySnapshot.docs.map(doc => {
                let p = doc.data();
                p.id = doc.id;
                prayers.push(p);
            });
        
            setRequests(prayers);
        }).catch((error) => {
            console.log("Error reading document: " + error);
        })
    }

    function loadRequests(){
        let prayers = [];
        
        firebase.auth().onAuthStateChanged(user => {
            if (user && !isExpired(user)) {
                db.collection('PrayerReq').orderBy("date", "desc").where("isPrivate", "==", true).withConverter(prayerConverter).get().then((querySnapshot) => {
                    let prayers = [];
                    querySnapshot.docs.map(doc => {
                        let p = doc.data();
                        p.id = doc.id;
                        prayers.push(p);
                    });
                
                    loadPublic(prayers);
                }).catch((error) => {
                    console.log("Error reading document: " + error);
                })
            } else{
                loadPublic(prayers);
            }

          })
    }


    function addPrayer(){
        let name = document.getElementById("name").value;
        let text = document.getElementById("text").value;
        let isPrivate = document.getElementById("private").checked;
        
        if(name == ""){
            setNameErr("Please Enter Your Name");
        }else{
            setNameErr("");
        }

        if(text == ""){
            setTextErr("Please Enter Your Prayer Request");
        }else{
            setTextErr("");
        }


        if(text != "" && name != ""){
            let req = new PrayerReq(name, firebase.firestore.Timestamp.now(), isPrivate, text);
            
            db.collection("PrayerReq").withConverter(prayerConverter).add(req).then((v) => {
                setOpen(false);
                console.log("Prayer Request added!");

                let ids = JSON.parse(window.localStorage.getItem("requests"));
                if(ids == null) ids = [];
                ids.push(v.id);

                window.localStorage.setItem("requests", JSON.stringify(ids));
                loadPublic([]);
            })  
            
        }

      }

      function canDelete(req){
        let ids = JSON.parse(window.localStorage.getItem("requests"));

        if(ids == null) return false;
        else{
            return ids.includes(req.getId());
        }

      }

      function deleteReq(id){

        if(window.confirm("Are you sure you want to delete your request?")){

            let newReq = [];
                requests.map((req) => {
                    if(req.id !== id){
                        newReq.push(req);
                    }
                });
                setRequests(newReq);

            db.collection("PrayerReq").doc(id).delete().then(() => {
                console.log("Document successfully deleted!");
                

                loadPublic([]);
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });
        }

      }
      
    return (
        <div className={"page" + (open ? " page_100vh" : "")}>
            <Header subpage={true} title={"Prayer Requests"} bg={bg} filter={true}/>


            <div className={"add-prayer" + (open ? "" : " add-prayer_closed") }>
                <div className="add-prayer__wrapper">
                    <label htmlFor="name" className='text add-prayer__label'>Name</label>
                    <input type="text" name='name' id="name" className="text add-prayer__name" />
                    <p className="text error prayer-error">{nameErr}</p>

                    <label htmlFor="content" className='text add-prayer__label'>Prayer Request</label>
                    <textarea name="content" id="text" cols="30" rows="10" className='text add-prayer__content'></textarea>
                    <p className="text error prayer-error">{textErr}</p>


                    <div className="add-prayer__checkbox-wrapper" title='Only show prayer request to Cory'>
                        <label htmlFor="private" className='text add-prayer__private-label'>Private</label>
                        <input type="checkbox" id="private" className='text add-prayer__private'/>
                    </div>

                    <div className="add-prayer__buttons">
                        <button className="button" onClick={()=>{setOpen(false)}}>Cancel</button>
                        <button className="button" onClick={()=>{addPrayer()}}>Add</button>
                    </div>
                </div>
            </div>

            <div className="section section_blue">
                <div className="section__content section__content_sm">
                    <p className="text support__intro-text">I would like to use this page as a way for us to know how we can be praying for one another. I plan to post prayer requests on here from time to time but I would love for you guys to post any requests you have on here as well! I want to build a community that will support one another in prayer.</p>
                    
                    <div className="prayer__header">
                        <p className="title title_md prayer__title">Requests</p>
                        <button className='button button_alt prayer__add' onClick={()=>{setOpen(true)}}>Add Request</button>
                    </div>
                        
                    
                    {/* Next step integrate db with prayer requests (add and pull) */}
                    <div className="prayer">
                        {
                            requests.map((req, i) => {
                                return <PrayerCard name = {req.getName()} text = {req.getText()} date = {req.getDate()} key={i} canDelete={canDelete(req)} id={req.getId()} deleteReq={deleteReq}/>
                            })
                        }
                        
                    </div>
                </div>
            </div> 


            <Footer alt={false}/>
        </div>
    );
}

export default Prayer;