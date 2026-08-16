// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import TokenCard from "@/components/TokenCard";
// import { login, signup } from "../api/auth";

// import ValidatedField from "@/components/ValidatedField";
// import { validators } from "@/lib/validators";


// const initialSignup = {
//   name: "", age: "", occupation: "", education_qualification: "", email: "", password: "",
// };

// const initialLogin = {email: "", password: ""};

// export default function AuthPage(){
//     const [tab, setTab] = useState("login");
//     const [loginForm, setLoginForm] = useState(initialLogin);
//     const [signupForm, setSignupForm] = useState(initialSignup);
//     const [error, setError] = useState("");
//     const [loading, setLoading]  =useState(false);
//     const [signed, setSigned] = useState(false);
//     const navigate = useNavigate();

//     async function handleLogin(e){
//         e.preventDefault();
//         setError("");
//         setLoading(true);
//         try{
//             const data=await login(loginForm);
//             setSigned(true);
//             localStorage.setItem("access_token", data.access_token);
//             setTimeout(() => navigate("/profile", 550));
//         }
//         catch(err){
//                 setError(err.message);
//                 setLoading(false);
//         }
//     }
//     async function handleSignup(e){
//         e.preventDefault();
//         setError("")
//         setLoading(true);
//         try{
//             await signup({
//                 ...signupForm,
//                 age: Number(signupForm.age)});
//             setSigned(true);
//             setTimeout(() => {
//                 setTab("login");
//                 setSigned(false);
//                 setLoading(false);
//             }, 600);
//         }
//         catch(err){
//             setError(err.message);
//             setLoading(false);
//         }
//     }
//     return(
//     <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg-deep px-6 font-body">
//       <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse at_top,_var(--color-gradient-a)_0%,_transparent_50%),radial-gradient(ellipse_at_bottom,_var(--color-gradient-b)_0%,_transparent_50%)] opacity-35" />

//       <div className="relative z-10 w-full max-w-[420px]">
//         <div className="mb-5">
//           <TokenCard signed={signed} />
//     </div>
//     <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl">
    
//           <Tabs 
//           value={tab} 
//           onValueChange={(v) => { 
//             setTab(v); 
//             setError(""); 
//             if (v==="login") setSignupForm(initialSignup);
//             else setLoginForm(initialLogin);
//             }}>

//             <TabsList className="mb-6 grid w-full grid-cols-2 rounded-full bg-white/5 p-1">
//               <TabsTrigger value="login" className="rounded-full data-[state=active]:bg-white/10 data-[state=active]:text-text-primary">
//                 Log in
//               </TabsTrigger>
//               <TabsTrigger value="signup" className="rounded-full data-[state=active]:bg-white/10 data-[state=active]:text-text-primary">
//                 Sign up
//               </TabsTrigger>
//             </TabsList>
//             {error && (
//               <div className="mb-4 rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-[13px] text-error">
//                 {error}
//               </div>
//             )}

//             <TabsContent value="login">
//             <form onSubmit={handleLogin} className="flex flex-col gap-4">
//               <ValidatedField
//                 label="Email"
//                 type="email"
//                 value={loginForm.email}
//                 onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))}
//                 //validator={validators.email}
//               />
//               <ValidatedField
//                 label="Password"
//                 type="password"
//                 value={loginForm.password}
//                 onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
//               />
//               <CTAButton loading={loading}>Log in</CTAButton>
//             </form>
//             </TabsContent>

//             <TabsContent value="signup">
//             <form onSubmit={handleSignup} className="flex flex-col gap-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <ValidatedField
//                   label="Name"
//                   value={signupForm.name}
//                   onChange={(e) => setSignupForm((p) => ({ ...p, name: e.target.value }))}
//                   validator={validators.name}
//                 />
//                 <ValidatedField
//                   label="Age"
//                   type="number"
//                   min="1"
//                   max="119"
//                   value={signupForm.age}
//                   onChange={(e) => setSignupForm((p) => ({ ...p, age: e.target.value }))}
//                   validator={validators.age}
//                 />
//               </div>
//               <ValidatedField
//                 label="Occupation"
//                 value={signupForm.occupation}
//                 onChange={(e) => setSignupForm((p) => ({ ...p, occupation: e.target.value }))}
//                 validator={validators.occupation}
//               />
//               <ValidatedField
//                 label="Education qualification"
//                 value={signupForm.education_qualification}
//                 onChange={(e) => setSignupForm((p) => ({ ...p, education_qualification: e.target.value }))}
//                 validator={validators.education_qualification}
//               />
//               <ValidatedField
//                 label="Email"
//                 type="email"
//                 value={signupForm.email}
//                 onChange={(e) => setSignupForm((p) => ({ ...p, email: e.target.value }))}
//                 validator={validators.email}
//               />
//               <ValidatedField
//                 label="Password"
//                 type="password"
//                 value={signupForm.password}
//                 onChange={(e) => setSignupForm((p) => ({ ...p, password: e.target.value }))}
//                 validator={validators.password}
//               />
//               <CTAButton loading={loading}>Create account</CTAButton>
//             </form>
//             </TabsContent>
//             </Tabs>
//         </div>
//       </div>
//     </div>
//   );
// }

// function Field({label, children}){
//     return (
//         <div className="flex flex-col gap-1.5">
//         <Label className="text-[12px] font-medium text-text-muted">{label}</Label>
//       {children}
//     </div>
//   );
// }


// function CTAButton({ children, loading }) {
//   return (
//     <Button
//       type="submit"
//       disabled={loading}
//       className="mt-1 rounded-xl bg-gradient-to-r from-accent-cyan to-gradient-a font-semibold text-bg-deep shadow-[0_0_20px_-4px_var(--color-accent-cyan)] hover:opacity-90"
//     >
//       {loading ? "Working..." : children}
//     </Button>
//   );
// }


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ValidatedField from "@/components/ValidatedField";
import { validators } from "@/lib/validators";
import { login, signup } from "../api/auth";
import { useTheme } from "@/context/ThemeContext";
import logoImg from "@/assets/logo.png";
import { Link } from "react-router-dom";

import { motion } from "framer-motion";
import FloatingRobot from "@/components/FloatingRobot";


const initialSignup = {
  name: "", age: "", occupation: "", education_qualification: "", email: "", password: "",
};
const initialLogin = { email: "", password: "" };

export default function AuthPage() {
  const [tab, setTab] = useState("login");
  const [loginForm, setLoginForm] = useState(initialLogin);
  const [signupForm, setSignupForm] = useState(initialSignup);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();


  function switchTab(next) {
    setTab(next);
    setError("");
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(loginForm);
      localStorage.setItem("access_token", data.access_token);
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup({ ...signupForm, age: Number(signupForm.age) });
      switchTab("login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-bg-page font-body">
      {/* Left illustration panel */}
<div className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-gradient-to-br from-brand to-accent-violet lg:flex">
  <div className="absolute h-[420px] w-[420px] rounded-full border border-white/20" />
  <div className="absolute h-[300px] w-[300px] rounded-full border border-white/15" />
  <div className="relative z-10 flex flex-col items-center px-12 text-center text-white">
    
    <FloatingRobot className="mb-8" />
    <h2 className="font-display text-3xl font-semibold leading-tight">
      Hi! I am Lucy
    </h2>
    <p className="mt-3 text-sm text-white/80">
      Sign in to pick up where you left off.
    </p>
  </div>
</div>

      {/* Right form panel */}
      <div className="relative flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <Link
            to="/"
            className="absolute left-6 top-6 flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-text-primary"
          >
            <ArrowLeftIcon />
            Home
        </Link>
        <div className="w-full max-w-[380px]">
          {/* <div className="mb-8 font-display text-2xl font-bold text-text-primary">
            YourApp
          </div> */}

          <div className="mb-8 flex items-center justify-between">
            <div className="font-display text-2xl font-bold text-text-primary">
              LucyChat
            </div>
            <button
              onClick={toggleTheme}
              title="Toggle theme"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-text-faint transition-colors hover:bg-bg-muted hover:text-text-primary"
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>

          <div className="mb-6 flex items-center justify-between">
            <h1 className="font-display text-xl font-semibold text-text-primary">
              {tab === "login" ? "Log In" : "Sign Up"}
            </h1>
            <button
              type="button"
              onClick={() => switchTab(tab === "login" ? "signup" : "login")}
              className="text-sm font-medium text-brand hover:underline"
            >
              {tab === "login" ? "Sign up" : "Log in"}
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-error/30 bg-error-bg px-3 py-2 text-[13px] text-error">
              {error}
            </div>
          )}

          {tab === "login" ? (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <ValidatedField
                label="Your email"
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))}
              />
              <ValidatedField
                label="Your password"
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
              />
              <CTAButton loading={loading}>Log In</CTAButton>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <ValidatedField
                  label="Name"
                  value={signupForm.name}
                  onChange={(e) => setSignupForm((p) => ({ ...p, name: e.target.value }))}
                  validator={validators.name}
                />
                <ValidatedField
                  label="Age"
                  type="number"
                  min="1"
                  max="119"
                  className="no-spinner"
                  value={signupForm.age}
                  onChange={(e) => setSignupForm((p) => ({ ...p, age: e.target.value }))}
                  validator={validators.age}
                />
              </div>
              <ValidatedField
                label="Occupation"
                value={signupForm.occupation}
                onChange={(e) => setSignupForm((p) => ({ ...p, occupation: e.target.value }))}
                validator={validators.occupation}
              />
              <ValidatedField
                label="Education qualification"
                value={signupForm.education_qualification}
                onChange={(e) => setSignupForm((p) => ({ ...p, education_qualification: e.target.value }))}
                validator={validators.education_qualification}
              />
              <ValidatedField
                label="Email"
                type="email"
                value={signupForm.email}
                onChange={(e) => setSignupForm((p) => ({ ...p, email: e.target.value }))}
                validator={validators.email}
              />
              <ValidatedField
                label="Password"
                type="password"
                value={signupForm.password}
                onChange={(e) => setSignupForm((p) => ({ ...p, password: e.target.value }))}
                validator={validators.password}
              />
              <CTAButton loading={loading}>Create account</CTAButton>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function CTAButton({ children, loading }) {
  return (
    <Button
      type="submit"
      disabled={loading}
      className="mt-1 rounded-lg bg-brand font-semibold text-white hover:bg-brand-dark"
    >
      {loading ? "Working..." : children}
    </Button>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M4.2 15.8l1.4-1.4M14.4 5.6l1.4-1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M17 11.5A7 7 0 118.5 3a5.5 5.5 0 108.5 8.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}