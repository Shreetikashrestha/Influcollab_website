"use client";
import { useState, ChangeEvent, use } from "react";

export default function Page() {
    const [ username, setUsername] = useState("");
    const [ password, setPassword] = useState("");
    // Handler function
    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
        //e-event, target-input element, value-current input value
    }
    const handleSubmit = () => {
        const data = {
            username, password
        } // further logic like API call
        alert(`Username: ${username}, Password: ${password}`);
    }
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