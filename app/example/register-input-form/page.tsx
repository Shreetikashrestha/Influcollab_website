"use client";

import { useState } from "react";
import { useRegisterForm } from "./_components/register-form-task";


export default function RegisterForm() {

    const {username, handleUsernameChange, handleSubmit, password, confirmPassword, setPassword, handleSubmitValidation} = useRegisterForm();
    return (
        <div >
            <form onSubmit={handleSubmit} className="mx-auto max-w-md border p-4">
                <div className="m-2">
                <label>Email</label>
                <input type="email" className="w-full border p-2 border rounded"/>
            </div>

            <div className="m-2">
                <label>Username</label>
                <input type="text" value={username} onChange={handleUsernameChange}/>
            </div>

            <div className="m-2">
                <label>Password</label>
                <input type="password" value={password} 
                        onChange={ (e) => setPassword(e.target.value) }  
                        className="w-full border p-2 rounded" />
            </div>

            <div className="m-2">
                <label>Confirm Password</label>
                <input type="password" value={confirmPassword} 
                        onChange={ (e) => setPassword(e.target.value) }  // inline handler
                        className="w-full border p-2 rounded" />
            </div>

            <button className=" w-full bg-blue-500 text-white p-2 rounded" onClick={handleSubmitValidation}>
                Register
            </button>
            </form>
             
        </div>
    );
}