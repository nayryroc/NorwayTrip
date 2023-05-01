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
    const [currPage, setCurrPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [lastPost, setLastPost] = useState([]);
    const PAGE_SIZE = 6;


    useEffect(() => {
        if(!didLoad){
            getCount();
            window.scrollTo(0, 0);
            setDidLoad(true);
        }
    })

    function getCount(){
        db.collection('PostCount').get().then((querySnapshot) => {
            setPageCount(getPages(querySnapshot.docs[0].data().count));
            loadPosts(1);
        }).catch((error) => {
            console.log("Error reading document: " + error);
        })
    }


    function getPages(count){
        let pages = count / PAGE_SIZE;
        if(pages != Math.trunc(pages)){
            pages = Math.trunc(pages) + 1;
        }
        return pages;
    }

    function loadPosts(pageNum){

        let newPosts = [];

        db.collection('Post').orderBy("timestamp", "desc").withConverter(postConverter).startAfter(lastPost).limit(PAGE_SIZE).get().then((querySnapshot) => {

            querySnapshot.docs.map(doc => {
                let p = doc.data();
                p.setId(doc.id);
                newPosts.push(p);
            });
            setLastPost(querySnapshot.docs[querySnapshot.docs.length - 1]);
            
            if(posts.length > 0){
                let temp = posts;
                newPosts = temp.concat(newPosts);
            }
            
            setPosts(newPosts);

        }).catch((error) => {
            console.log("Error reading document: " + error);
        })

    }


    return(

        <div className="section">
            <div className="section__content">
                <div className="feed">
                    <div className="feed__posts">
                        {
                            posts.map((post, i) => {
                                return <PostPreview key={i} post={post} view={true} isAdmin={false}/>
                            })
                        }
                        {((currPage < pageCount) ? <button className='button button_alt feed-button' onClick={()=>{setCurrPage(currPage+1); loadPosts(currPage)}}>Load More</button> : "")}
                    </div>
                </div>
            </div>
        </div>
    );
}







export default Feed;