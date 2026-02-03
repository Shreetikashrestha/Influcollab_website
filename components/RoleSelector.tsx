import { Users, Briefcase, Crown } from 'lucide-react';

interface RoleSelectorProps {
    selectedRole: 'Influencer' | 'Brand' | 'Admin';
    onChange: (role: 'Influencer' | 'Brand' | 'Admin') => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, onChange }) => {
    return (
        <div className="space-y-3 mb-8">
            <label className="text-sm font-medium text-slate-700">I am a:</label>
            <div className="grid grid-cols-3 gap-3">
                <button
                    onClick={() => onChange('Influencer')}
                    type="button"
                    className={`relative p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-2 group ${selectedRole === 'Influencer'
                        ? 'border-purple-500 bg-purple-50/50 shadow-sm'
                        : 'border-slate-100 hover:border-purple-200 hover:bg-slate-50'
                        }`}
                >
                    <div className={`p-2 rounded-xl transition-colors ${selectedRole === 'Influencer' ? 'bg-purple-100' : 'bg-slate-50 group-hover:bg-purple-50'
                        }`}>
                        <Users className={`w-6 h-6 ${selectedRole === 'Influencer' ? 'text-purple-600' : 'text-slate-400 group-hover:text-purple-500'
                            }`} />
                    </div>
                    <span className={`text-sm font-medium transition-colors ${selectedRole === 'Influencer' ? 'text-purple-900' : 'text-slate-500 group-hover:text-purple-700'
                        }`}>Influencer</span>
                </button>

                <button
                    onClick={() => onChange('Brand')}
                    type="button"
                    className={`relative p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-2 group ${selectedRole === 'Brand'
                        ? 'border-pink-500 bg-pink-50/50 shadow-sm'
                        : 'border-slate-100 hover:border-pink-200 hover:bg-slate-50'
                        }`}
                >
                    <div className={`p-2 rounded-xl transition-colors ${selectedRole === 'Brand' ? 'bg-pink-100' : 'bg-slate-50 group-hover:bg-pink-50'
                        }`}>
                        <Briefcase className={`w-6 h-6 ${selectedRole === 'Brand' ? 'text-pink-600' : 'text-slate-400 group-hover:text-pink-500'
                            }`} />
                    </div>
                    <span className={`text-sm font-medium transition-colors ${selectedRole === 'Brand' ? 'text-pink-900' : 'text-slate-500 group-hover:text-pink-700'
                        }`}>Brand</span>
                </button>

                <button
                    onClick={() => onChange('Admin')}
                    type="button"
                    className={`relative p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-2 group ${selectedRole === 'Admin'
                        ? 'border-indigo-500 bg-indigo-50/50 shadow-sm'
                        : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50'
                        }`}
                >
                    <div className={`p-2 rounded-xl transition-colors ${selectedRole === 'Admin' ? 'bg-indigo-100' : 'bg-slate-50 group-hover:bg-indigo-50'
                        }`}>
                        <Crown className={`w-6 h-6 ${selectedRole === 'Admin' ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500'
                            }`} />
                    </div>
                    <span className={`text-sm font-medium transition-colors ${selectedRole === 'Admin' ? 'text-indigo-900' : 'text-slate-500 group-hover:text-indigo-700'
                        }`}>Admin</span>
                </button>
            </div>
        </div>
    );
};

export default RoleSelector;
