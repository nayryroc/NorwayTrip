import {useEffect, useState} from "react";
import {db, storage} from '../firebase';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {Link, useSearchParams} from "react-router-dom";
import Post, {postConverter} from "../post";
import Header from "../header/Header";
import './PostContent.css';
import {getDownloadURL, ref} from "firebase/storage";
import {Carousel} from "react-responsive-carousel";
import firebase from "firebase/compat/app";

function PostContent(){
    const [searchParams, setSearchParams] = useSearchParams();
    const [didLoad, setDidLoad] = useState(false);
    const [post, setPost] = useState(null);
    const [version, setVersion] = useState(0);
    const [update, setUpdate] = useState(false);
    var timeout;

    useEffect(() => {
        if(!didLoad) {
            db.collection("Post").doc(searchParams.get("id")).withConverter(postConverter).get().then((snapshot) => {
                let data = snapshot.data();
                setPost(data);
                for(let i = 0; i < data.getPostBody().length; i++){
                    if(data.getPostBody()[i].type === "image"){
                        getDownloadURL(ref(storage, data.getPostBody()[i].content)).then(url => {
                            data.getPostBody()[i].imgUrl = url;
                            setPost(data);
                            setUpdate(true);
                        })
                    }else if(data.getPostBody()[i].type === "slider"){
                        data.getPostBody()[i].imgUrl = [];
                        for(let j = 0; j < data.getPostBody()[i].content.length; j++){
                            getDownloadURL(ref(storage, data.getPostBody()[i].content[j])).then(url => {
                                data.getPostBody()[i].imgUrl[j] = url;
                                setPost(data);
                                setUpdate(true);
                            })
                        }
                    }

                }
            }).catch((error) => {
                console.log("Error reading document: " + error);
            })

            window.scrollTo(0, 0);

            db.collection("Post").doc(searchParams.get("id")).update({views: firebase.firestore.FieldValue.increment(1)}).then(r => {})


            setDidLoad(true);
        }

            if(update){
                setVersion(version+1);
                setUpdate(false);
            }


    })



    return(
        <div className="page">
            <Header subpage={true}/>
            <div className="section">
                <div className="section__content section__content_sm">
                    <Link to={"/"} className={"post-back post-back_first text"}>&#60; BACK TO HOME</Link>

                    <h1 className={"title title_md"}>{(post !== null) ? post.getTitle() : ""}</h1>
                    <p className="text text_sm post-date">{(post !== null) ? post.getDate() : ""}</p>
                    <div className="post-content">

                        {
                            (post !== null && post.getPostBody() !== undefined) ?
                            post.getPostBody().map((section, i)=> {
                                switch (section.type) {
                                    case "text":
                                        return <p key={i} className={"text post-content__text"}>{section.content}</p>;
                                    case "image":
                                        return <img height={400} width={750} key={i} className={"post-content__img"} src={section.imgUrl} alt={""}/>;
                                    case "slider":
                                        return(
                                            <Carousel key={i} showArrows={true} showThumbs={false} dynamicHeight={true} emulateTouch={true} swipeable={true} infiniteLoop={true}>
                                                {section.content.map((val, i) => {
                                                    return <img height={400} width={750} key={i} className={"post-content__slider-img"} src={section.imgUrl[i]} alt={""}/>;
                                                })}
                                            </Carousel>
                                            );
                                }
                            })
                                : ""
                        }

                        <Link to={"/"} className={"post-back text"}>&#60; BACK TO HOME</Link>
                    </div>
                </div>
            </div>
        </div>


    );
}

export default PostContent;