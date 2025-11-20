import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import Button from 'react-bootstrap/Button';

export function Unauthenticated( { onLogin } ) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

async function loginUser() {
    loginOrCreate(`/api/auth/login`);
  }

  async function createUser() {
    loginOrCreate(`/api/auth/create`);
  }

  async function loginOrCreate(endpoint) {
    const response = await fetch(endpoint, {
      method: 'post',
      body: JSON.stringify({ email: username, password }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    if (response?.status === 200) {
      localStorage.setItem('userName', username);
      onLogin(username);
      navigate("/home");
    } else {
      const body = await response.json();
      setDisplayError(`⚠ Error: ${body.msg}`);
    }
    
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username.trim() && password.trim()) {
      handleLogin(username);
      navigate("/home");
    } else {
      alert("Please enter both username and password.");
    }

  }

    function handleLogin(username) {
        const newUser = { username };
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
    }

    return (
        <main>
      <div>
        <div>
          <div className="login-card">
            <h2 className="text-center mb-4">Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input type="text" className="form-control" id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" required />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" required />
              </div>
              <div className="d-grid">
                <Button variant='primary' onClick={() => loginUser()} disabled={!username || !password}>
                Login
                </Button>
                <Button variant='secondary' onClick={() => createUser()} disabled={!username || !password}>
                Create
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>  
    </main>
    );
}