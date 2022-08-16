import './Feed.css';
import PostPreview from "../post-preview/PostPreview";

import {db} from '../firebase';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {postConverter} from '../post';
import React, {useEffect, useState} from "react";

function Feed() {
    const [posts, setPosts] = useState([]);
    const [didLoad, setDidLoad] = useState(false);

    useEffect(() => {
        if(!didLoad){
            loadPosts();
            window.scrollTo(0, 0);
            setDidLoad(true);
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

        <div className="section">
            <div className="section__content">
                <div className="feed">
                    <h2 className={"title feed__title"}>Latest Updates</h2>
                    <div className="feed__posts">
                        {
                            posts.map((post, i) => {
                                return <PostPreview key={i} post={post} view={true}/>
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}







export default Feed;