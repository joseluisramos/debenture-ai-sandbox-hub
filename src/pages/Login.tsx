
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleDemo = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex w-full max-w-4xl shadow-lg rounded-lg overflow-hidden">
        {/* Left side with burgundy background */}
        <div className="hidden md:block w-1/2 bg-[#6b0d0d] text-white p-8 flex flex-col justify-between">
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            <div className="bg-[#8b2121] p-6 rounded-lg w-60 h-24 flex items-center justify-center mb-4">
              <div className="text-white text-3xl font-serif">GSB</div>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">Gibraltar Savings Bank</h1>
              <p className="text-sm">Est. 1882</p>
            </div>
            <div className="mt-12 text-center">
              <h2 className="text-xl font-medium mb-4">Welcome to your online banking portal</h2>
              <p className="text-sm">
                Access your accounts, track investments, and manage your finances securely.
              </p>
            </div>
          </div>
        </div>

        {/* Right side with login form */}
        <div className="w-full md:w-1/2 bg-white p-8 md:p-12">
          <div className="max-w-sm mx-auto">
            <h2 className="text-2xl font-bold text-[#6b0d0d] mb-6">Sign In</h2>
            <p className="text-gray-600 mb-8">Enter your credentials to access your account</p>
            
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 rounded border-gray-300 text-[#6b0d0d] focus:ring-[#6b0d0d]"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              
              <Button 
                type="button" 
                className="w-full bg-[#6b0d0d] hover:bg-[#8b2121]"
                disabled
              >
                Sign In
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="w-full border-[#6b0d0d] text-[#6b0d0d] hover:bg-[#6b0d0d] hover:text-white"
                onClick={handleDemo}
              >
                <Eye className="mr-2 h-4 w-4" />
                Try Demo (no signup)
              </Button>
            </form>
            
            <div className="mt-8 text-center text-sm">
              <span className="text-gray-600">Don't have an account? </span>
              <button className="text-[#6b0d0d] font-medium hover:underline">
                Create account
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="fixed bottom-4 right-4">
        <div className="bg-[#6b0d0d] text-white py-2 px-4 rounded-full flex items-center">
          <span className="mr-2">GSB Virtual Assistant</span>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
