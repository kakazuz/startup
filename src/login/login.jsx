import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

import { Unauthenticated } from './unauthenticated';
// import { Authenticated } from './authenticated';
import { AuthState } from './authState';

export function Login( { onLogin, authState} ) {
  
    return (
      <main>
        <div>
          {authState === AuthState.unauthenticated && (
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