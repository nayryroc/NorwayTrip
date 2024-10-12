import {Link, useNavigate} from "react-router-dom";
import Header from '../header/Header';
import Footer from '../footer/Footer';
import bg from '../images/mountains2.jpg';
import {db} from './/..//firebase'
import { useEffect } from "react";

function ReactionTime(){
    useEffect(()=>{
        lightCycle({"r": 10, "g": 20, "b": 30, "brightness": 200}, 1000, 10);
    }, [])
    

    return (
        <div className="page">
            <div className="section">
                <div className="section__content section__content_sm">



                </div>
            </div> 


        </div>
    );
}



function lightCycle(finalColor, delay, times){
    let colors = [];

    for(let i = 0; i < times-1; i++){
        colors[i] = {};
        colors[i].r = Math.round(Math.random() * 255);
        colors[i].g = Math.round(Math.random() * 255);
        colors[i].b = Math.round(Math.random() * 255);
        colors[i].brightness = 100;
    }
    console.log(finalColor);
    colors.push(finalColor);

    updateLight(colors, delay, times);
}


function updateLight(color={r:0,g:0,b:0,brightness:100}, delay, times){

    let colors = [];

    for(let i = 0; i < times; i++){
        colors[i] = {
            "r": color[i].r,
            "g": color[i].g,
            "b": color[i].b,
            "brightness": color[i].brightness,
        }
    }

    console.log(colors, delay, times)

    db.collection("lightbulb").doc("state").set({
        "color": colors,
        "delay": delay,
        "number": times
    });
}

export default ReactionTime;