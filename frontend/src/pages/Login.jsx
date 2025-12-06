import { useState } from "react";
import useAxios from "../hooks/useAxios";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import Card from "../components/Card";
import { ShieldCheck, Sparkles } from "lucide-react";

export default function Login() {
  const { request, loading, error } = useAxios();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await request({
        url: "/api/auth/login",
        method: "POST",
        data: credentials,
      });

      console.log("🔑 Full token received:", res.token);
      console.log("🔑 Token length:", res.token?.length);
      console.log("🔑 Token periods count:", (res.token?.match(/\./g) || []).length);
      
      localStorage.setItem("token", res.token);
      localStorage.setItem("role", res.role);
      localStorage.setItem("username", credentials.username);
      
      // Verify token was stored correctly
      const storedToken = localStorage.getItem("token");
      console.log("✅ Token stored, length:", storedToken?.length);
      console.log("✅ Stored token periods:", (storedToken?.match(/\./g) || []).length);

      if (res.role === "ADMIN") navigate("/admin");
      else if (res.role === "TREASURER") navigate("/treasurer");
      else navigate("/member");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Left Side - Branding */}
      <div className="md:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-10 text-white relative overflow-hidden slide-in-left">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 border-4 border-hkn-gold rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 border-4 border-hkn-red rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="z-10 text-center scale-in">
          <div className="w-24 h-24 bg-gradient-to-br from-hkn-gold to-yellow-500 rounded-2xl flex items-center justify-center text-slate-900 font-bold text-5xl mb-6 mx-auto shadow-2xl shadow-hkn-gold/30 transform hover:scale-110 transition-transform duration-300">
            B
          </div>
          <h1 className="text-5xl font-bold mb-3 tracking-wide">Smart Budget</h1>
          <p className="text-xl text-slate-300 font-light flex items-center justify-center gap-2">
            <Sparkles size={20} className="text-hkn-gold" />
            IEEE-HKN Chapter Operations
          </p>
          <div className="mt-12 max-w-md text-sm text-slate-400 leading-relaxed fade-in" style={{ animationDelay: '0.3s' }}>
            "Design a smart, user-friendly tool that helps chapters plan their yearly budget, manage real-time expenses, track funding deadlines, and visualize spending trends."
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="md:w-1/2 flex items-center justify-center p-6 slide-in-right">
        <Card hover={false} className="w-full max-w-md p-10 shadow-2xl border-t-4 border-t-hkn-red scale-in">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-red-50 rounded-xl">
              <ShieldCheck className="text-hkn-red" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              label="Username"
              type="text"
              value={credentials.username}
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
              placeholder="Enter your username"
              required
            />

            <Input
              label="Password"
              type="password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              placeholder="Enter your password"
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3.5 text-lg"
              loading={loading}
            >
              {loading ? "Authenticating..." : "Login to Dashboard"}
            </Button>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2 fade-in">
                <span className="font-bold">Error:</span> {error.message || "Login failed"}
              </div>
            )}
          </form>

          <div className="mt-8 text-center text-xs text-slate-400">
            &copy; 2025 IEEE-HKN Budget Hack
          </div>
        </Card>
      </div>
    </div>
  );
}
