"use client";

import { use, useState } from "react";

export default function Page() {
    return (
        <div></div>
    );
}
function ParentComponent() {
    const count = 1;
    const [num, setNum] = useState(0);
    const title = "some title";
    
    return(
        <div>
            <button onClick={() => setNum(num + 1)}>Increment: {num}</button>
            <ChildComponent count = {count} num = {num} title={title} />
        </div>
    )
}

function ChildComponent(
    {count, num, title}: {count: number, num: number, title: string}  //props
){
    return(
        <div>Count: {count} {num}
            <GrandChildComponent title={title} />
        </div>
    );
}
interface Props{
    title: string;
}
function GrandChildComponent({title}: Props){
    return(
        <div>{title}</div>
    )
}