import "./PostPreview.css";
import { Link } from "react-router-dom";
import {getDownloadURL, getStorage, ref} from "firebase/storage"
import {useEffect, useState} from "react";

function PostPreview({post, view, isAdmin, full_width, alt}){
    const [URL, setURL] = useState("");
    const [first, setFirst] = useState(true);
    const storage = getStorage();

    useEffect(() => {

        if(first) {
            getDownloadURL(ref(storage, post.getImagePath())).then(url => {
                setURL(url);
            })
            setFirst(false);
        }

    });

    return(
        <div className={"feed__post-wrapper " + ((full_width) ? "feed__post-wrapper_full" : "")}>
            <Link to={(view) ? "/post?id="+post.getId() : "/admin/console/post?id="+post.getId()} className="feed__post">
                <div className="feed__image" style={{backgroundImage: `url(${URL})`}}></div>

                <div className="feed__content">
                    <p className="feed__post-title title title_sm">{post.getTitle()}</p>
                    <p className="text text_sm feed__date">{post.getDate()}</p>
                    {isAdmin ? <p className={"text text_sm feed__views"}>{post.getViews()}</p> : ''}
                    <p className="feed__post-text text">{post.getDescription()}</p>
                    <div className={"button text " + ((alt) ? "button_alt" : "")}>{((!isAdmin) ? "READ MORE" : "EDIT")}</div>
                </div>
            </Link>
        </div>
    );
}
export default PostPreview;