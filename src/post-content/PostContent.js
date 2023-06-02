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
import Footer from "../footer/Footer";
import defBG from "../images/mountains2.jpg";

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

                if(data.getHeaderPath() != null && data.getHeaderPath() != ""){
                    getDownloadURL(ref(storage, data.getHeaderPath())).then((url) => {
                        data.setHeaderPath(url);
                        setPost(data);
                        setUpdate(true);
                    })
                }

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
            <Header subpage={true} title={(post !== null) ? post.getTitle() : ""} bg={((post != null && post.getHeaderPath() != null && post.getHeaderPath() != "") ? post.getHeaderPath() : defBG)} filter={true} post={searchParams.get("id")}/>
            <div className="section section_post">
                <div className="section__content section__content_sm">
                    <p className="text post-date">{(post !== null) ? post.getDate() : ""}</p>
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
                    </div>
                </div>
            </div>
            <Footer alt={false}/>
        </div>


    );
}

export default PostContent;