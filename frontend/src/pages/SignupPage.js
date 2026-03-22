import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

const SignupPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      const user = await register(email, password, name);
      toast.success(`Welcome to The Skill Circuit, ${user.name}!`);
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" data-testid="signup-page">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-[#053d6c] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#053d6c] to-[#084a80]" />
        <img 
          src="https://images.unsplash.com/photo-1573164713619-24c711fe7878?w=1200"
          alt="Students collaborating"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center text-white">
            <h2 className="font-['Outfit'] text-4xl font-bold mb-4">
              Start Your Journey Today
            </h2>
            <p className="text-slate-300 text-lg max-w-md">
              Master industry-ready skills, transform your behavior, and achieve guaranteed career outcomes.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-8">
              <div className="w-10 h-10 rounded-lg bg-[#053d6c] flex items-center justify-center">
                <span className="text-white font-bold text-lg font-['Outfit']">SC</span>
              </div>
              <span className="font-['Outfit'] font-bold text-xl text-[#053d6c]">
                The Skill Circuit
              </span>
            </Link>
            <h1 className="font-['Outfit'] text-3xl font-bold text-[#053d6c] mb-2">
              Create Account
            </h1>
            <p className="text-slate-600">
              Join thousands of learners transforming their careers
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" data-testid="signup-form">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="input-styled pl-10"
                  data-testid="signup-name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-styled pl-10"
                  data-testid="signup-email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-styled pl-10 pr-10"
                  data-testid="signup-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-styled pl-10"
                  data-testid="signup-confirm-password"
                />
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" className="rounded border-slate-300 mt-1" required />
              <span className="text-sm text-slate-600">
                I agree to the{' '}
                <a href="#" className="text-[#f16a2f] hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-[#f16a2f] hover:underline">Privacy Policy</a>
              </span>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full btn-primary"
              data-testid="signup-submit"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <p className="mt-8 text-center text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="text-[#f16a2f] font-medium hover:underline" data-testid="login-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
