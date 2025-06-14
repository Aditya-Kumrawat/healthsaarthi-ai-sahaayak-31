import React, { useState } from 'react';
import { ArrowLeft, Mail, Phone, Eye, EyeOff, Shield, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { loginWithEmail, signUpWithEmail } from "@/utils/supabaseAuth";

interface AuthScreenProps {
  onBack: () => void;
  onAuthSuccess: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({
  onBack,
  onAuthSuccess
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    otp: ''
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSendOTP = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setOtpSent(true);
    setIsLoading(false);
    toast({
      title: "OTP Sent",
      description: `Verification code sent to your ${loginMethod}`
    });
  };

  const handleVerifyOTP = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    toast({
      title: "Success!",
      description: "Authentication successful"
    });
    onAuthSuccess();
  };

  const handlePasswordAuth = async () => {
    setIsLoading(true);
    let result: any;
    let errorMsg = "";
    if (loginMethod === "email") {
      if (authMode === "login") {
        result = await loginWithEmail(formData.email, formData.password);
        if (result.error) errorMsg = result.error.message;
      } else {
        if (formData.password !== formData.confirmPassword) {
          setIsLoading(false);
          toast({
            title: "Passwords do not match",
            description: "Please check your password and try again.",
            variant: "destructive",
          });
          return;
        }
        // Added log for debugging
        console.log("Signing up with:", {
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
        });
        result = await signUpWithEmail(formData.email, formData.password, formData.fullName);
        if (result.error) errorMsg = result.error.message;
      }
      setIsLoading(false);
      if (errorMsg) {
        toast({
          title: "Authentication Failed",
          description: errorMsg,
          variant: "destructive",
        });
      } else {
        if (authMode === "signup" && result.data.user && !result.data.session) {
          toast({
            title: "Verification Email Sent",
            description: "Check your email to verify and activate your account.",
          });
        } else {
          toast({
            title: "Success!",
            description:
              authMode === "login"
                ? "Login successful"
                : "Signup successful",
          });
          onAuthSuccess();
        }
      }
      return;
    } else {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsLoading(false);
      toast({
        title: "Success!",
        description: "Authentication successful"
      });
      onAuthSuccess();
      // Optionally you can implement phone auth with Supabase (if enabled in future)
    }
  };

  const features = ["Secure end-to-end encryption", "HIPAA compliant data protection", "24/7 customer support", "Multi-language support"];

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white p-0 lg:p-10">
      {/* Removed Test Image */}

      {/* Colorful BG image, rotated right, should be fully visible */}
      <img
        src="/lovable-uploads/c0a6c46d-2a68-4efa-922e-fb58bcda39a8.png"
        alt="Colorful background"
        className="
          fixed
          top-0
          left-0
          w-[170vw]
          h-[170vh]
          min-w-full
          min-h-full
          -rotate-12
          z-0
          opacity-100
          pointer-events-none
          select-none
          object-cover
        "
        draggable={false}
        style={{
          objectFit: 'cover',
        }}
      />

      {/* Remove or reduce overlay for debugging */}
      {/* <div className="absolute inset-0 z-10 pointer-events-none" style={{
        background: "linear-gradient(to top, rgba(255,255,255,0.66) 60%, rgba(255,255,255,0.24) 100%)",
        mixBlendMode: "lighten"
      }} /> */}

      {/* AuthCard + Branding/Features */}
      <div className="relative z-20 w-full max-w-6xl flex flex-col lg:flex-row gap-8 items-center justify-center">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:block flex-1 space-y-8">
          <div className="space-y-6">
            <Badge className="font-heading bg-accent/80 border-accent text-primary px-4 py-2 shadow-lg-glass">
              🔒 Secure Healthcare Platform
            </Badge>
            <h1 className="font-heading text-4xl font-bold text-primary leading-tight">
              Welcome to the Future of
              <span className="bg-gradient-to-r from-primary to-lavender-light bg-clip-text text-transparent"> Healthcare</span>
            </h1>
            <p className="font-poppins text-xl text-foreground/80">
              Join thousands of users who trust HealthSaarthi for their healthcare needs. 
              Secure, reliable, and always available.
            </p>
          </div>
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-sage-500" />
                <span className="text-sage-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Centered Auth Form, always centered on mobile+desktop */}
        <div className="flex-1 w-full max-w-md mx-auto flex flex-col items-center justify-center">
          <div className="glass-card shadow-lg-glass border-2 border-white/30 rounded-2xl p-0">
            <CardHeader className="pb-6 mt-6">
              <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={onBack} className="p-2 rounded-full hover:bg-accent/40">
                  <ArrowLeft className="w-5 h-5 text-primary font-bold" />
                </Button>
                <div className="flex flex-col items-center justify-center mx-auto">
                  <div className="w-10 h-10 flex items-center justify-center bg-primary rounded-xl shadow-lg-glass mb-1">
                    <Shield className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <span className="font-heading font-bold text-base text-primary text-center tracking-wide">
                    HealthSaarthi
                  </span>
                </div>
                <div className="w-9" /> {/* Spacer to balance the icon */}
              </div>
              <div className="text-center mt-2">
                <CardTitle className="font-heading text-2xl font-bold text-primary mb-2">
                  {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
                </CardTitle>
                <p className="font-mono text-muted-foreground text-lg">
                  {authMode === 'login' ? 'Sign in to access your health dashboard' : 'Join HealthSaarthi to get started'}
                </p>
              </div>
              <div className="flex bg-accent/50 rounded-xl p-1 mt-2">
                <Button 
                  variant={authMode === 'login' ? 'default' : 'ghost'} 
                  onClick={() => setAuthMode('login')} 
                  className={`w-1/2 font-heading ${authMode === 'login' ? 'bg-primary text-white' : 'bg-transparent text-primary'}`}
                >
                  Login
                </Button>
                <Button 
                  variant={authMode === 'signup' ? 'default' : 'ghost'} 
                  onClick={() => setAuthMode('signup')} 
                  className={`w-1/2 font-heading ${authMode === 'signup' ? 'bg-primary text-white' : 'bg-transparent text-primary'}`}
                >
                  Sign Up
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-2 pb-8">
              {authMode === 'signup' && <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sage-700 font-medium">Full Name</Label>
                  <Input id="fullName" type="text" placeholder="Enter your full name" value={formData.fullName} onChange={e => handleInputChange('fullName', e.target.value)} className="focus:ring-sage-500 focus:border-sage-500 glass-input" />
                </div>}

              <div className="flex bg-muted/60 rounded-lg p-1 font-heading">
                <Button 
                  variant={loginMethod === 'email' ? 'default' : 'outline'} 
                  onClick={() => setLoginMethod('email')}
                  className={`w-1/2 flex items-center justify-center gap-2 rounded-xl py-2 ${loginMethod === 'email' ? 'bg-primary text-white' : 'bg-transparent text-primary border-primary'}`}
                  aria-label="Email Login"
                >
                  <Mail className="w-5 h-5 text-primary font-bold" />
                  <span className="font-heading">Email</span>
                </Button>
                <Button 
                  variant={loginMethod === 'phone' ? 'default' : 'outline'} 
                  onClick={() => setLoginMethod('phone')}
                  className={`w-1/2 flex items-center justify-center gap-2 rounded-xl py-2 ${loginMethod === 'phone' ? 'bg-primary text-white' : 'bg-transparent text-primary border-primary'}`}
                  aria-label="Phone Login"
                >
                  <Phone className="w-5 h-5 text-primary font-bold" />
                  <span className="font-heading">Phone</span>
                </Button>
              </div>

              {/* Email/Phone Input */}
              <div className="space-y-2">
                <Label className="text-sage-700 font-medium">
                  {loginMethod === 'email' ? 'Email Address' : 'Phone Number'}
                </Label>
                <Input type={loginMethod === 'email' ? 'email' : 'tel'} placeholder={loginMethod === 'email' ? 'Enter your email' : 'Enter your phone number'} value={loginMethod === 'email' ? formData.email : formData.phone} onChange={e => handleInputChange(loginMethod, e.target.value)} className="focus:ring-sage-500 focus:border-sage-500 glass-input" />
              </div>

              {/* Password Input (for email login/signup) */}
              {loginMethod === 'email' && <div className="space-y-2">
                  <Label className="text-sage-700 font-medium">Password</Label>
                  <div className="relative">
                    <Input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={formData.password} onChange={e => handleInputChange('password', e.target.value)} className="focus:ring-sage-500 focus:border-sage-500 pr-10 glass-input" />
                    <Button type="button" variant="ghost" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 h-auto">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>}

              {/* Confirm Password (for signup) */}
              {authMode === 'signup' && loginMethod === 'email' && <div className="space-y-2">
                  <Label className="text-sage-700 font-medium">Confirm Password</Label>
                  <Input type="password" placeholder="Confirm your password" value={formData.confirmPassword} onChange={e => handleInputChange('confirmPassword', e.target.value)} className="focus:ring-sage-500 focus:border-sage-500 glass-input" />
                </div>}

              {/* OTP Input (for phone auth) */}
              {loginMethod === 'phone' && otpSent && <div className="space-y-2">
                  <Label className="text-sage-700 font-medium">Verification Code</Label>
                  <Input type="text" placeholder="Enter 6-digit OTP" value={formData.otp} onChange={e => handleInputChange('otp', e.target.value)} className="focus:ring-sage-500 focus:border-sage-500 text-center text-lg tracking-widest glass-input" maxLength={6} />
                  <p className="text-sm text-sage-600 text-center">
                    Didn't receive the code? 
                    <Button variant="link" className="text-sage-700 p-0 ml-1 h-auto">
                      Resend
                    </Button>
                  </p>
                </div>}

              {/* Submit Button */}
              <div className="space-y-4">
                {loginMethod === 'phone' && !otpSent ? <Button onClick={handleSendOTP} disabled={isLoading} className="w-full btn-primary">
                    {isLoading ? <span className="loading-dots">Sending OTP</span> : 'Send Verification Code'}
                  </Button> : loginMethod === 'phone' && otpSent ? <Button onClick={handleVerifyOTP} disabled={isLoading || formData.otp.length !== 6} className="w-full btn-primary">
                    {isLoading ? <span className="loading-dots">Verifying</span> : 'Verify & Continue'}
                  </Button> : <Button onClick={handlePasswordAuth} disabled={isLoading} className="w-full btn-primary">
                    {isLoading ? <span className="loading-dots">
                        {authMode === 'login' ? 'Signing In' : 'Creating Account'}
                      </span> : authMode === 'login' ? 'Sign In' : 'Create Account'}
                  </Button>}

                {authMode === 'login' && loginMethod === 'email' && <Button variant="link" className="w-full text-sage-600 hover:text-sage-800">
                    Forgot your password?
                  </Button>}
              </div>

              {/* Terms */}
              {authMode === 'signup' && <p className="text-xs text-sage-600 text-center leading-relaxed">
                  By creating an account, you agree to our{' '}
                  <a href="#" className="text-sage-700 hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-sage-700 hover:underline">Privacy Policy</a>
                </p>}
            </CardContent>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
