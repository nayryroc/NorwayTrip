import "./Create.css";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Post, {postConverter} from "../../../post";
import {db} from "../../../firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import firebase from "firebase/compat/app";
import {Carousel} from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"


function Create(){
    const [banner, setBanner] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [content, setContent] = useState([]);
    const [version, setVersion] = useState(0);
    const [popup, setPopup] = useState(false);
    const [sectionType, setSectionType] = useState("");
    const [sectionIdx, setSectionIdx] = useState(null);
    const [error, setError] = useState(false);

    function expired(){
        let d = new Date(localStorage.getItem('loggedin'));
        return d.setDate(d.getDate() + 1) < new Date();
    }

    const navigate = useNavigate();
    useEffect(() => {
        if(!loaded) {
            if (localStorage.getItem("loggedin") == null || expired()) {
                navigate("/admin");
            }
            setLoaded(true);
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
            uploadImages(title, desc, date, timestamp);
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


    function uploadImages(title, desc, date, timestamp){
        const storage = getStorage();
        let imgRef = ref(storage, `${new Date().toString().replaceAll(/[ \-():]/g, "")}-${banner.name.replaceAll(/[ \-():]/g, "")}`);
        uploadBytes(imgRef, banner).then((snapshot) => {
            console.log("uploaded");
        });
        let c = content;
        for(let i = 0; i < content.length; i++){
            if(content[i].type === "image"){
                let reference = ref(storage, `${new Date().toString().replaceAll(/[ \-():]/g, "")}-${content[i].content.name.replaceAll(/[ \-():]/g, "")}`);

                uploadBytes(reference, content[i].content).then((snapshot) => {
                    console.log("uploaded");
                });
                c[i].content = reference.fullPath;
                setContent(c);

            }else if(content[i].type === "slider"){
                for(let j = 0; j < content[i].content.length; j++){
                    let reference = ref(storage, `${new Date().toString().replaceAll(/[ \-():]/g, "")}-${content[i].content[j].name.replaceAll(/[ \-():]/g, "")}`);
                    uploadBytes(reference, content[i].content[j]).then((snapshot) => {
                        console.log("uploaded");
                    });
                    c[i].content[j] = reference.fullPath;
                    setContent(c);
                }
            }
        }

        let post = new Post(title, desc, imgRef.fullPath, content, "", date, timestamp, 0);

        db.collection("Post").withConverter(postConverter).add(post).then(() => {
            navigate("/admin/console");
            console.log("EditPost added!");
        })


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

    let d = new Date();
    return(
        <div className="section">
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
            <div className="section__content">
                <div className="new-post">
                    <label className={"new-post__label title title_sm"} htmlFor="new-post-title">Title</label>
                    <input className={"new-post__title title title_md"} type="text" id={"new-post-title"}/>
                    <p className="text text_sm">{d.getMonth()+1}/{d.getDate()}/{d.getFullYear().toString().substring(2,4)}</p>
                    <label className={"new-post__label title title_sm"} htmlFor="new-post-description">Summary</label>
                    <textarea name="description" id="new-post-description" className={"new-post__desc"} cols="30" rows="10"></textarea>
                    <label htmlFor="new-post-banner" className={"title title_sm"}>Banner Image</label>
                    <div className="new-post__file-input" style={(banner != null) ? {backgroundImage:"url(" + URL.createObjectURL(banner) + ")"} : {}}>
                        <input type="file" id={"new-post-banner"} accept={"image/jpeg, image/png"} className={"new-post__banner"} onChange={(event) => {setBanner(event.target.files[0]);}}/>
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
                                                <div className="post-content__delete" onClick={(event) => {removeSection(event, i)}}></div>
                                                <textarea id={"post-section"+i} cols="30" rows="10" defaultValue={(content[i].content != null) ? content[i].content : ""} className={"post-content__textarea"} onChange={(event) => {updateSection(event, event.target.value, false)}}></textarea>
                                                <div className="post-content__add" onClick={(event)=>{addSection(event, (i+1))}}></div>
                                            </div>
                                        );
                                    case "image":
                                        return(
                                            <div key={i} className="post-content__section">
                                                <div className="post-content__delete" onClick={(event) => {removeSection(event, i)}}></div>
                                                <div className="new-post__file-input" style={(content[i].content !== null && content[i].content instanceof Object) ? {backgroundImage:"url(" + URL.createObjectURL(content[i].content) + ")"} : {}}>
                                                    <input type="file" id={"post-section"+i} accept={"image/jpeg, image/png"} className={"new-post__banner"} onChange={(event) => {updateSection(event, event.target.files[0], true)}}/>
                                                </div>
                                                <div className="post-content__add" onClick={(event)=>{addSection(event, (i+1))}}></div>
                                            </div>
                                        );
                                    case "slider":
                                        return(
                                            <div key={i} className="post-content__section">
                                                <div className="post-content__delete" onClick={(event) => {removeSection(event, i)}}></div>

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
                    <button className={"create-button publish__button"} onClick={()=>{publish()}}>Publish</button>


                </div>
            </div>
        </div>
    );
}

export default Create;