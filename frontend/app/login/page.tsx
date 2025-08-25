"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  User,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
    setError("");
    setSuccess("");
    setPasswordError("");
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include", // 👈 Important if using cookies for auth
        }
      );

      const data = await res.json();

      if (res.ok) {
        // router.push('/');
        window.location.href = "/";
      } else {
        setError(
          data.message || "Login failed. Please check your credentials."
        );
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPasswordError("");

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            name,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setSuccess("Account created successfully! You can now sign in.");
        setTimeout(() => {
          setIsLogin(true);
          resetForm();
        }, 2000);
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = isLogin ? handleLogin : handleSignup;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 relative overflow-hidden flex items-center justify-center p-4">
      {/* Growing Plants from Bottom */}
      <div className="absolute bottom-0 left-0 w-full h-32 overflow-hidden pointer-events-none">
        {Array.from({length: 15}).map((_, i) => (
          <div
            key={i}
            className="absolute bottom-0 text-2xl opacity-70"
            style={{
              left: `${i * 7}%`,
              animationDelay: `${i * 0.3}s`,
              animation: `growPlant ${3 + (i % 2)}s ease-out infinite`
            }}
          >
            {['🌱', '🌿', '🌾', '🌳', '🌲', '🌴'][i % 6]}
          </div>
        ))}
      </div>

      {/* Rain Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({length: 50}).map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-8 bg-gradient-to-b from-blue-200/30 to-transparent"
            style={{
              left: `${(i * 2) % 100}%`,
              animationDelay: `${(i * 0.1) % 5}s`,
              animationDuration: `${2 + (i % 3)}s`,
              animation: `rain ${2 + (i % 3)}s linear infinite`
            }}
          />
        ))}
      </div>

      {/* Agricultural Pattern Background */}
      <div className="absolute inset-0 opacity-10">
        {/* Spinning circles with hypnotic effect */}
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-green-300 rounded-full animate-spin" style={{animationDuration: '18s'}}></div>
        <div className="absolute top-1/3 right-16 w-36 h-36 border-2 border-emerald-300 rounded-full animate-spin" style={{animationDuration: '22s', animationDirection: 'reverse'}}></div>
        <div className="absolute bottom-20 left-32 w-40 h-40 border-2 border-teal-300 rounded-full animate-spin" style={{animationDuration: '15s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-20 h-20 border border-emerald-400 rounded-full animate-spin" style={{animationDuration: '20s', animationDirection: 'reverse'}}></div>
        <div className="absolute bottom-1/3 right-8 w-28 h-28 border-2 border-green-400 rounded-full animate-spin" style={{animationDuration: '16s'}}></div>
        
        {/* Ping animations with expanding circles */}
        <div className="absolute top-32 right-20 w-24 h-24 border border-emerald-300 rounded-full animate-ping" style={{animationDuration: '4s', animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-40 right-10 w-28 h-28 border border-green-300 rounded-full animate-ping" style={{animationDuration: '4s', animationDelay: '2s'}}></div>
        <div className="absolute top-20 left-1/3 w-22 h-22 border border-teal-400 rounded-full animate-ping" style={{animationDuration: '4s', animationDelay: '3s'}}></div>
        <div className="absolute bottom-16 left-16 w-26 h-26 border border-emerald-400 rounded-full animate-ping" style={{animationDuration: '4s', animationDelay: '1.5s'}}></div>
        
        {/* Floating elements - colored circles */}
        <div className="absolute top-20 right-1/3 w-16 h-16 bg-green-300 rounded-full opacity-8 animate-bounce" style={{animationDuration: '6s', animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-1/4 w-12 h-12 bg-teal-300 rounded-full opacity-8 animate-pulse" style={{animationDuration: '3s', animationDelay: '2s'}}></div>
        <div className="absolute top-40 left-20 w-14 h-14 bg-emerald-300 rounded-full opacity-6 animate-bounce" style={{animationDuration: '5s', animationDelay: '0.8s'}}></div>
        <div className="absolute bottom-24 right-1/4 w-18 h-18 bg-green-400 rounded-full opacity-7 animate-pulse" style={{animationDuration: '4s', animationDelay: '3.2s'}}></div>
        <div className="absolute top-2/3 right-12 w-10 h-10 bg-teal-400 rounded-full opacity-5 animate-bounce" style={{animationDuration: '7s', animationDelay: '1.8s'}}></div>
        
        {/* Enhanced leaf animations with varied durations */}
        <div className="absolute top-1/4 left-1/4 text-6xl text-green-300 opacity-20 animate-bounce" style={{animationDelay: '0.5s', animationDuration: '4s'}}>🌿</div>
        <div className="absolute top-3/4 right-1/4 text-5xl text-emerald-300 opacity-20 animate-pulse" style={{animationDelay: '1.5s', animationDuration: '3s'}}>🌱</div>
        <div className="absolute bottom-1/4 left-3/4 text-4xl text-teal-300 opacity-20 animate-bounce" style={{animationDelay: '2.5s', animationDuration: '5s'}}>🍃</div>
        <div className="absolute top-16 left-1/2 text-3xl text-green-400 opacity-15 animate-pulse" style={{animationDelay: '3s', animationDuration: '2s'}}>🌾</div>
        <div className="absolute bottom-16 right-1/3 text-5xl text-emerald-400 opacity-15 animate-bounce" style={{animationDelay: '4s', animationDuration: '6s'}}>🌳</div>
        
        {/* Additional plant emojis with unique animations */}
        <div className="absolute top-12 right-8 text-4xl text-green-500 opacity-18 animate-pulse" style={{animationDelay: '1.2s', animationDuration: '3.5s'}}>🌾</div>
        <div className="absolute bottom-8 left-8 text-6xl text-teal-400 opacity-16 animate-bounce" style={{animationDelay: '2.8s', animationDuration: '4.5s'}}>🌳</div>
        <div className="absolute top-1/3 left-8 text-3xl text-emerald-500 opacity-14 animate-pulse" style={{animationDelay: '0.7s', animationDuration: '2.8s'}}>🍀</div>
        <div className="absolute bottom-1/3 right-4 text-4xl text-green-600 opacity-17 animate-bounce" style={{animationDelay: '3.5s', animationDuration: '5.2s'}}>🌲</div>
        <div className="absolute top-2/3 left-1/3 text-5xl text-teal-500 opacity-19 animate-pulse" style={{animationDelay: '1.8s', animationDuration: '3.8s'}}>🌴</div>
      </div>
      
      {/* Moving gradient overlays */}
      <div className="absolute inset-0 opacity-5 animate-pulse" style={{animationDuration: '8s'}}>
        <div className="w-full h-full bg-gradient-to-r from-transparent via-green-200 to-transparent"></div>
      </div>
      <div className="absolute inset-0 opacity-4 animate-pulse" style={{animationDuration: '12s', animationDelay: '2s'}}>
        <div className="w-full h-full bg-gradient-to-l from-transparent via-emerald-200 to-transparent"></div>
      </div>
      <div className="absolute inset-0 opacity-3 animate-pulse" style={{animationDuration: '10s', animationDelay: '4s'}}>
        <div className="w-full h-full bg-gradient-to-br from-transparent via-teal-200 to-transparent"></div>
      </div>
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      <div className="w-full max-w-5xl flex bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[500px] animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 hover:shadow-3xl hover:scale-[1.02] transition-all duration-700 hover:rotate-1">
        {/* Left Panel - Branding */}
        <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 relative overflow-hidden">
          {/* Enhanced left panel animations */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 w-8 h-8 bg-white rounded-full animate-ping" style={{animationDelay: '1s', animationDuration: '3s'}}></div>
            <div className="absolute bottom-8 right-8 w-6 h-6 bg-white rounded-full animate-pulse" style={{animationDelay: '2s', animationDuration: '2.5s'}}></div>
            <div className="absolute top-1/2 right-4 w-4 h-4 bg-white rounded-full animate-bounce" style={{animationDuration: '4s', animationDelay: '0.5s'}}></div>
            <div className="absolute top-16 right-12 w-5 h-5 bg-white rounded-full animate-ping" style={{animationDelay: '3s', animationDuration: '4s'}}></div>
            <div className="absolute bottom-20 left-8 w-7 h-7 bg-white rounded-full animate-pulse" style={{animationDelay: '1.5s', animationDuration: '3.5s'}}></div>
            <div className="absolute top-1/3 left-6 w-3 h-3 bg-white rounded-full animate-bounce" style={{animationDuration: '5s', animationDelay: '2.5s'}}></div>
            <div className="absolute bottom-1/3 right-6 w-6 h-6 bg-white rounded-full animate-ping" style={{animationDelay: '4s', animationDuration: '3.2s'}}></div>
          </div>
          <div className="flex flex-col justify-center items-center text-white p-8">
            <div className="mb-4">
              <Image src="/cropcarelogo.png" alt="CropCare Logo" width={150} height={150} className="w-36 h-36 drop-shadow-2xl" />
            </div>
            <h1 className="text-3xl font-bold mb-3 text-center">CropCare</h1>
            <p className="text-sm text-center text-green-100 max-w-xs leading-relaxed mb-6">
              AI-powered plant disease detection platform
            </p>
            <div className="grid grid-cols-3 gap-4 text-center text-xs">
              <div>
                <div className="text-lg font-bold">99%</div>
                <div className="text-green-200">Accuracy</div>
              </div>
              <div>
                <div className="text-lg font-bold">50K+</div>
                <div className="text-green-200">Users</div>
              </div>
              <div>
                <div className="text-lg font-bold">24/7</div>
                <div className="text-green-200">Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full lg:w-3/5 p-8 flex items-center justify-center">
          <div
            className={`w-full max-w-sm transform transition-all duration-700 ease-out ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-6">
              <Image src="/cropcarelogo.png" alt="CropCare Logo" width={60} height={60} className="w-15 h-15 mx-auto mb-3" />
              <h1 className="text-2xl font-bold text-slate-800 mb-1">CropCare</h1>
              <p className="text-slate-600 text-sm">AI-Powered Plant Care</p>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-slate-600 text-sm">
                {isLogin
                  ? "Sign in to access your dashboard"
                  : "Join thousands of smart farmers"}
              </p>
            </div>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm animate-in slide-in-from-top-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm animate-in slide-in-from-top-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span>{success}</span>
                </div>
              )}

              {!isLogin && (
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (passwordError) setPasswordError("");
                      }}
                      className={`pl-10 pr-10 h-12 transition-all duration-200 ${
                        passwordError
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      }`}
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-red-600 text-sm mt-1">{passwordError}</p>
                  )}
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <Label htmlFor="remember" className="text-sm text-gray-600">
                      Remember me
                    </Label>
                  </div>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 pt-2">
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </div>
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    or continue with
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full h-12 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 font-medium"
                asChild
              >
                <Link href={`${process.env.NEXT_PUBLIC_API_BASE}/auth/google`}>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {isLogin ? "Sign in with Google" : "Sign up with Google"}
                </Link>
              </Button>

              <div className="text-center pt-2">
                <span className="text-gray-600">
                  {isLogin
                    ? "Don't have an account? "
                    : "Already have an account? "}
                </span>
                <button
                  type="button"
                  onClick={switchMode}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </div>
            </CardFooter>
          </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes rain {
          0% {
            transform: translateY(-100vh);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }
        @keyframes growPlant {
          0% {
            transform: translateY(100%) scale(0);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(-50px) scale(1);
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
}
