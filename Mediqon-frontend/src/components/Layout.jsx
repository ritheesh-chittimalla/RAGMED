import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  Activity, 
  Bot, 
  Settings, 
  Bell, 
  Search,
  Menu,
  X,
  LogOut,
  Sun,
  Moon,
  Library,
  HeartPulse,
  Stethoscope,
  Zap,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import mediqonLogo from '../assets/mediqon-logo.png';
import LanguageSelector from './ui/LanguageSelector';
import LocationSelector from './ui/LocationSelector';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'AI Disease Predictions', path: '/predictions', icon: Sparkles },
  { name: 'Appointments', path: '/bookings', icon: CalendarDays },
  { name: 'Verified Clinicians', path: '/doctors', icon: Users },
  { name: 'Health Vitals', path: '/vitals', icon: HeartPulse },
  { name: 'Digital Consult', path: '/consultation', icon: Stethoscope },
  { name: 'Medical Vault', path: '/records', icon: Library },
  { name: 'Health Timeline', path: '/timeline', icon: Activity },
  { name: 'Wellness Center', path: '/wellness', icon: Zap },
  { name: 'Neural Assistant', path: '/assistant', icon: Bot },
];

const SECONDARY_ITEMS = [
  { name: 'Notifications', path: '/notifications', icon: Bell },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Layout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const rawPathName = NAV_ITEMS.concat(SECONDARY_ITEMS).find(item => item.path === location.pathname)?.name || 'Mediqon';
  const currentPathName = t(rawPathName, rawPathName);

  return (
    <div className="flex h-screen bg-background font-sans text-foreground overflow-hidden antialiased transition-colors duration-300">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-border bg-card md:flex z-20 shadow-sm">
        <div className="flex h-16 items-center px-6 border-b border-border/50">
          <div className="flex items-center gap-2.5">
            <img src={mediqonLogo} alt="Mediqon" className="h-8 w-8 rounded-lg shadow-sm" />
            <span className="text-lg font-semibold tracking-tight text-foreground">Mediqon</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 no-scrollbar">
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-3">{t('Menu', 'Menu')}</p>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-primary/10 text-primary shadow-sm' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  {t(item.name, item.name)}
                </NavLink>
              );
            })}
          </div>

          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-3">{t('General', 'General')}</p>
            {SECONDARY_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-primary/10 text-primary shadow-sm' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  {t(item.name, item.name)}
                </NavLink>
              );
            })}
          </div>
        </div>

        <div className="border-t border-border p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-destructive" />
            {t('Logout', 'Logout')}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-neutral-900/40 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 w-72 flex-col bg-card border-r border-border shadow-2xl flex md:hidden"
            >
              <div className="flex h-16 items-center justify-between px-6 border-b border-border/50">
                <div className="flex items-center gap-2.5">
                    <img src={mediqonLogo} alt="Mediqon" className="h-8 w-8 rounded-lg shadow-sm" />
                    <span className="text-lg font-semibold tracking-tight text-foreground">Mediqon</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-muted-foreground hover:bg-muted p-2 rounded-lg">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
                 <div className="space-y-1">
                    <p className="px-3 text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">{t('Menu', 'Menu')}</p>
                    {NAV_ITEMS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <NavLink key={item.name} to={item.path} onClick={() => setIsMobileMenuOpen(false)}
                          className={({isActive}) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${isActive ? 'bg-primary/10 text-primary shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                          <Icon className="h-5 w-5" /> {t(item.name, item.name)}
                        </NavLink>
                      );
                    })}
                </div>
              </div>
              <div className="border-t border-border p-4">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                    <LogOut className="h-5 w-5" /> {t('Logout', 'Logout')}
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Top Navbar */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card/80 backdrop-blur-md px-6 z-10 sticky top-0 transition-colors">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-muted-foreground hover:bg-muted p-2 rounded-lg transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-semibold tracking-tight text-foreground md:block hidden">
              {currentPathName}
            </h1>
          </div>

          <div className="flex items-center gap-3 lg:gap-4">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const query = e.target.search.value;
                if (query) navigate(`/doctors?q=${encodeURIComponent(query)}`);
              }}
              className="relative hidden sm:block"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                name="search"
                type="text"
                placeholder={t('SearchPlaceholder', 'Search doctors, specialties...')}
                className="h-10 w-64 rounded-xl border border-border bg-muted/50 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60 font-medium"
              />
            </form>

            {/* City Location Selector */}
            <LocationSelector />

            {/* Multi-Language Selector */}
            <LanguageSelector />

            {/* Dark / Light Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition-all shrink-0"
              title="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            
            <button className="relative flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition-colors shrink-0">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2.5 top-2.5 flex h-2 w-2 rounded-full bg-primary ring-2 ring-card"></span>
            </button>
            
            <div className="h-6 w-px bg-border hidden sm:block"></div>
            
            <button className="flex items-center gap-3 rounded-full pl-2 pr-4 py-1.5 border border-transparent hover:border-border hover:bg-muted transition-all">
              <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs ring-2 ring-card shadow-sm">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:block">{user?.fullName || 'User'}</span>
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto bg-background p-6 lg:p-10 no-scrollbar relative w-full h-full transition-colors">
          <div className="mx-auto max-w-[1200px] w-full h-full pb-20">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
