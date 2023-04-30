import './UpdatesCTA.css';
import {Link, useNavigate} from "react-router-dom";
import PostPreview from '../post-preview/PostPreview';
import {db} from '../firebase';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {postConverter} from '../post';
import React, {useEffect, useState} from "react";



function UpdatesCTA(size){
    const [post, setPost] = useState([]);
    const [didLoad, setDidLoad] = useState(false);

    useEffect(() => {
        if(!didLoad){
            loadPosts();
            setDidLoad(true);
        }
    })
    
    


    function loadPosts(){

        db.collection('Post').orderBy("timestamp", "desc").withConverter(postConverter).limit(1).get().then((querySnapshot) => {           
            let p = querySnapshot.docs[0].data();
            p.setId(querySnapshot.docs[0].id);
            setPost([p]);

        }).catch((error) => {
            console.log("Error reading document: " + error);
        })

    }



    return (
        <div className={"section section_gradient " + ((size.size == "sm") ? "section_sm" : "")}>
            <div className="section__content section__content_sm">
                <p className="updatesCTA-title title title_sm">Latest Update</p>
                <div className="updatesCTA">
                    
                    <div className="updatesCTA__post">
                        {((post.length > 0) ? <PostPreview post={post[0]} view={true} isAdmin={false} full_width={true} alt={true}/> : "")}
                    </div>

                    <div className="updatesCTA__content">
                        <p className="updatesCTA__title title title_xs">Want to see more?</p>
                        <p className='updatesCTA__text text'>Previous posts can be viewed on the Updates page</p>
                        <Link to={"/updates"} className={"updatesCTA__link button button_alt"}>Updates</Link>
                    </div>
                
                </div>
            </div>
        </div>
    );
}

export default UpdatesCTA;