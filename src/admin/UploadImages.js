import Post, {postConverter} from "../post";
import {db} from "../firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import firebase from "firebase/compat/app";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import sendEmail from "./SendEmail";
import {useNavigate} from "react-router-dom";


function uploadImages(title, desc, date, timestamp, banner, header, content){
    const storage = getStorage();
    let imgRef = ref(storage, `${new Date().toString().replaceAll(/[ \-():]/g, "")}-${banner.name.replaceAll(/[ \-():]/g, "")}`);
    uploadBytes(imgRef, banner).then((snapshot) => {
        console.log("uploaded");
    });

    let imgRef2 = ref(storage, `${new Date().toString().replaceAll(/[ \-():]/g, "")}-${header.name.replaceAll(/[ \-():]/g, "")}`);
    uploadBytes(imgRef2, header).then((snapshot) => {
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

        }else if(content[i].type === "slider"){
            for(let j = 0; j < content[i].content.length; j++){
                let reference = ref(storage, `${new Date().toString().replaceAll(/[ \-():]/g, "")}-${content[i].content[j].name.replaceAll(/[ \-():]/g, "")}`);
                uploadBytes(reference, content[i].content[j]).then((snapshot) => {
                    console.log("uploaded");
                });
                c[i].content[j] = reference.fullPath;
            }
        }
    }

    let post = new Post(title, desc, imgRef.fullPath, imgRef2.fullPath, content, "", date, timestamp, 0);

    

    return {c, post};
}


export default uploadImages;