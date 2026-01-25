import { useState, ChangeEvent } from "react";

export function useRegisterForm(){
    const [ username, setUsername] = useState("");
    const [ email, setEmail] = useState("");
    const [ password, setPassword] = useState("");
    const [ confirmPassword, setconfirmPassword] = useState("");
        // Handler function
        const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
            setUsername(e.target.value);
        
        }
    
        const handleSubmit = () => {
            const data = {
                username, password
            } 
            alert(`Username: ${username}, Password: ${password}`);
        }

        //create handle submit function that validates eaach field is filled
        const handleSubmitValidation = () => {
            if(!email || !username || !password || !confirmPassword){
                alert("All fields required");
                return;
            }
            if(password !== confirmPassword){
                alert("Passwords do not match");
                return;
            }
            alert("registration success");
        }

        return{
            username, password,
            confirmPassword,  
            setUsername, setPassword,
            handleUsernameChange, handleSubmit, handleSubmitValidation 
        }
        
}