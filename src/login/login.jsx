import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

import { Unauthenticated } from './unauthenticated';
import { Authenticated } from './authenticated';
import { AuthState } from './authState';

export function Login( { userName, authState, onAuthChange} ) {
  
    return (
      <main>
        <div>
          {authState === AuthState.Authenticated && (
          <Authenticated userName={userName} onLogout={() => onAuthChange(userName, AuthState.Unauthenticated)} />
          )}
          {authState === AuthState.Unauthenticated && (
            <Unauthenticated
              onLogin={(loginUserName) => {
              onAuthChange(loginUserName, AuthState.Authenticated); 
              }}
            />
          )}
        </div>
      </main>
    );
}