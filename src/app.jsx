import React, {useState, useEffect, use} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { Login } from "./login/login";
import { About } from "./about/about";
import { Helper } from "./helper/helper";
import { Home } from "./home/home";
import { AuthState } from './login/authState';
import Button from 'react-bootstrap/Button';

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

    async function logout() {
    try {
      await fetch(`/api/auth/logout`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.log("Logout failed (offline?)");
    } finally {
      // Always clear local data
      localStorage.removeItem("userName");
      setUser(null);
      window.location.href = "/"; // Force redirect to login
    }
  }


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
                    <Button variant='secondary' onClick={() => logout()}>
                        Logout
                    </Button>
                </div>
            )}
        </nav>
        </header>

        <Routes>
            <Route 
            path="/" 
            element={
            <Login 
            user={user} 
            authState={authState} 
            onAuthChange={(user, authState) => {
                setAuthState(authState);
                setUser(user);
            }} />} exact />
            <Route path="/home" element={<Home user={user} />} />
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