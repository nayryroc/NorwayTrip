import "../create/Create.css";
import {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import Post, {postConverter} from "../../../post";
import {db, storage} from "../../../firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {Carousel} from "react-responsive-carousel";



function EditPost(){
    const [banner, setBanner] = useState(null);
    const [header, setHeader] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [content, setContent] = useState([]);
    const [version, setVersion] = useState(0);
    const [popup, setPopup] = useState(false);
    const [sectionType, setSectionType] = useState("");
    const [sectionIdx, setSectionIdx] = useState(null);
    const [error, setError] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [date, setDate] = useState("");
    const [update, setUpdate] = useState(false);


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

            db.collection("Post").doc(searchParams.get("id")).withConverter(postConverter).get().then((snapshot) => {
                let data = snapshot.data();

                getDownloadURL(ref(storage, data.getImagePath())).then(url => {
                    setBanner(url);
                    setUpdate(true);
                })

                if(data.getHeaderPath() != null && data.getHeaderPath() != ""){
                    getDownloadURL(ref(storage, data.getHeaderPath())).then(url => {
                        setHeader(url);
                        setUpdate(true);
                    })
                }

                document.getElementById("new-post-title").value = data.getTitle();
                document.getElementById("new-post-description").value = data.getDescription();
                setDate(data.getDate());

                setContent(data.getPostBody());
                for(let i = 0; i < data.getPostBody().length; i++){
                    if(data.getPostBody()[i].type === "image"){
                        getDownloadURL(ref(storage, data.getPostBody()[i].content)).then(url => {
                            data.getPostBody()[i].content = url;
                            setContent(data.getPostBody());
                            setUpdate(true);
                        })
                    }else if(data.getPostBody()[i].type === "slider"){
                        for(let j = 0; j < data.getPostBody()[i].content.length; j++){
                            getDownloadURL(ref(storage, data.getPostBody()[i].content[j])).then(url => {
                                data.getPostBody()[i].content[j] = url;
                                setContent(data.getPostBody());
                                setUpdate(true);
                            })
                        }
                    }

                }
            }).catch((error) => {
                console.log("Error reading document: " + error);
            })

            setLoaded(true);
        }


        //ensure textareas have right value on page update
        let elements = document.getElementsByClassName("post-content__textarea");
        let i = 0;
        if(content !== null) {
            for (let idx = 0; idx < content.length; idx++) {
                if (content[idx]["type"] === "text") {
                    elements[i].value = (content[idx]["content"] !== undefined) ? content[idx]["content"] : "";
                    i++;
                }
            }
        }


        if(update){
            setVersion(version+1);
            setUpdate(false);
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
        console.log(idx);
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

        if(content.length > 0 && noneempty() && title !== "" && desc !== ""){
            setError(false);
            uploadImages(title, desc, date);
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


    function uploadImages(title, desc, date){
        const storage = getStorage();

        let imgRef;
        if(banner instanceof Object) {
            imgRef = ref(storage, `${new Date().toString().replaceAll(/[ \-():]/g, "")}-${banner.name.replaceAll(/[ \-():]/g, "")}`);
            uploadBytes(imgRef, banner).then((snapshot) => {
                console.log("uploaded");
            });
        }else{
            imgRef = {fullPath: banner};
        }


        let imgRef2;
        if(header instanceof Object) {
            imgRef2 = ref(storage, `${new Date().toString().replaceAll(/[ \-():]/g, "")}-${header.name.replaceAll(/[ \-():]/g, "")}`);
            uploadBytes(imgRef2, header).then((snapshot) => {
                console.log("uploaded");
            });
        }else{
            imgRef2 = {fullPath: header};
        }


        let c = content;
        for(let i = 0; i < content.length; i++){
            if(content[i].type === "image" && content[i].content instanceof Object){
                let reference = ref(storage, `${new Date().toString().replaceAll(/[ \-():]/g, "")}-${content[i].content.name.replaceAll(/[ \-():]/g, "")}`);
                uploadBytes(reference, content[i].content).then((snapshot) => {
                    console.log("uploaded");
                });
                c[i].content = reference.fullPath;
                setContent(c);
            }else if(content[i].type === "slider"){
                for(let j = 0; j < content[i].content.length; j++){
                    if(content[i].content[j] instanceof Object){
                        let reference = ref(storage, `${new Date().toString().replaceAll(/[ \-():]/g, "")}-${content[i].content[j].name.replaceAll(/[ \-():]/g, "")}`);
                        uploadBytes(reference, content[i].content[j]).then((snapshot) => {
                            console.log("uploaded");
                        });
                        c[i].content[j] = reference.fullPath;
                        setContent(c);
                    }
                }
            }
        }

        let post = new Post(title, desc, imgRef.fullPath, imgRef2.fullPath, content, "", date, 0, 0);

        db.collection("Post").doc(searchParams.get("id")).withConverter(postConverter).update({date: post.getDate(), description: post.getDescription(), title: post.getTitle(), image_path: post.getImagePath(), header_path: post.getHeaderPath(), post_body: post.getPostBody()}).then(() => {
            navigate("/admin/console");
            console.log("EditPost added!");
        })


    }

    function createSlider(section, i){
        if(section.content !== undefined){
            return section.content.map((value, idx) => {
                return (
                    <div key={idx} className="new-post__file-input new-post__file-input-remove" style={(value !== null && value instanceof Object) ? {backgroundImage: "url(" + URL.createObjectURL(section.content[idx]) + ")"} : {backgroundImage:"url(" + value + ")"}}>
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
                    <p className="text text_sm">{date}</p>
                    <label className={"new-post__label title title_sm"} htmlFor="new-post-description">Summary</label>
                    <textarea name="description" id="new-post-description" className={"new-post__desc"} cols="30" rows="10"></textarea>
                    <label htmlFor="new-post-banner" className={"title title_sm"}>Banner Image</label>
                    <div className="new-post__file-input" style={(banner instanceof Object) ? {backgroundImage:"url(" + URL.createObjectURL(banner) + ")"} : {backgroundImage:"url(" + banner + ")"}}>
                        <input type="file" id={"new-post-banner"} accept={"image/jpeg, image/png"} className={"new-post__banner"} onChange={(event) => {setBanner(event.target.files[0]);}}/>
                    </div>

                    <label htmlFor="new-post-header" className={"title title_sm"}>Header Image</label>
                    <div className="new-post__file-input" style={(header instanceof Object) ? {backgroundImage:"url(" + URL.createObjectURL(header) + ")"} : {backgroundImage:"url(" + header + ")"}}>
                        <input type="file" id={"new-post-header"} accept={"image/jpeg, image/png"} className={"new-post__banner"} onChange={(event) => {setHeader(event.target.files[0]);}}/>
                    </div>

                    <div className="post-content">
                        <p className="post-content__title title title_sm">Post Content</p>
                        <div className="post-content__add" onClick={(event)=>{addSection(event, 0)}}></div>

                        {
                            (content !== null) ?
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
                                                <div className="new-post__file-input" style={(content[i].content !== null && content[i].content instanceof Object) ? {backgroundImage:"url(" + URL.createObjectURL(content[i].content) + ")"} : {backgroundImage:"url(" + content[i].content + ")"}}>
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
                                : ""
                        }

                    </div>
                    {(error) ? <p className="error error_center">Error creating post. Make sure all fields are filled out.</p> : ""}
                    <button className={"button publish__button"} onClick={()=>{publish()}}>Publish</button>


                </div>
            </div>
        </div>
    );
}

export default EditPost;