import React, {useState, useEffect, use} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { Login } from "./login/login";
import { About } from "./about/about";
import { Helper } from "./helper/helper";
import { Home } from "./home/home";

export default function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const handleLogin = (username) => {
        const newUser = { username };
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };


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
        </header>

        <Routes>
            <Route path="/" element={<Login onLogin={handleLogin} />} exact />
            <Route path="/home" element={<Home user={user} onLogout={handleLogout} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/helper" element={<Helper user={user} />} />
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