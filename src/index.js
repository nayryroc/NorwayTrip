import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import App from "./App";
import PostContent from "./post-content/PostContent";
import Admin from "./admin/Admin";
import Console from "./admin/console/Console";
import Create from "./admin/console/create/Create";
import EditPost from "./admin/console/post/EditPost";
import Updates from './updates/Updates';
import Support from './support/Support';
import Contact from './contact/Contact';
import Prayer from './prayer/Prayer';
import Unsubscribe from './unsubscribe/Unsubscribe';
import ReactionTime from './status-light/ReactionTime';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<BrowserRouter>
    <Routes>
        <Route path={process.env.PUBLIC_URL + "/"} element={<App/>}></Route>
        <Route path={process.env.PUBLIC_URL + "/post"} element={<PostContent/>} />
        <Route path={process.env.PUBLIC_URL + "/updates"} element={<Updates/>}/>
        <Route path={process.env.PUBLIC_URL + "/support"} element={<Support/>}/>
        <Route path={process.env.PUBLIC_URL + "/contact"} element={<Contact/>}/>
        <Route path={process.env.PUBLIC_URL + "/prayer"} element={<Prayer/>}/>
        <Route path={process.env.PUBLIC_URL + "/unsubscribe"} element={<Unsubscribe/>}/>
        <Route path={process.env.PUBLIC_URL + "/admin"} element={<Admin/>}/>
        <Route path={process.env.PUBLIC_URL + "/admin/console"} element={<Console/>}/>
        <Route path={process.env.PUBLIC_URL + "/admin/console/create-post"} element={<Create/>}/>
        <Route path={process.env.PUBLIC_URL + "/admin/console/post"} element={<EditPost/>}/>
        <Route path={process.env.PUBLIC_URL + "/reaction-time"} element={<ReactionTime/>}/>

    </Routes>
</BrowserRouter>);

