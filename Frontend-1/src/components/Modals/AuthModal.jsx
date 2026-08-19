import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Circle,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Briefcase,
  Calendar,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Logo } from '../Logo';
import { useAuth } from '../../context/AuthContext';

export const AuthModal = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onAuthSuccess,
}) => {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState(initialMode);

  // Touch / Pointer reactive border glow state
  const [glowPos, setGlowPos] = useState({ x: 250, y: 50, opacity: 0.6 });
  const [isCardTouched, setIsCardTouched] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [educationQualification, setEducationQualification] = useState('');
  const [occupation, setOccupation] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // API submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // Field validation states
  const [fieldErrors, setFieldErrors] = useState({
    fullName: '',
    age: '',
    occupation: '',
    educationQualification: '',
    email: '',
    password: '',
  });

  // Validation helper functions
  const validateEmail = (emailStr) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailStr.trim()) return 'Email is required';
    if (!emailRegex.test(emailStr)) return 'Please enter a valid email address';
    return '';
  };

  const validateFullName = (name) => {
    if (!name.trim()) return 'Full name is required';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    if (name.trim().length > 50) return 'Name must not exceed 50 characters';
    if (!/^[a-zA-Z\s'-]+$/.test(name)) return 'Name can only contain letters, spaces, hyphens, and apostrophes';
    return '';
  };

  const validateAge = (ageStr) => {
    if (!ageStr) return 'Age is required';
    const ageNum = parseInt(ageStr, 10);
    if (isNaN(ageNum)) return 'Age must be a number';
    if (ageNum < 1 || ageNum > 119) return 'Age must be between 1 and 119';
    return '';
  };

  const validateOccupation = (occ) => {
    if (!occ.trim()) return 'Occupation is required';
    if (occ.trim().length < 2) return 'Occupation must be at least 2 characters';
    if (occ.trim().length > 100) return 'Occupation must not exceed 100 characters';
    return '';
  };

  const validateEducation = (edu) => {
    if (!edu.trim()) return 'Education qualification is required';
    if (edu.trim().length < 2) return 'Education must be at least 2 characters';
    if (edu.trim().length > 150) return 'Education must not exceed 150 characters';
    return '';
  };

  const validatePassword = (pwd) => {
    if (!pwd) return 'Password is required';
    if (pwd.length < 8) return 'Password must be at least 8 characters';
    return '';
  };

  // Update field and validate
  const handleFieldChange = (fieldName, value) => {
    let error = '';

    if (fieldName === 'fullName') {
      setFullName(value);
      if (mode === 'signup') error = validateFullName(value);
    } else if (fieldName === 'age') {
      setAge(value);
      if (mode === 'signup') error = validateAge(value);
    } else if (fieldName === 'occupation') {
      setOccupation(value);
      if (mode === 'signup') error = validateOccupation(value);
    } else if (fieldName === 'educationQualification') {
      setEducationQualification(value);
      if (mode === 'signup') error = validateEducation(value);
    } else if (fieldName === 'email') {
      setEmail(value);
      error = validateEmail(value);
    } else if (fieldName === 'password') {
      setPassword(value);
      error = validatePassword(value);
    }

    setFieldErrors((prev) => ({ ...prev, [fieldName]: error }));
  };

  // Sync mode with initialMode when modal opens
  useEffect(() => {
    setMode(initialMode);
    setFormError(null);
  }, [initialMode, isOpen]);

  const handlePointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setGlowPos({ x, y, opacity: 1 });
  };

  const handleTouchStart = (e) => {
    setIsCardTouched(true);
    if (e.touches && e.touches[0]) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;
      setGlowPos({ x, y, opacity: 1 });
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;
      setGlowPos({ x, y, opacity: 1 });
    }
  };

  if (!isOpen) return null;

  // Dynamic Password Validation
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    // Validate all fields before submission
    const errors = {};
    
    if (mode === 'signup') {
      errors.fullName = validateFullName(fullName);
      errors.age = validateAge(age);
      errors.occupation = validateOccupation(occupation);
      errors.educationQualification = validateEducation(educationQualification);
      errors.email = validateEmail(email);
      errors.password = validatePassword(password);

      // Check password strength
      if (!errors.password) {
        if (password.length < 8) errors.password = 'Password must be at least 8 characters';
      }

      // Additional checks
      if (!errors.password) {
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        if (!hasNumber || !hasSpecialChar) {
          errors.password = 'Password must contain at least 1 number and 1 special character';
        }
      }
    } else {
      errors.email = validateEmail(email);
      errors.password = validatePassword(password);
    }

    // Show first field error found
    const firstError = Object.values(errors).find((err) => err);
    if (firstError) {
      setFieldErrors(errors);
      setFormError(firstError);
      return;
    }

    setIsSubmitting(true);

    try {
      let loggedInUser;
      if (mode === 'signup') {
        loggedInUser = await signup({
          name: fullName.trim(),
          age: parseInt(age, 10),
          occupation: occupation.trim(),
          education_qualification: educationQualification.trim(),
          email: email.trim(),
          password,
        });
      } else {
        loggedInUser = await login({
          email: email.trim(),
          password,
        });
      }

      if (onAuthSuccess) {
        onAuthSuccess(loggedInUser);
      }
      onClose();
    } catch (err) {
      console.error('Auth error:', err);
      setFormError(err.message || 'An error occurred during authentication.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTabChange = (newMode) => {
    setMode(newMode);
    setFormError(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#030712]/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 md:p-10 animate-in fade-in duration-200">
      {/* Top Left: Back to Home button */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-start">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 font-mono text-sm text-[#94a3b8] hover:text-[#f4f4f5] transition-colors cursor-pointer group py-2"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Center: Auth Card with Touch Reactive Border Glow */}
      <div className="w-full max-w-[500px] mx-auto my-auto relative py-4">
        {/* Subtle Ambient Cyan Top Glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-24 bg-[#38bdf8]/20 rounded-full blur-3xl pointer-events-none" />

        <div
          onPointerMove={handlePointerMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => setIsCardTouched(false)}
          className={`relative bg-[#08101d] border rounded-2xl p-6 sm:p-8 transition-all duration-300 overflow-hidden ${
            isCardTouched
              ? 'border-[#38bdf8] shadow-[0_0_50px_rgba(56,189,248,0.3),0_10px_40px_rgba(0,0,0,0.9)]'
              : 'border-[#1b2b3f] hover:border-[#38bdf8]/70 shadow-[0_10px_40px_rgba(0,0,0,0.8),0_-1px_20px_rgba(47,217,244,0.15)] hover:shadow-[0_0_35px_rgba(56,189,248,0.25)]'
          }`}
        >
          {/* Dynamic Touch / Cursor Coordinate Border & Glow Illumination Overlay */}
          <div
            className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-200"
            style={{
              opacity: glowPos.opacity,
              background: `radial-gradient(350px circle at ${glowPos.x}px ${glowPos.y}px, rgba(56, 189, 248, 0.18), transparent 75%)`,
            }}
          />

          {/* Glowing Border Edge Follower */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl border border-[#38bdf8]/40 transition-opacity duration-200"
            style={{
              opacity: glowPos.opacity,
              maskImage: `radial-gradient(220px circle at ${glowPos.x}px ${glowPos.y}px, black 30%, transparent 100%)`,
              WebkitMaskImage: `radial-gradient(220px circle at ${glowPos.x}px ${glowPos.y}px, black 30%, transparent 100%)`,
            }}
          />

          {/* Top Segmented Tab Switcher (Log In / Sign Up) */}
          <div className="relative z-10 bg-[#050b14] p-1 rounded-xl border border-[#142234] grid grid-cols-2 gap-1.5 mb-6 shadow-inner">
            <button
              type="button"
              onClick={() => handleTabChange('login')}
              className={`py-2.5 text-xs sm:text-sm font-mono font-bold rounded-lg transition-all duration-200 cursor-pointer active:scale-95 touch-manipulation flex items-center justify-center gap-1.5 ${
                mode === 'login'
                  ? 'bg-[#0e1f33] text-[#38bdf8] border border-[#38bdf8]/60 shadow-[0_0_18px_rgba(56,189,248,0.3)] font-semibold'
                  : 'text-[#94a3b8] hover:text-[#f4f4f5] border border-transparent hover:border-[#1e293b]'
              }`}
            >
              <span>Log In</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('signup')}
              className={`py-2.5 text-xs sm:text-sm font-mono font-bold rounded-lg transition-all duration-200 cursor-pointer active:scale-95 touch-manipulation flex items-center justify-center gap-1.5 ${
                mode === 'signup'
                  ? 'bg-[#0e1f33] text-[#38bdf8] border border-[#38bdf8]/60 shadow-[0_0_18px_rgba(56,189,248,0.3)] font-semibold'
                  : 'text-[#94a3b8] hover:text-[#f4f4f5] border border-transparent hover:border-[#1e293b]'
              }`}
            >
              <span>Sign Up</span>
            </button>
          </div>

          {/* Logo / Badge */}
          <div className="relative z-10 flex justify-center mb-4">
            <div className="p-2 rounded-2xl bg-[#050b14]/80 border border-[#38bdf8]/30 shadow-[0_0_20px_rgba(56,189,248,0.2)]">
              <Logo size="lg" showText={false} />
            </div>
          </div>

          {/* Headline & Description */}
          <div className="relative z-10 text-center mb-6 space-y-1.5">
            <h2
              className="text-xl sm:text-2xl font-bold text-[#f4f4f5] tracking-tight"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              {mode === 'signup' ? 'Create your LucyChat account' : 'Welcome back to LucyChat'}
            </h2>
            <p className="text-xs sm:text-sm text-[#94a3b8] max-w-sm mx-auto leading-relaxed">
              {mode === 'signup'
                ? 'Join to reason across documents, datasets, vision charts, and code.'
                : 'Sign in to access your context documents and workspaces.'}
            </p>
          </div>

          {/* Form Error Banner */}
          {formError && (
            <div className="relative z-10 mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span className="leading-snug">{formError}</span>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="relative z-10 space-y-3.5">
            {mode === 'signup' && (
              <>
                {/* 1. Name */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-[#94a3b8]">Full Name</label>
                  <div className="relative flex items-center group">
                    <User className="w-4 h-4 text-[#64748b] group-focus-within:text-[#38bdf8] absolute left-3.5 pointer-events-none transition-colors" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => handleFieldChange('fullName', e.target.value)}
                      placeholder="e.g. Alex Vance"
                      className={`w-full bg-[#070e1a] border rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#f4f4f5] placeholder:text-[#475569] focus:outline-none focus:ring-1 focus:shadow-[0_0_20px_rgba(56,189,248,0.25)] hover:active:border-[#38bdf8] transition-all font-sans ${
                        fieldErrors.fullName
                          ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/30'
                          : 'border-[#1a2b40] focus:border-[#38bdf8] focus:ring-[#38bdf8]/50 hover:border-[#38bdf8]/50'
                      }`}
                    />
                  </div>
                  {fieldErrors.fullName && (
                    <p className="text-[10px] text-rose-400 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {fieldErrors.fullName}
                    </p>
                  )}
                </div>

                {/* 2. Age & 3. Occupation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Age */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono text-[#94a3b8]">Age</label>
                    <div className="relative flex items-center group">
                      <Calendar className="w-4 h-4 text-[#64748b] group-focus-within:text-[#38bdf8] absolute left-3.5 pointer-events-none transition-colors" />
                      <input
                        type="number"
                        required
                        min="1"
                        max="119"
                        value={age}
                        onChange={(e) => handleFieldChange('age', e.target.value)}
                        placeholder="e.g. 26"
                        className={`w-full bg-[#070e1a] border rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#f4f4f5] placeholder:text-[#475569] focus:outline-none focus:ring-1 focus:shadow-[0_0_20px_rgba(56,189,248,0.25)] hover:active:border-[#38bdf8] transition-all font-sans ${
                          fieldErrors.age
                            ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/30'
                            : 'border-[#1a2b40] focus:border-[#38bdf8] focus:ring-[#38bdf8]/50 hover:border-[#38bdf8]/50'
                        }`}
                      />
                    </div>
                    {fieldErrors.age && (
                      <p className="text-[10px] text-rose-400 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" />
                        {fieldErrors.age}
                      </p>
                    )}
                  </div>

                  {/* Occupation */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono text-[#94a3b8]">Occupation</label>
                    <div className="relative flex items-center group">
                      <Briefcase className="w-4 h-4 text-[#64748b] group-focus-within:text-[#38bdf8] absolute left-3.5 pointer-events-none transition-colors" />
                      <input
                        type="text"
                        required
                        value={occupation}
                        onChange={(e) => handleFieldChange('occupation', e.target.value)}
                        placeholder="e.g. AI Researcher"
                        className={`w-full bg-[#070e1a] border rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#f4f4f5] placeholder:text-[#475569] focus:outline-none focus:ring-1 focus:shadow-[0_0_20px_rgba(56,189,248,0.25)] hover:active:border-[#38bdf8] transition-all font-sans ${
                          fieldErrors.occupation
                            ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/30'
                            : 'border-[#1a2b40] focus:border-[#38bdf8] focus:ring-[#38bdf8]/50 hover:border-[#38bdf8]/50'
                        }`}
                      />
                    </div>
                    {fieldErrors.occupation && (
                      <p className="text-[10px] text-rose-400 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" />
                        {fieldErrors.occupation}
                      </p>
                    )}
                  </div>
                </div>

                {/* 4. Education Qualification */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-[#94a3b8]">Education Qualification</label>
                  <div className="relative flex items-center group">
                    <GraduationCap className="w-4 h-4 text-[#64748b] group-focus-within:text-[#38bdf8] absolute left-3.5 pointer-events-none transition-colors" />
                    <input
                      type="text"
                      required
                      value={educationQualification}
                      onChange={(e) => handleFieldChange('educationQualification', e.target.value)}
                      placeholder="e.g. Master's in Computer Science"
                      className={`w-full bg-[#070e1a] border rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#f4f4f5] placeholder:text-[#475569] focus:outline-none focus:ring-1 focus:shadow-[0_0_20px_rgba(56,189,248,0.25)] hover:active:border-[#38bdf8] transition-all font-sans ${
                        fieldErrors.educationQualification
                          ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/30'
                          : 'border-[#1a2b40] focus:border-[#38bdf8] focus:ring-[#38bdf8]/50 hover:border-[#38bdf8]/50'
                      }`}
                    />
                  </div>
                  {fieldErrors.educationQualification && (
                    <p className="text-[10px] text-rose-400 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {fieldErrors.educationQualification}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Email (for both login and signup) */}
            <div className="space-y-1">
              <label className="block text-[11px] font-mono text-[#94a3b8]">Email Address</label>
              <div className="relative flex items-center group">
                <Mail className="w-4 h-4 text-[#64748b] group-focus-within:text-[#38bdf8] absolute left-3.5 pointer-events-none transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  placeholder="e.g. alex.vance@lucychat.ai"
                  className={`w-full bg-[#070e1a] border rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#f4f4f5] placeholder:text-[#475569] focus:outline-none focus:ring-1 focus:shadow-[0_0_20px_rgba(56,189,248,0.25)] hover:active:border-[#38bdf8] transition-all font-sans ${
                    fieldErrors.email
                      ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/30'
                      : 'border-[#1a2b40] focus:border-[#38bdf8] focus:ring-[#38bdf8]/50 hover:border-[#38bdf8]/50'
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-[10px] text-rose-400 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password (for both login and signup) */}
            <div className="space-y-1">
              <label className="block text-[11px] font-mono text-[#94a3b8]">Password</label>
              <div className="relative flex items-center group">
                <Lock className="w-4 h-4 text-[#64748b] group-focus-within:text-[#38bdf8] absolute left-3.5 pointer-events-none transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => handleFieldChange('password', e.target.value)}
                  placeholder={mode === 'signup' ? 'Create a secure password (min 8 chars)' : 'Enter your password'}
                  className={`w-full bg-[#070e1a] border rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-[#f4f4f5] placeholder:text-[#475569] focus:outline-none focus:ring-1 focus:shadow-[0_0_20px_rgba(56,189,248,0.25)] hover:active:border-[#38bdf8] transition-all font-sans ${
                    fieldErrors.password
                      ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/30'
                      : 'border-[#1a2b40] focus:border-[#38bdf8] focus:ring-[#38bdf8]/50 hover:border-[#38bdf8]/50'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-[#64748b] hover:text-[#38bdf8] transition-colors p-1 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-[10px] text-rose-400 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Password Validation Checklist (Only on Sign Up) */}
            {mode === 'signup' && (
              <div className="space-y-1.5 pt-1 font-mono text-[11px] text-[#94a3b8]">
                <div className="flex items-center gap-2">
                  {hasMinLength ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8]" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-[#475569]" />
                  )}
                  <span className={hasMinLength ? 'text-[#f4f4f5]' : 'text-[#64748b]'}>
                    8+ characters
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {hasNumber ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8]" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-[#475569]" />
                  )}
                  <span className={hasNumber ? 'text-[#f4f4f5]' : 'text-[#64748b]'}>
                    At least 1 number
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {hasSpecialChar ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8]" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-[#475569]" />
                  )}
                  <span className={hasSpecialChar ? 'text-[#f4f4f5]' : 'text-[#64748b]'}>
                    At least 1 special character
                  </span>
                </div>
              </div>
            )}

            {/* Main CTA Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-slate-950 font-bold text-sm shadow-[0_0_22px_rgba(56,189,248,0.4)] hover:shadow-[0_0_32px_rgba(56,189,248,0.65)] active:shadow-[0_0_40px_rgba(56,189,248,0.85)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer mt-4 border border-[#38bdf8]/50 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>{mode === 'signup' ? 'Creating Account...' : 'Signing In...'}</span>
                </>
              ) : (
                <>
                  <span>{mode === 'signup' ? 'Create Free Account' : 'Sign In to Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle between Sign Up and Log In */}
          <div className="relative z-10 text-center pt-4">
            <p className="text-xs text-[#94a3b8]">
              {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => handleTabChange(mode === 'signup' ? 'login' : 'signup')}
                className="text-[#38bdf8] hover:underline font-bold cursor-pointer ml-1"
              >
                {mode === 'signup' ? 'Log In' : 'Sign Up'}
              </button>
            </p>
          </div>

          {/* Legal Notice */}
          <div className="pt-4 text-center">
            <p className="text-[10px] text-[#64748b] leading-relaxed">
              By signing up, you agree to our{' '}
              <button
                type="button"
                onClick={() => alert('Terms of Service: Zero-data-retention, encrypted workspace compute.')}
                className="underline hover:text-[#94a3b8] transition-colors cursor-pointer"
              >
                Terms of Service
              </button>{' '}
              and acknowledge our{' '}
              <button
                type="button"
                onClick={() => alert('Zero-Retention Privacy Policy: We do not train foundation models on user uploads or prompts.')}
                className="underline hover:text-[#94a3b8] transition-colors cursor-pointer"
              >
                Zero-Retention Privacy Policy
              </button>
              . We do not train on your inputs.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Spacer for balance */}
      <div className="hidden sm:block h-6" />
    </div>
  );
};

export default AuthModal;
