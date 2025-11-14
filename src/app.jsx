import React, {useState, useEffect, use} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { Login } from "./login/login";
import { About } from "./about/about";
import { Helper } from "./helper/helper";
import { Home } from "./home/home";
import { AuthState } from './login/authState';

export default function App() {
    const [user, setUser] = useState(null);
    const currentAuthState = user ? AuthState.Authenticated : AuthState.Unauthenticated;
    const [authState, setAuthState] = React.useState(currentAuthState);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    

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
                {user && (
                    <>
                    <li><NavLink to="home">Home</NavLink></li>
                    <li><NavLink to="login">Login</NavLink></li>
                    <li><NavLink to="helper">Fantasy Helper</NavLink></li>
                    <li><NavLink to="about">About</NavLink></li>
                    </>
                )}    
            </ul>
            {user && (
                <div className="navbar-user">
                    <span>{user.username}</span>
                    <button onClick={handleLogout} className="btn btn-secondary btn-sm ms-2">Logout</button>
                </div>
            )}
        </nav>
        </header>

        <Routes>
            <Route path="/" element={<Login />} exact />
            <Route path="/home" element={<Home user={user} onLogout={handleLogout} />} />
            <Route path="/login" element={<Login />} />
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