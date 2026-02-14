import Image from 'next/image';
import { Users, Briefcase } from 'lucide-react';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-[#f8fafc]">
            {/* Left Side: Hero Section */}
            <div className="hidden md:flex md:w-1/2 bg-white flex-col justify-center px-12 lg:px-24">
                <div className="max-w-md">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-12">
                        <div className="bg-white p-3 rounded-2xl shadow-md border border-slate-100">
                            <Image
                                src="/assets/logo.png"
                                alt="Collab Logo"
                                width={48}
                                height={48}
                                className="w-10 h-10 object-contain"
                            />
                        </div>
                        <span className="text-2xl font-black text-gradient tracking-tight">COLLAB</span>
                    </div>

                    <h1 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">
                        {title}
                    </h1>
                    <p className="text-lg text-slate-500 mb-12 leading-relaxed">
                        {subtitle}
                    </p>

                    {/* Features */}
                    <div className="space-y-8">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Users className="text-purple-600 w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900">Connect Authentically</h3>
                                <p className="text-sm text-slate-500 mt-1">Build meaningful partnerships with brands and creators that align with your values.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Briefcase className="text-pink-600 w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900">Streamlined Workflow</h3>
                                <p className="text-sm text-slate-500 mt-1">Manage campaigns, communications, and payments all in one platform.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Form Area */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-md bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
