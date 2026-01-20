'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginSchema, type LoginSchema } from '../schema';
import axios from '../../_utils/axios';
import { setAuthCookie } from '../../_utils/cookie';

export default function LoginForm() {
  const router = useRouter();
  const [data, setData] = useState<LoginSchema>({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [userType, setUserType] = useState<'influencer' | 'brand'>('influencer');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginSchema.safeParse(data);
    if (!result.success) {
      const zodErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path && err.path[0]) zodErrors[String(err.path[0])] = err.message;
      });
      setErrors(zodErrors);
      return;
    }

    try {
      const res = await axios.post('/api/auth/login', {
        email: data.email,
        password: data.password,
      });
      setAuthCookie(res.data.token, res.data.user);
      router.push(`/auth/dashboard?type=${userType}`);
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setErrors({ general: err.response.data.message });
      } else {
        setErrors({ general: 'Login failed. Please try again.' });
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="mb-4 text-center">
        <h3 className="text-2xl font-semibold">Sign in to InfluenceHub</h3>
        <p className="text-sm text-gray-500">Continue with your email or social account</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={() => setUserType('influencer')}
          className={`py-2 rounded ${userType === 'influencer' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}>
          Influencer
        </button>
        <button
          onClick={() => setUserType('brand')}
          className={`py-2 rounded ${userType === 'brand' ? 'bg-pink-500 text-white' : 'bg-gray-100'}`}>
          Brand
        </button>
      </div>

      {/* Social login buttons removed as requested */}
      </div>

      <div className="relative text-center my-3">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t my-0" />
        </div>
        <span className="relative bg-white px-3 text-xs text-gray-500">Or continue with email</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-gray-700 mb-1 block">Email</label>
          <input
            className="w-full px-4 py-2 border rounded"
            type="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            placeholder="you@domain.com"
          />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="text-sm text-gray-700 mb-1 block">Password</label>
          <div className="relative">
            <input
              className="w-full px-4 py-2 border rounded pr-10"
              type={showPassword ? 'text' : 'password'}
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              placeholder="••••••••"
            />
            <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500">
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" className="rounded border-gray-300" /> Remember me
          </label>
          <a href="#" className="text-sm text-purple-600">Forgot password?</a>
        </div>

        <button type="submit" className="w-full py-2 bg-purple-600 text-white rounded">Sign in</button>
      </form>

      <p className="text-xs text-center text-gray-500 mt-3">Don't have an account? <a href="/register" className="text-purple-600">Sign up</a></p>
    </div>
  );
}
