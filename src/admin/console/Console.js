import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import PostPreview from "../../post-preview/PostPreview";
import {db} from "../../firebase";
import {postConverter} from "../../post";
import "./Console.css";

function Console(){
    const [loaded, setLoaded] = useState(false);
    const [posts, setPosts] = useState([]);

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
        <div className={"section"}>
            <div className="section__content">
                <div className="console">
                    <h1 className="title console__title">Admin Console</h1>
                    <h2 className={"title title_md console__create"}>Create New Post</h2>
                    <Link to={"/admin/console/create-post"} className={"console__link"}>Create</Link>
                    <h2 className={"title title_md console__edit"}>Edit Previous Post</h2>
                    <div className="feed__posts">
                        {
                            posts.map((post, i) => {
                                return <PostPreview key={i} post={post} view={false}/>
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Console;