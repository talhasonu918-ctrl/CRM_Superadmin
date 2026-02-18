
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, UtensilsCrossed, CheckCircle2, Moon, Sun } from 'lucide-react';
import { AuthMode } from '../../lib/types';
import toast from 'react-hot-toast';
import axiosInstance from '../../lib/axios';

interface AuthViewProps {
  mode: AuthMode;
  onSwitchMode: (mode: AuthMode) => void;
  onSuccess: (data: { email: string; password: string; name?: string; token?: string }) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ mode, onSwitchMode, onSuccess, isDarkMode, toggleTheme }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      if (mode === AuthMode.SIGNUP) {
        // Prepare registration data according to backend requirements
        const registerData = {
          fullName: data.name,
          email: data.email,
          password: data.password,
        };

        const response = await axiosInstance.post('auth/register', registerData);

        if (response.data?.isSuccess) {
          toast.success('Account created successfully!');
          const token = response.data?.data?.accessToken || response.data?.data?.token;
          onSuccess({ ...data, token });
        } else {
          toast.error(response.data?.message || 'Registration failed');
        }
      } else {
        // Login logic
        const response = await axiosInstance.post('auth/login', {
          email: data.email,
          password: data.password,
        });

        if (response.data?.isSuccess) {
          toast.success('Welcome back!');
          const token = response.data?.data?.accessToken || response.data?.data?.token;
          onSuccess({ ...data, token });
        } else {
          toast.error(response.data?.message || 'Invalid email or password');
        }
      }
    } catch (error: any) {
      console.error('Backend Auth Error (Full):', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
      
      // Try to extract the most descriptive message from the backend
      const responseData = error.response?.data;
      const errorMessage = responseData?.message || 
                         responseData?.error ||
                         (Array.isArray(responseData?.errors) ? responseData.errors[0] : null) ||
                         (typeof responseData === 'string' ? responseData : null) ||
                         'Registration failed. Please check your details.';
                         
      toast.error(errorMessage);
    }
  };

  const bgColor = isDarkMode ? 'bg-[#0F1115]' : 'bg-white';
  const inputBg = isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50';
  const inputBorder = isDarkMode ? 'border-slate-700' : 'border-slate-200';
  const textColor = isDarkMode ? 'text-slate-100' : 'text-slate-900';
  const subTextColor = isDarkMode ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className={`min-h-screen flex ${bgColor} transition-colors duration-300 relative`}>
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-8 right-8 z-50">
        <button 
          onClick={toggleTheme}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm ${
            isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-orange-400' : 'bg-slate-50 hover:bg-slate-100 text-slate-400'
          }`}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Left Side: Visual/Branding Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
        <img 
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 hover:scale-100 transition-transform duration-[10s]"
          alt="Premium Food"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/40 to-slate-900/80"></div>
        
        <div className="relative z-10 flex flex-col justify-between p-16 w-full text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <UtensilsCrossed size={20} className="text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter">Nexus<span className="text-orange-400">Food</span></span>
          </div>

          <div className="max-w-md">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl font-black leading-tight mb-6"
            >
              Master your <span className="text-orange-400">Kitchen</span> Operations.
            </motion.h2>
            <p className="text-lg text-slate-300 font-medium mb-8 leading-relaxed">
              Join thousands of restaurant owners managing orders, inventory, and staff with the most powerful CRM built for food professionals.
            </p>
            <div className="space-y-4">
              {[
                "Real-time order tracking",
                "Advanced inventory forecasting",
                "Seamless staff coordination"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-orange-400" />
                  <span className="text-sm font-bold text-slate-200">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            © 2025 NexusFood Global Systems
          </div>
        </div>
      </div>

      {/* Right Side: Authentication Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 relative">
        {/* Mobile Logo */}
        <div className="lg:hidden absolute top-8 left-8 flex items-center gap-2">
           <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-md">
              <UtensilsCrossed size={16} className="text-white" />
           </div>
           <span className="text-lg font-black tracking-tighter dark:text-white">NexusFood</span>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-10 text-center lg:text-left">
            <h1 className={`text-3xl font-extrabold tracking-tight mb-2 ${textColor}`}>
              {mode === AuthMode.LOGIN ? 'Sign In' : 'Get Started'}
            </h1>
            <p className={`${subTextColor} font-medium`}>
              {mode === AuthMode.LOGIN 
                ? 'Welcome back! Enter your details to access the dashboard.' 
                : 'Enter your credentials to create your restaurant account.'}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <AnimatePresence mode="wait">
              {mode === AuthMode.SIGNUP && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Admin Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      {...register('name', { required: 'Name is required' })}
                      type="text" 
                      placeholder="e.g. Gordon Ramsay"
                      className={`w-full pl-11 pr-4 py-3.5 rounded-xl border ${inputBorder} ${inputBg} outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium ${textColor}`}
                    />
                  </div>
                  {errors.name && <p className="text-[10px] text-rose-500 font-bold ml-1">{(errors.name as any).message}</p>}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Invalid email format"
                    }
                  })}
                  type="email" 
                  placeholder="admin@nexus-food.com"
                  className={`w-full pl-11 pr-4 py-3.5 rounded-xl border ${inputBorder} ${inputBg} outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium ${textColor}`}
                />
              </div>
              {errors.email && <p className="text-[10px] text-rose-500 font-bold ml-1">{(errors.email as any).message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                {mode === AuthMode.LOGIN && (
                  <button type="button" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Forgot?</button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Minimum 8 characters' },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message: "Must include Uppercase, Lowercase, Number & Special Character"
                    }
                  })}
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-12 py-3.5 rounded-xl border ${inputBorder} ${inputBg} outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium ${textColor}`}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-[10px] text-rose-500 font-bold ml-1">{(errors.password as any).message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-orange-600 disabled:opacity-50 text-white font-black py-4 rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-widest group active:scale-[0.98] mt-4"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {mode === AuthMode.LOGIN ? 'Sign In to Dashboard' : 'Create Admin Account'}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 dark:border-slate-800 text-center">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              {mode === AuthMode.LOGIN ? "Don't have an account?" : "Already managing a kitchen?"}
              <button 
                onClick={() => onSwitchMode(mode === AuthMode.LOGIN ? AuthMode.SIGNUP : AuthMode.LOGIN)}
                className="text-primary ml-2 hover:underline"
              >
                {mode === AuthMode.LOGIN ? 'Register Now' : 'Login Here'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
