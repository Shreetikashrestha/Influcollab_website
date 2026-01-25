"use client"; //client component
//user interaction/events and states
import { useState } from "react";

export default function Page() {
    const [count, setCount] = useState(1); //default value
    //count - state variable -actual value
    //setCount - function - to update the value
    //States: any value that can change over time
    //change in value re-renders the component

    const increment = () => {
        setCount(count + 1); //update the state variable 
    }
    return (
        //re-render when count changes
        <div>
            <div>
                Count: {count}
            </div>
            <button onClick={increment}>Plus</button>
            <button onClick={() => setCount(count - 1 )}>Minus</button>
            <button onClick={() => setCount(1)}>Reset</button>
        </div>
    );
}