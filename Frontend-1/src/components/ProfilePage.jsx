import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Trash2,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  MessageSquare,
  FileText,
  Eye,
  GraduationCap,
  Briefcase,
  Calendar,
  User,
  Mail,
  AlertCircle,
  Loader2,
  LogOut,
} from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const ProfilePage = ({
  user: propUser,
  onUpdateUser,
  onNavigate,
  onOpenUpgradeModal,
}) => {
  const { user: authUser, updateProfile, deleteAccount, logout } = useAuth();
  const currentUser = authUser || propUser;

  // Personal Profile states
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [age, setAge] = useState(currentUser?.age !== undefined ? currentUser.age : '');
  const [occupation, setOccupation] = useState(currentUser?.occupation || '');
  const [educationQualification, setEducationQualification] = useState(
    currentUser?.education_qualification || currentUser?.educationQualification || ''
  );
  const [emailAddress, setEmailAddress] = useState(currentUser?.email || '');
  const [avatarUrl, setAvatarUrl] = useState(
    currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  );

  // Status and Confirmation States
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [showClearHistoryConfirm, setShowClearHistoryConfirm] = useState(false);
  const [historyCleared, setHistoryCleared] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Real document count state
  const [uploadedDocsCount, setUploadedDocsCount] = useState(0);
  const [isLoadingDocCount, setIsLoadingDocCount] = useState(false);

  const fileInputRef = useRef(null);

  // Sync state when currentUser updates
  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.name || '');
      setAge(currentUser.age !== undefined ? currentUser.age : '');
      setOccupation(currentUser.occupation || '');
      setEducationQualification(
        currentUser.education_qualification || currentUser.educationQualification || ''
      );
      setEmailAddress(currentUser.email || '');
    }
  }, [currentUser]);

  // Fetch real document metrics
  useEffect(() => {
    const fetchDocCount = async () => {
      setIsLoadingDocCount(true);
      try {
        const res = await api.documents.list();
        if (res && typeof res.count === 'number') {
          setUploadedDocsCount(res.count);
        }
      } catch (err) {
        console.warn('Could not fetch doc count:', err);
      } finally {
        setIsLoadingDocCount(false);
      }
    };
    fetchDocCount();
  }, []);

  // Handle Photo Change
  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
          if (onUpdateUser && currentUser) {
            onUpdateUser({ ...currentUser, avatar: reader.result });
          }
          setSavedSuccess(true);
          setTimeout(() => setSavedSuccess(false), 2500);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Save Profile Changes to Backend
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);

    try {
      const updated = await updateProfile({
        name: fullName,
        age: parseInt(age, 10),
        occupation: occupation,
        education_qualification: educationQualification,
      });

      if (onUpdateUser) {
        onUpdateUser({ ...updated, avatar: avatarUrl });
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setSaveError(err.message || 'Failed to save profile changes');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Clear History
  const handleClearHistory = () => {
    setShowClearHistoryConfirm(false);
    setHistoryCleared(true);
    setTimeout(() => setHistoryCleared(false), 3000);
  };

  // Handle Delete Account
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      alert('Your account has been deleted successfully.');
      onNavigate('home');
    } catch (err) {
      console.error('Delete account failed:', err);
      alert(err.message || 'Failed to delete account.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      onNavigate('home');
    } catch (err) {
      console.error('Logout failed:', err);
      alert(err.message || 'Failed to log out.');
    }
  };

  // User Initials
  const initials = fullName
    ? fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'AV';

  // Practical Usage Metrics
  const docsUploaded = uploadedDocsCount;
  const docsTotal = 10;
  const docsPercent = Math.min(100, Math.round((docsUploaded / docsTotal) * 100));

  return (
    <div className="min-h-screen bg-background text-on-background font-sans antialiased selection:bg-primary-container/20 selection:text-primary-container">
      {/* Hidden File Input for Avatar upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoSelect}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />

      {/* ==================== TOP NAVIGATION HEADER ==================== */}
      <header className="sticky top-0 z-30 w-full bg-header backdrop-blur-md border-b border-outline-variant">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('chat')}
              className="inline-flex items-center gap-2 text-xs font-mono text-on-surface-variant hover:text-primary-container transition-colors py-1.5 px-2.5 rounded-lg hover:bg-surface-container/50 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Chat</span>
            </button>

            <div className="h-4 w-px bg-outline-variant hidden sm:block" />

            <div className="hidden sm:block">
              <Logo size="sm" onClick={() => onNavigate('home')} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant hover:border-rose-400/60 text-xs font-medium text-on-background transition-all cursor-pointer shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-300" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ==================== MAIN CENTERED CONTAINER ==================== */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
        {/* Page Header */}
        <div className="space-y-1.5 pb-2">
          <h1
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-on-background"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            User Profile
          </h1>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Manage your personal profile, credentials, and workspace preferences stored in your backend database.
          </p>
        </div>

        {/* Global Save Success Banner */}
        {savedSuccess && (
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0c1f33] border border-[#38bdf8]/40 text-xs text-[#38bdf8] animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#38bdf8] shrink-0" />
              <span className="font-medium text-[#f4f4f5]">Your profile details have been saved to the database successfully.</span>
            </div>
          </div>
        )}

        {/* Global Save Error Banner */}
        {saveError && (
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-rose-950/40 border border-rose-700/50 text-xs text-rose-300 animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{saveError}</span>
            </div>
          </div>
        )}

        {/* History Cleared Alert */}
        {historyCleared && (
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0c1f33] border border-[#38bdf8]/40 text-xs text-[#38bdf8] animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#38bdf8] shrink-0" />
              <span className="font-medium text-[#f4f4f5]">All chat history and cached sessions cleared.</span>
            </div>
          </div>
        )}

        {/* ==================== CARD 1: IDENTITY OVERVIEW ==================== */}
        <section className="bg-surface-container border border-outline-variant rounded-2xl p-6 sm:p-7 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="relative group shrink-0">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName || 'User'}
                    className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-outline-variant group-hover:border-primary-container/60 transition-colors shadow-md"
                  />
                ) : (
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-surface-container-high flex items-center justify-center font-mono font-bold text-xl text-primary-container border-2 border-outline-variant">
                    {initials}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-primary-container cursor-pointer"
                  title="Upload photo"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-lg sm:text-xl font-bold text-on-background">{fullName || 'User Profile'}</h2>
                  {age ? (
                    <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary-container text-[11px] font-mono border border-outline">
                      {age} yrs
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center gap-2 text-xs text-on-surface-variant flex-wrap">
                  {occupation && (
                    <span className="flex items-center gap-1 text-primary-container">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>{occupation}</span>
                    </span>
                  )}
                  {occupation && educationQualification && <span>•</span>}
                  {educationQualification && (
                    <span className="flex items-center gap-1 text-on-surface-variant">
                      <GraduationCap className="w-3.5 h-3.5 text-secondary" />
                      <span>{educationQualification}</span>
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 font-mono">{emailAddress}</p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-1.5 rounded-xl bg-surface-variant hover:bg-surface-container-high text-xs font-semibold text-on-background border border-outline-variant hover:border-primary-container/40 transition-all cursor-pointer"
              >
                Change Photo
              </button>
            </div>
          </div>
        </section>

        {/* ==================== CARD 2: PROFILE DETAILS EDIT FORM ==================== */}
        <section className="bg-surface-container border border-outline-variant rounded-2xl p-6 sm:p-7 shadow-lg space-y-6">
          <div className="border-b border-outline-variant pb-4">
            <h2 className="text-base font-bold text-on-background">Profile Information</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Edit your name, occupation, education qualification, and age. Updates are synced directly to PostgreSQL.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-5">
            {isLoadingDocCount && (
              <div className="flex items-center gap-2 rounded-xl border border-[#1e293b] bg-[#08101d] px-3 py-2 text-[11px] text-[#94a3b8]">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#38bdf8]" />
                <span>Loading document usage…</span>
              </div>
            )}

            {/* 2-Column Responsive Grid for fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* 1. Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#cbd5e1] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Vance"
                  required
                  className="w-full bg-[#080c14] border border-[#1e293b] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#f8fafc] placeholder-[#64748b] focus:outline-none focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8]/20 transition-all"
                />
              </div>

              {/* 2. Age */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#cbd5e1] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>Age</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="119"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 28"
                  required
                  className="w-full bg-[#080c14] border border-[#1e293b] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#f8fafc] placeholder-[#64748b] focus:outline-none focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8]/20 transition-all"
                />
              </div>

              {/* 3. Occupation */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#cbd5e1] flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>Occupation</span>
                </label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder="e.g. AI Research Scientist"
                  required
                  className="w-full bg-[#080c14] border border-[#1e293b] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#f8fafc] placeholder-[#64748b] focus:outline-none focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8]/20 transition-all"
                />
              </div>

              {/* 4. Education Qualification */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#cbd5e1] flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>Education Qualification</span>
                </label>
                <input
                  type="text"
                  value={educationQualification}
                  onChange={(e) => setEducationQualification(e.target.value)}
                  placeholder="e.g. Master's in Computer Science"
                  required
                  className="w-full bg-[#080c14] border border-[#1e293b] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#f8fafc] placeholder-[#64748b] focus:outline-none focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8]/20 transition-all"
                />
              </div>
            </div>

            {/* Email Address (read-only in profile info) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#cbd5e1] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Email Address (Primary Account ID)</span>
              </label>
              <input
                type="email"
                value={emailAddress}
                disabled
                className="w-full bg-[#080c14]/50 border border-[#1e293b] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#94a3b8] cursor-not-allowed opacity-80 font-mono"
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-[#38bdf8] hover:bg-[#38bdf8]/90 active:scale-[0.98] text-[#051424] font-bold text-xs shadow-[0_0_15px_rgba(56,189,248,0.25)] hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all cursor-pointer flex items-center gap-2 disabled:opacity-60"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving to Database...</span>
                  </>
                ) : (
                  <span>Save Profile</span>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* ==================== CARD 5: DANGER ZONE ==================== */}
        <section className="bg-[#0b0f17] border border-[#7f1d1d]/40 rounded-2xl p-6 sm:p-7 shadow-lg space-y-4">
          <div>
            <h2 className="text-base font-bold text-rose-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Danger Zone</span>
            </h2>
            <p className="text-xs text-[#94a3b8] mt-1">
              Irreversible account operations and complete workspace purge.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-[#e2e8f0]">Delete Account</p>
              <p className="text-[11px] text-[#94a3b8] leading-relaxed">
                Permanently remove your account, conversations, and all FAISS indexed document vectors.
              </p>
            </div>

            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 self-start sm:self-auto"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Account</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 p-2 rounded-xl bg-rose-950/60 border border-rose-700 self-start sm:self-auto">
                <span className="text-xs text-rose-200 font-semibold">Confirm delete?</span>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleDeleteAccount}
                  className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-[#ffffff] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                  <span>{isDeleting ? 'Deleting...' : 'Delete Now'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-2 py-1 text-xs text-[#cbd5e1] hover:text-[#ffffff] cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProfilePage;
