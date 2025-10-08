import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import { Login } from "./login/login";
import { About } from "./about/about";
import { Helper } from "./helper/helper";
import { Home } from "./home/home";

export default function App() {
  return (
    <BrowserRouter>
        <header>
        <h1>Fantasy Helper</h1>
        <nav>
            <ul>
            <li><NavLink to="home">Home</NavLink></li>
            <li><NavLink to="login">Login</NavLink></li>
            <li><NavLink to="helper">Fantasy Helper</NavLink></li>
            <li><NavLink to="about">About</NavLink></li>
            </ul>
        </nav>
        <hr />
        </header>

        <Routes>
            <Route path="/home" element={<Home />} exact />
            <Route path="/login" element={<Login />} />
            <Route path="/helper" element={<Helper />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    </BrowserRouter>
  );
}

function NotFound() {
    return (
        <main className="container-fluid bg-secondary text-center">
            <div>404: Not Found</div>
        </main>
    );
}