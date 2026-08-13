import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import TokenCard from "@/components/TokenCard";
import { login, signup } from "../api/auth";

import ValidatedField from "@/components/ValidatedField";
import { validators } from "@/lib/validators";


const initialSignup = {
  name: "", age: "", occupation: "", education_qualification: "", email: "", password: "",
};

const initialLogin = {email: "", password: ""};

export default function AuthPage(){
    const [tab, setTab] = useState("login");
    const [loginForm, setLoginForm] = useState(initialLogin);
    const [signupForm, setSignupForm] = useState(initialSignup);
    const [error, setError] = useState("");
    const [loading, setLoading]  =useState(false);
    const [signed, setSigned] = useState(false);
    const navigate = useNavigate();

    async function handleLogin(e){
        e.preventDefault();
        setError("");
        setLoading(true);
        try{
            const data=await login(loginForm);
            setSigned(true);
            localStorage.setItem("access_token", data.access_token);
            setTimeout(() => navigate("/profile", 550));
        }
        catch(err){
                setError(err.message);
                setLoading(false);
        }
    }
    async function handleSignup(e){
        e.preventDefault();
        setError("")
        setLoading(true);
        try{
            await signup({
                ...signupForm,
                age: Number(signupForm.age)});
            setSigned(true);
            setTimeout(() => {
                setTab("login");
                setSigned(false);
                setLoading(false);
            }, 600);
        }
        catch(err){
            setError(err.message);
            setLoading(false);
        }
    }
    return(
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg-deep px-6 font-body">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse at_top,_var(--color-gradient-a)_0%,_transparent_50%),radial-gradient(ellipse_at_bottom,_var(--color-gradient-b)_0%,_transparent_50%)] opacity-35" />

      <div className="relative z-10 w-full max-w-[420px]">
        <div className="mb-5">
          <TokenCard signed={signed} />
    </div>
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl">
    
          <Tabs 
          value={tab} 
          onValueChange={(v) => { 
            setTab(v); 
            setError(""); 
            if (v==="login") setSignupForm(initialSignup);
            else setLoginForm(initialLogin);
            }}>

            <TabsList className="mb-6 grid w-full grid-cols-2 rounded-full bg-white/5 p-1">
              <TabsTrigger value="login" className="rounded-full data-[state=active]:bg-white/10 data-[state=active]:text-text-primary">
                Log in
              </TabsTrigger>
              <TabsTrigger value="signup" className="rounded-full data-[state=active]:bg-white/10 data-[state=active]:text-text-primary">
                Sign up
              </TabsTrigger>
            </TabsList>
            {error && (
              <div className="mb-4 rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-[13px] text-error">
                {error}
              </div>
            )}

            <TabsContent value="login">
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <ValidatedField
                label="Email"
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))}
                //validator={validators.email}
              />
              <ValidatedField
                label="Password"
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
              />
              <CTAButton loading={loading}>Log in</CTAButton>
            </form>
            </TabsContent>

            <TabsContent value="signup">
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
            </TabsContent>
            </Tabs>
        </div>
      </div>
    </div>
  );
}

function Field({label, children}){
    return (
        <div className="flex flex-col gap-1.5">
        <Label className="text-[12px] font-medium text-text-muted">{label}</Label>
      {children}
    </div>
  );
}


function CTAButton({ children, loading }) {
  return (
    <Button
      type="submit"
      disabled={loading}
      className="mt-1 rounded-xl bg-gradient-to-r from-accent-cyan to-gradient-a font-semibold text-bg-deep shadow-[0_0_20px_-4px_var(--color-accent-cyan)] hover:opacity-90"
    >
      {loading ? "Working..." : children}
    </Button>
  );
}
