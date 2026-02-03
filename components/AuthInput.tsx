import React, { useState } from 'react';
import { Eye, EyeOff, LucideIcon } from 'lucide-react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon: LucideIcon;
    error?: string;
    register?: any;
}

const AuthInput: React.FC<AuthInputProps> = ({ label, icon: Icon, error, type, register, ...props }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className="space-y-2 mb-4">
            <label className="text-sm font-medium text-slate-700 block">{label}</label>
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200">
                    <Icon className={`w-5 h-5 ${error ? 'text-red-400' : 'text-slate-400 group-focus-within:text-purple-500'}`} />
                </div>
                <input
                    type={inputType}
                    {...register}
                    {...props}
                    className={`w-full bg-slate-50 border transition-all duration-200 pl-12 pr-12 py-3.5 rounded-2xl text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white ${error
                            ? 'border-red-200 focus:border-red-500 bg-red-50/30'
                            : 'border-slate-100 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10'
                        }`}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                )}
            </div>
            {error && (
                <p className="text-xs font-medium text-red-500 mt-1 pl-1">{error}</p>
            )}
        </div>
    );
};

export default AuthInput;
