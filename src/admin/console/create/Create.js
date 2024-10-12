import "./Create.css";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Post, {postConverter} from "../../../post";
import {db} from "../../../firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import firebase from "firebase/compat/app";
import {Carousel} from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"
import isExpired from "../../../Expired";
import sendEmail from "../../SendEmail"
import uploadImages from "../../UploadImages"
import Header from "../../../header/Header";
import Footer from "../../../footer/Footer";

function Create(){
    const [banner, setBanner] = useState(null);
    const [header, setHeader] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [content, setContent] = useState([]);
    const [version, setVersion] = useState(0);
    const [popup, setPopup] = useState(false);
    const [sectionType, setSectionType] = useState("");
    const [sectionIdx, setSectionIdx] = useState(null);
    const [error, setError] = useState(false);

    const navigate = useNavigate();
    useEffect(() => {
        if(!loaded) {
            firebase.auth().onAuthStateChanged(user => {
                if (!user || isExpired(user)) {
                  navigate("/admin");
                } 
              })
            setLoaded(true);

            window.scrollTo(0, 0)
             
        }


        //ensure textareas have right value on page update
        let elements = document.getElementsByClassName("post-content__textarea");
        let i = 0;
        for(let idx = 0; idx < content.length; idx++) {
            if (content[idx]["type"] === "text") {
                elements[i].value = (content[idx]["content"] !== undefined) ? content[idx]["content"] : "";
                i++;
            }
        }

    })

    window.onbeforeunload = (event) => {
        const e = event || window.event;
        // Cancel the event
        e.preventDefault();
        if (e) {
            e.returnValue = ''; // Legacy method for cross browser support
        }
        return ''; // Legacy method for cross browser support
    };


    function addSection(event, index){
        //default selection
        setSectionType("text");
        //index of add button
        setSectionIdx(index);
        //open popup
        setPopup(true);
    }


    function confirmRemove(event, index){
        if(window.confirm("Are you sure you want to remove this section?") == true){
            removeSection(event, index);
        }
    }

    function removeSection(event, index){
        let c = content;
        c.splice(index, 1);
        setContent(c);
        setVersion(version+1);
    }

    function createSection(){
        //close popup
        setPopup(false);

        //store index and type locally
        let i = sectionIdx;
        let type = sectionType;

        //create new section
        let map = {"type": type};

        let c = content;

        //add section to proper location
        c.splice(i, 0, map);

        //update content
        setContent(c);

    }

    function updateSection(event, data, isImage){
        //find index
        let i = event.target.id.replace("post-section", "");
        //get content
        let post = content;

        //get proper section
        let section = post[i];

        //update the data

        section.content = data;



        //update the post
        post[i] = section;
        setContent(post);

        //if it is an image update the page
        if(isImage) setVersion(version+1);
    }


    function updateSectionSlider(event, data, i, update){
        //find index
        let idx = event.target.id.replace("post-section", "");
        //get content
        let post = content;

        //get proper section
        let section = post[idx];

        if(section.content !== undefined) {
            if(update){
                section.content[i] = data;
            }else{
                section.content.push(data);
            }
        }else{
            section.content = [data];
        }
        //update the post
        post[idx] = section;
        setContent(post);

        //update the page
        setVersion(version+1);
    }

    function publish(){
        let title = document.getElementById("new-post-title").value;
        let desc = document.getElementById("new-post-description").value;
        let date = (d.getMonth()+1) + "/" + d.getDate() + "/" + d.getFullYear().toString().substring(2,4);
        let timestamp = firebase.firestore.Timestamp.now();

        if(content.length > 0 && noneempty() && title !== "" && desc !== ""){
            setError(false);
            let data = uploadImages(title, desc, date, timestamp, banner, header, content);
            console.log(data.post);
            setContent(data.c);
            publishPost(data.post);
        }else{
            setError(true);
        }
    }

    function noneempty(){
        for(let i = 0; i < content.length; i++){
            if(content[i].content === null){
                return false;
            }
        }
        return true;
    }



    function publishPost(post){
        db.collection("Post").withConverter(postConverter).add(post).then((ref) => {
            console.log("EditPost added!");
            const countRef = db.collection('PostCount').doc('postcount');
            countRef.update({
                count: firebase.firestore.FieldValue.increment(1)
            });
    
            
            sendNotification(ref.id, post.title);
        })
    }

    function sendNotification(id, title){
        let emails = [];
        db.collection("Email").get().then((querySnapshot) => {
            querySnapshot.docs.map(doc => {
                let e = doc.data();
                emails.push(e);
            });
    
            let bccString = "";
            emails.map((e) => {
                bccString += e.email_address +",";
            });
    
            let email = "corysauder@gmail.com";
            let bcc = "bcc=" + bccString.substring(0, bccString.length);
            let subject = "New Post: " + title;
            let body = "Thank you for your interest in following along on my journey!%0D%0A%0D%0AI have just created a new blog post on my website. You can view it here: https%3A%2F%2Fwww.corysauder.com%2Fpost?id=" + id + "%0D%0A%0D%0AThank you,%0D%0ACory%0D%0A%0D%0A%0D%0A%0D%0A%0D%0A%0D%0AIf you no longer wish to receive these emails click the following link: https://www.corysauder.com/unsubscribe";
    
            if(window.confirm("Send notification email?")){
                sendEmail(email, bcc, subject, body);
                navigate("/admin/console");
            }else{
                navigate("/admin/console");
            }
    
    
        });
    }
    





    function createSlider(section, i){
        console.log(section.content);
        if(section.content !== undefined){
            return section.content.map((value, idx) => {
                return (
                    <div key={i} className="new-post__file-input new-post__file-input-remove" style={(section.content[idx] !== null && section.content[idx] instanceof Object) ? {backgroundImage: "url(" + URL.createObjectURL(section.content[idx]) + ")"} : {}}>
                        <input type="file" id={"post-section" + i} accept={"image/jpeg, image/png"} className={"new-post__banner"} onChange={(event) => {updateSectionSlider(event, event.target.files[0], idx, true)}}/>
                        <div className="new-post__remove" onClick={()=>{removeSlider(i, idx)}}></div>
                    </div>
                );
            });
        }
    }

    function removeSlider(sectionIdx, sliderIdx){
        let post = content;
        let section = post[sectionIdx];
        section.content.splice(sliderIdx, 1);

        post[sectionIdx] = section;
        setContent(post);
        setVersion(version+1);
    }

    function headerImage(){
        console.log("Test");
        document.getElementById("new-post-banner").click();
    }

    let d = new Date();
    return(
        <div className="page page_overflow">
            {
                    (popup) ?
                    <div className="popup">
                        <div className="popup__content">
                            <label htmlFor="popup-select" className={"popup__title title title_md"}>Select Section</label>
                            <select name="popup-select" className={"popup__sections"} onChange={(event) => {setSectionType(event.target.value)}}>
                                <option value="text">Text</option>
                                <option value="image">Image</option>
                                <option value="slider">Slider</option>
                            </select>
                            <div className="popup__buttons">
                                <button className={"popup__add"} onClick={() => {createSection()}}>Add</button>
                                <button className={"popup__cancel"} onClick={() => {setPopup(false)}}>Cancel</button>
                            </div>
                        </div>
                    </div>
                        : ""
                }
            <div className="no-overflow">
            <Header subpage={true} title={"test"} bg={banner} filter={true} editFunction={headerImage}/> 
            <div className="section">
                <div className="section__content">
                    <div className="new-post">
                        {/* <p className="text text_sm new-post__date">{d.getMonth()+1}/{d.getDate()}/{d.getFullYear().toString().substring(2,4)}</p>  */}
                        <label className={"new-post__label title title_sm"} htmlFor="new-post-title">Title</label>
                        <input className={"new-post__title title title_md"} type="text" id={"new-post-title"}/>
                        <label className={"new-post__label title title_sm"} htmlFor="new-post-description">Summary</label>
                        <textarea name="description" id="new-post-description" className={"new-post__desc"} cols="30" rows="10"></textarea>
                        <label htmlFor="new-post-banner" className={"title title_sm"}>Banner Image</label>
                        <div className="new-post__file-input" style={(banner != null) ? {backgroundImage:"url(" + URL.createObjectURL(banner) + ")"} : {}}>
                            <input type="file" id={"new-post-banner"} accept={"image/jpeg, image/png"} className={"new-post__banner"} onChange={(event) => {setBanner(event.target.files[0]);}}/>
                        </div>

                        <label htmlFor="new-post-header" className={"title title_sm"}>Header Image</label>
                        <div className="new-post__file-input" style={(header != null) ? {backgroundImage:"url(" + URL.createObjectURL(header) + ")"} : {}}>
                            <input type="file" id={"new-post-header"} accept={"image/jpeg, image/png"} className={"new-post__banner"} onChange={(event) => {setHeader(event.target.files[0]);}}/>
                        </div>

                        <div className="post-content">
                            <p className="post-content__title title title_sm">Post Content</p>
                            <div className="post-content__add" onClick={(event)=>{addSection(event, 0)}}></div>

                            {
                                content.map((section, i) => {
                                    switch(section["type"]){
                                        case "text":
                                            return(
                                                <div key={i} className="post-content__section">
                                                    <div className="post-content__delete" onClick={(event) => {confirmRemove(event, i)}}></div>
                                                    <textarea id={"post-section"+i} cols="30" rows="10" defaultValue={(content[i].content != null) ? content[i].content : ""} className={"post-content__textarea"} onChange={(event) => {updateSection(event, event.target.value, false)}}></textarea>
                                                    <div className="post-content__add" onClick={(event)=>{addSection(event, (i+1))}}></div>
                                                </div>
                                            );
                                        case "image":
                                            return(
                                                <div key={i} className="post-content__section">
                                                    <div className="post-content__delete" onClick={(event) => {confirmRemove(event, i)}}></div>
                                                    <div className="new-post__file-input" style={(content[i].content !== null && content[i].content instanceof Object) ? {backgroundImage:"url(" + URL.createObjectURL(content[i].content) + ")"} : {}}>
                                                        <input type="file" id={"post-section"+i} accept={"image/jpeg, image/png"} className={"new-post__banner"} onChange={(event) => {updateSection(event, event.target.files[0], true)}}/>
                                                    </div>
                                                    <div className="post-content__add" onClick={(event)=>{addSection(event, (i+1))}}></div>
                                                </div>
                                            );
                                        case "slider":
                                            return(
                                                <div key={i} className="post-content__section">
                                                    <div className="post-content__delete" onClick={(event) => {confirmRemove(event, i)}}></div>

                                                    <Carousel showArrows={true} showThumbs={false}>

                                                        {(content[i].content !== undefined) ?
                                                            [1,2].map((v) => {
                                                                if(v === 1){
                                                                    return createSlider(content[i], i);
                                                                }else{
                                                                    return(
                                                                        <div key={v} className="new-post__file-input">
                                                                            <input type="file" id={"post-section" + i} accept={"image/jpeg, image/png"} className={"new-post__banner"} onChange={(event) => {updateSectionSlider(event, event.target.files[0], null, false)}}/>
                                                                        </div>
                                                                    );
                                                                }
                                                            })
                                                            :
                                                            <div className="new-post__file-input">
                                                                <input type="file" id={"post-section" + i} accept={"image/jpeg, image/png"} className={"new-post__banner"} onChange={(event) => {updateSectionSlider(event, event.target.files[0], null, false)}}/>
                                                            </div>
                                                        }


                                                    </Carousel>
                                                    <div className="post-content__add" onClick={(event)=>{addSection(event, (i+1))}}></div>
                                                </div>
                                            );
                                    }
                                })
                            }

                        </div>
                        {(error) ? <p className="error error_center">Error creating post. Make sure all fields are filled out.</p> : ""}
                        <button className={"button publish__button"} onClick={()=>{publish()}}>Publish</button>


                    </div>
                </div>
            </div>
            <Footer alt={true}/>
        </div>
        </div>
    );
}

export default Create;
