"use client";
import { useState, ChangeEvent, use } from "react";
import { useLoginForm } from "./hooks/use-login-form";

export default function Page() {
    //two ways to implement
    //Object recap
    //1. const obj = {"name": "John", "age": 30};
    //obj.name -> "John"
    //Destructuring (converts staring object to variables)
    //2. const {name, age} = obj;
    //name -> "John", age -> 30

    //1. Using custom hook from single object
    // const form = useLoginForm();

    //2. Destructuring the returned object from custom hook
    const {username, handleUsernameChange, handleSubmit, password, setPassword} = useLoginForm();
    //for this we have to remove form. i.e only username
    
    return (
        <div>
            <form onSubmit={handleSubmit} className="mx-auto max-w-md border p-4">
                <div className="m-2">
                    <label className="text-white">Username</label>
                    <input type="text" value={username} onChange={handleUsernameChange} 
                        className="w-full border p-2 rounded" />
                </div>
                <div className="m-2">
                    <label className="text-white">Password</label>
                    <input type="password" value={password} 
                        onChange={ (e) => setPassword(e.target.value) }  // inline handler
                        className="w-full border p-2 rounded" />
                </div>
                <button type="submit" className="m-2 w-full bg-blue-500 text-white p-2 rounded">
                    Submit
                </button>
            </form>
        </div>
    );
}