"use client"; // context is client
import { useState, useContext, createContext, ReactNode } from "react";
const MyContext = createContext<any>(null);
const MyContextProvider = ({ children }: { children: ReactNode }) => { 
    const count = 1;
    const [num, setNum] = useState(0);
    return (
        <MyContext.Provider value={{ count, num, setNum }}> 
            {children}
        </MyContext.Provider>
    );
}
export default function Page() {
    return (
        <div>
            <MyContextProvider>
                <ParentComponent/>
            </MyContextProvider>
        </div>
    );
}
export function ParentComponent(){
    const { count, num, setNum } = useContext(MyContext);
    return (
        <div>
            {count}
            <ChildComponent/>
        </div>
    )
}

export function ChildComponent(){
    const { num, setNum } = useContext(MyContext);
    return (
        <div>
            <button onClick={() => setNum(num + 1)}>Increment: {num}</button>
        </div>
    )
}