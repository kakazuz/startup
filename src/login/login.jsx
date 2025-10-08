import React from "react";
import "./login.css";

export function Login() {
    return (
        <main>
      <div>
        <div>
          <div className="login-card">
            <h2 className="text-center mb-4">Login</h2>
            <form method="post" action="/login">
              <div className="mb-3">
                <label for="username" className="form-label">Username</label>
                <input type="text" className="form-control" id="username" name="username" placeholder="Enter username" required />
              </div>
              <div className="mb-3">
                <label for="password" className="form-label">Password</label>
                <input type="password" className="form-control" id="password" name="password" placeholder="Enter password" required />
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-primary">Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>  
    </main>
    );
}