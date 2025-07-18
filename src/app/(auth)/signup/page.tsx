'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Apple, Eye, EyeOff, Facebook, Scale } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setEmailTouched(true);
    setEmailValid(validateEmail(value));
    if (!validateEmail(value)) {
      setShowPasswordField(false);
      setPassword('');
    }
  };

  const handleSignUp = async () => {
    if (!password) return;
    setLoading(true);
    await new Promise((res) => setTimeout(res, 1500));
    console.log('Signing up with:', { email, password });
    router.push('/verifyEmail');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (showPasswordField) {
      handleSignUp();
    } else if (emailValid) {
      setShowPasswordField(true);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-slate-800 relative"
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs"></div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 max-w-6xl mx-auto relative z-10">
        <div className="flex-1 text-center lg:text-left max-w-xl">
          <Scale className="w-20 h-20 text-white mb-8 mx-auto lg:mx-0" />
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Need Legal Help?
            <br />
            Get Matched
            <br />
            Instantly.
          </h1>
          <p className="text-xl text-gray-200 max-w-lg">
            Connect with verified legal professionals in your area or field — fast, secure, and AI-assisted.
          </p>
        </div>

        <div className="flex-1 max-w-md w-full">
          <div className="bg-white rounded-2xl py-6 px-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create an account</h2>
            <p className="text-gray-600 mb-4">Secure your access to legal support — anytime, anywhere.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!showPasswordField ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={() => setEmailTouched(true)}
                    className={`w-full ${
                      emailTouched
                        ? emailValid
                          ? 'border-yellow-400 focus:ring-yellow-400'
                          : 'border-red-500 focus:ring-red-500'
                        : ''
                    }`}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              ) : (
                <p className="text-sm font-medium text-gray-700 mb-1">{email}</p>
              )}

              {showPasswordField && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pr-10"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-4xl font-medium"
                disabled={showPasswordField ? !password : !emailValid || loading}
              >
                {loading ? 'Loading...' : showPasswordField ? 'Sign Up' : 'Continue'}
              </Button>

              <div className="text-center">
                <span className="text-gray-500">Already have an account? </span>
                <Link href="/login" className="text-blue-600 hover:underline font-medium">
                  Sign in
                </Link>
              </div>

              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button variant="outline" className="w-full py-3 border-gray-300">
                  Continue with Google
                </Button>
                <Button variant="outline" className="w-full py-3 border-gray-300">
                  <span className="mr-2">
                    <Facebook />
                  </span>
                  Continue with Facebook
                </Button>
                <Button variant="outline" className="w-full py-3 border-gray-300">
                  <span className="mr-2">
                    <Apple />
                  </span>
                  Continue with Apple
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                By signing up, you agree to our{' '}
                <Link href="/terms" className="underline">
                  Terms and Conditions of Use
                </Link>{' '}
                and our{' '}
                <Link href="/privacy" className="underline">
                  Privacy Policy
                </Link>
              </p>
            </form>
          </div>

          <div className="mt-6 flex items-center justify-center">
            <Button className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-400/30">
              I am a legal practitioner
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
