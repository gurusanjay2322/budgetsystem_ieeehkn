import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import Button from "../components/Button";
import Input from "../components/Input";
import { Lock, Mail, ArrowRight } from "lucide-react";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { request } = useAxios();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // useAxios 'request' returns the data directly
      const data = await request({
        url: "/api/auth/login",
        method: "POST",
        data: formData
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.role);

      const role = data.role;
      if (role === "ADMIN") navigate("/admin");
      else if (role === "TREASURER") navigate("/treasurer");
      else navigate("/member");
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 overflow-hidden">
      
      {/* Left Panel - Hero Section */}
      <div className="hidden lg:flex relative bg-gradient-to-br from-slate-900 to-slate-800 flex-col items-center justify-center p-16 text-white overflow-hidden">
        
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="absolute top-10 left-10 w-64 h-64 bg-hkn-red rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
            <div className="absolute top-10 right-10 w-64 h-64 bg-hkn-gold rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
            <div className="absolute -bottom-8 left-20 w-64 h-64 bg-hkn-steel-blue rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10 max-w-lg text-center space-y-8 animate-enter">
            <div className="w-20 h-20 bg-gradient-to-br from-hkn-red to-red-600 rounded-2xl mx-auto shadow-2xl flex items-center justify-center mb-8 rotate-3 hover:rotate-6 transition-transform duration-500">
                <span className="text-4xl font-bold font-display">H</span>
            </div>
            
            <h1 className="text-5xl font-bold font-display leading-tight">
                Financial Management <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-hkn-gold to-yellow-300">Simplified.</span>
            </h1>
            
            <p className="text-lg text-slate-300 leading-relaxed">
                Streamline your organization's budget, track events, and manage automated reports with the new HKN financial dashboard.
            </p>

            <div className="flex gap-4 justify-center pt-8">
                <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-sm font-medium">
                    Automated Reports
                </div>
                <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-sm font-medium">
                    Real-time Tracking
                </div>
            </div>
        </div>
        
        {/* Glass Pattern overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex flex-col justify-center items-center p-6 md:p-12 relative">
        <div className="w-full max-w-md animate-slide-up bg-white/50 backdrop-blur-sm p-8 rounded-3xl border border-white/50 shadow-glass">
          
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-800 font-display mb-2">Welcome Back</h2>
            <p className="text-slate-500">Please enter your credentials to access the dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Username"
              name="username"
              type="text"
              icon={Mail}
              value={formData.username}
              onChange={handleChange}
              placeholder="e.g. admin"
              autoFocus
            />

            <div className="space-y-1">
                <Input
                label="Password"
                name="password"
                type="password"
                icon={Lock}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                />
                <div className="text-right">
                    <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline">Forgot password?</a>
                </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center gap-2 animate-shake">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {error}
              </div>
            )}

            <Button 
                type="submit" 
                className="w-full justify-center group" 
                size="lg"
                isLoading={isLoading}
            >
                Sign In
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            &copy; 2025 HKN Financial Manager. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
