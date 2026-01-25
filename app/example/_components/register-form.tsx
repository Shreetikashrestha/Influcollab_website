import Link from "next/link";

export default function RegisterForm() {
    return (
        <div className="mx-auto max-w-md p-4, border rounded">
            <div className="m-2">
                <label>First Name</label>
                <input type="text" className="w-full border p-2 border rounded"/>
            </div>

            <div className="m-2">
                <label>Last Name</label>
                <input type="text" className="w-full border p-2 border rounded"/>
            </div>

            <div className="m-2">
                <label>Email</label>
                <input type="email" className="w-full border p-2 border rounded"/>
            </div>

            <div className="m-2">
                <label>Password</label>
                <input type="password" className="w-full border p-2 border rounded"/>
            </div>

            <div className="m-2">
                <label>Confirm Password</label>
                <input type="password" className="w-full border p-2 border rounded"/>
            </div>

            <button className=" w-full bg-blue-500 text-white p-2 rounded">
                Register
            </button>
            
            <div className="m-2 text-center">
                Already have an account?
                <Link href = "/example/register" className="text-blue-500 underline">
                Login
                </Link>
            </div>
        </div>
    );
}