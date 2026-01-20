'use client'

import { useState } from 'react'
import { Users, Briefcase, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { loginSchema, registerSchema } from '../schema'

type UserType = 'influencer' | 'brand'

interface CollabAuthProps {
  initialMode?: 'login' | 'signup'
}

export default function CollabAuth({ initialMode = 'login' }: CollabAuthProps) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login')
  const [userType, setUserType] = useState<UserType>('influencer')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', password: '', rememberMe: false })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  const validateForm = () => {
    // Use Zod for validation depending on mode
    try {
      if (isLogin) {
        const res = loginSchema.parse({ email: formData.email, password: formData.password })
        setErrors({})
        return true
      } else {
        const res = registerSchema.parse({ name: formData.name, email: formData.email, password: formData.password })
        setErrors({})
        return true
      }
    } catch (err: any) {
      // ZodError
      const zodErrors: Record<string, string> = {}
      if (err?.issues && Array.isArray(err.issues)) {
        err.issues.forEach((issue: any) => {
          const path = issue.path?.[0]
          if (path) zodErrors[String(path)] = issue.message
        })
      }
      setErrors(zodErrors)
      return false
    }
  }

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!validateForm()) return

    // For sprint 1: navigate to dashboard. In real app, you'd call your API here.
    router.push(`/auth/dashboard?type=${userType}`)
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-600 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left */}
        <div className="bg-linear-to-br from-purple-50 to-pink-50 p-12 flex flex-col justify-center">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-linear-to-br from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Collab</h1>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome to the Future of Influencer Marketing</h2>
            <p className="text-lg text-gray-700 mb-8">Join thousands of brands and influencers creating authentic partnerships and measurable results.</p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Connect Authentically</h3>
                <p className="text-sm text-gray-700">Build meaningful partnerships with brands and creators that align with your values</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Streamlined Workflow</h3>
                <p className="text-sm text-gray-700">Manage campaigns, communications, and payments all in one platform</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="p-12 flex flex-col justify-center">
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={isLogin ? 'flex-1 py-3 px-6 rounded-xl font-semibold transition-all bg-linear-to-r from-purple-600 to-pink-500 text-white shadow-lg' : 'flex-1 py-3 px-6 rounded-xl font-semibold transition-all bg-gray-100 text-gray-700 hover:bg-gray-200'}>
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={!isLogin ? 'flex-1 py-3 px-6 rounded-xl font-semibold transition-all bg-linear-to-r from-purple-600 to-pink-500 text-white shadow-lg' : 'flex-1 py-3 px-6 rounded-xl font-semibold transition-all bg-gray-100 text-gray-700 hover:bg-gray-200'}>
              Sign Up
            </button>
          </div>

          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">I am a:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setUserType('influencer')}
                className={`p-4 rounded-xl border-2 transition-all ${userType === 'influencer' ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <Users className={`w-6 h-6 mx-auto mb-2 ${userType === 'influencer' ? 'text-purple-600' : 'text-gray-400'}`} />
                <span className={`font-semibold ${userType === 'influencer' ? 'text-purple-600' : 'text-gray-700'}`}>Influencer</span>
              </button>

              <button
                onClick={() => setUserType('brand')}
                className={`p-4 rounded-xl border-2 transition-all ${userType === 'brand' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <Briefcase className={`w-6 h-6 mx-auto mb-2 ${userType === 'brand' ? 'text-pink-500' : 'text-gray-400'}`} />
                <span className={`font-semibold ${userType === 'brand' ? 'text-pink-500' : 'text-gray-700'}`}>Brand</span>
              </button>
            </div>
          </div>

          {/* Social login buttons removed as requested */}

          <div className="relative text-center my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <span className="relative bg-white px-4 text-sm text-gray-500">Or continue with email</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input type="text" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="Enter your full name" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors" />
                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="Enter your email" className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors" />
              </div>
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} placeholder="Enter your password" className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
              </div>
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
            </div>

            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={formData.rememberMe} onChange={(e) => handleInputChange('rememberMe', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" /> <span className="text-sm text-gray-700">Remember me</span></label>
                <a href="#" className="text-sm text-purple-600 hover:text-purple-700 font-medium">Forgot password?</a>
              </div>
            )}

            <button type="submit" className="w-full py-3 bg-linear-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all">{isLogin ? 'Login' : 'Create Account'}</button>
          </form>

          <p className="text-center text-sm text-gray-700 mt-6">{isLogin ? "Don't have an account? " : "Already have an account? "}<button onClick={() => setIsLogin(!isLogin)} className="text-purple-600 hover:text-purple-700 font-semibold">{isLogin ? 'Sign up' : 'Sign in'}</button></p>
        </div>
      </div>
    </div>
  )
}
