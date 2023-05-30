import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import PostPreview from "../../post-preview/PostPreview";
import {db} from "../../firebase";
import {postConverter} from "../../post";
import firebase from 'firebase/compat/app';
import isExpired from "../../Expired";
import "./Console.css";
import Header from "../../header/Header";
import bg from '../../images/mountains2.jpg';
import Footer from "../../footer/Footer";


function Console(){
    const [loaded, setLoaded] = useState(false);
    const [posts, setPosts] = useState([]);


    const navigate = useNavigate();
    useEffect(() => {
        if(!loaded) {
            firebase.auth().onAuthStateChanged(user => {
                if (!user || isExpired(user)) {
                  navigate("/admin");
                } 
              })
            loadPosts();
            setLoaded(true);
        }
    })


    function loadPosts(){

        let posts = [];

        db.collection('Post').orderBy("timestamp", "desc").withConverter(postConverter).get().then((querySnapshot) => {

            querySnapshot.docs.map(doc => {
                let p = doc.data();
                p.setId(doc.id);
                posts.push(p);
            });
            setPosts(posts);

        }).catch((error) => {
            console.log("Error reading document: " + error);
        })
    }



    return(
        <div className="page">
            <Header subpage={true} title={"Admin Console"} bg={bg} filter={true}/>
            <div className={"section"}>
                <div className="section__content">
                    <div className="console">
                        <h2 className={"title title_md console__create"}>Create New Post</h2>
                        <Link to={"/admin/console/create-post"} className={"button button_alt console__link"}>Create</Link>
                        <h2 className={"title title_md console__edit"}>Edit Previous Post</h2>
                        <div className="feed__posts">
                            {
                                posts.map((post, i) => {
                                    return <PostPreview key={i} post={post} view={false} isAdmin={true}/>
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
            <Footer alt={true}/>
        </div>
    );
}
export default Console;