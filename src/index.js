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


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<BrowserRouter>
    <Routes>
        <Route index element={<App/>}></Route>
        <Route path={"post"} element={<PostContent/>} />
        <Route path={"admin"} element={<Admin/>}/>
        <Route path={"admin/console"} element={<Console/>}/>
        <Route path={"admin/console/create-post"} element={<Create/>}/>
        <Route path={"admin/console/post"} element={<EditPost/>}/>
    </Routes>
</BrowserRouter>);

