import { useState } from "react";
import API from "../lib/api";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Shield, X, Github, ArrowRight, Loader2, Chrome, Eye, EyeOff } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "patient",
    fullName: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await API.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join('. ') : msg || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 antialiased selection:bg-primary selection:text-primary-foreground">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[450px] bg-card border border-border rounded-2xl p-8 shadow-2xl relative z-10"
      >
        {/* Navigation Toggle */}
        <div className="flex items-center justify-between mb-8">
          <div className="bg-muted p-1 rounded-lg flex items-center border border-border">
            <button className="px-4 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider text-foreground bg-background shadow-sm border border-border">
              Sign up
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="px-4 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-all"
            >
              Login
            </button>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="h-8 w-8 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-foreground uppercase tracking-tight">Create Identity</h1>
            <p className="text-xs text-muted-foreground">Join the medical network as a patient or clinician.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode='wait'>
                {error && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/10 text-rose-500 text-[10px] font-bold uppercase tracking-widest text-center"
                >
                    {error}
                </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Full name</label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 group-focus-within:text-primary transition-colors h-4 w-4" />
                  <input
                    name="fullName"
                    type="text"
                    placeholder="Enter full name"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    className="w-full bg-muted border border-border text-foreground rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:border-primary/30 focus:bg-muted/80 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Email address</label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 group-focus-within:text-primary transition-colors h-4 w-4" />
                  <input
                    name="email"
                    type="email"
                    placeholder="name@email.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-muted border border-border text-foreground rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:border-primary/30 focus:bg-muted/80 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 group-focus-within:text-primary transition-colors h-4 w-4" />
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min 8 characters"
                      value={form.password}
                      onChange={handleChange}
                      minLength={8}
                      required
                      className="w-full bg-muted border border-border text-foreground rounded-xl py-3 pl-11 pr-11 text-sm outline-none focus:border-primary/30 focus:bg-muted/80 transition-all"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Role</label>
                  <div className="relative group">
                    <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 h-4 w-4 pointer-events-none" />
                    <select
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      className="w-full bg-muted border border-border text-foreground rounded-xl py-3 pl-11 pr-4 text-[10px] font-black uppercase tracking-[0.2em] outline-none focus:border-primary/30 focus:bg-muted/80 transition-all appearance-none cursor-pointer"
                    >
                      <option value="patient" className="bg-background">Patient</option>
                      <option value="doctor" className="bg-background">Clinician</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Register Identity
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink mx-4 text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">Verification</span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center py-3 rounded-xl bg-muted border border-border hover:bg-muted/80 transition-all group">
              <Chrome size={18} className="text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
            <button className="flex items-center justify-center py-3 rounded-xl bg-muted border border-border hover:bg-muted/80 transition-all group">
              <Github size={18} className="text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
          </div>

          <p className="text-center text-[10px] text-muted-foreground/60 font-medium leading-relaxed">
            Clinical profiles undergo manual verification. By registering, you confirm your eligibility under primary healthcare statutes.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
