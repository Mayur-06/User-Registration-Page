// // import { useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { getMe, deleteMe } from "../api/user";
// // import { logout } from "../api/auth";
// // import "./ProfilePage.css";

// // export default function ProfilePage() {
// //   const [user, setUser] = useState(null);
// //   const [error, setError] = useState("");
// //   const [loading, setLoading] = useState(true);
// //   const [deleting, setDeleting] = useState(false);
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     getMe()
// //       .then(setUser)
// //       .catch((err) => setError(err.message))
// //       .finally(() => setLoading(false));
// //   }, []);

// //   async function handleLogout() {
// //     await logout();
// //     navigate("/login");
// //   }

// //   async function handleDelete() {
// //     const confirmed = window.confirm(
// //       "Delete your account permanently? This can't be undone."
// //     );
// //     if (!confirmed) return;

// //     setDeleting(true);
// //     try {
// //       await deleteMe();
// //       localStorage.removeItem("access_token");
// //       navigate("/login");
// //     } catch (err) {
// //       setError(err.message);
// //       setDeleting(false);
// //     }
// //   }

// //   if (loading) {
// //     return (
// //       <div className="profile-page">
// //         <p>Loading...</p>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="profile-page">
// //         <p className="profile-error">{error}</p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="profile-page">
// //       <div className="profile-card">
// //         <h1>Your profile</h1>

// //         <dl className="profile-details">
// //           <dt>Name</dt>
// //           <dd>{user.name}</dd>

// //           <dt>Age</dt>
// //           <dd>{user.age}</dd>

// //           <dt>Occupation</dt>
// //           <dd>{user.occupation}</dd>

// //           <dt>Education</dt>
// //           <dd>{user.education_qualification}</dd>

// //           <dt>Email</dt>
// //           <dd>{user.email}</dd>
// //         </dl>

// //         <div className="profile-actions">
// //           <button className="btn-secondary" onClick={handleLogout}>
// //             Log out
// //           </button>
// //           <button className="btn-danger" onClick={handleDelete} disabled={deleting}>
// //             {deleting ? "Deleting..." : "Delete account"}
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// // import TokenCard from "@/components/TokenCard";
// import { getMe, deleteMe } from "../api/user";
// import { logout } from "../api/auth";

// function initials(name = ""){
//   return name .trim()
//   .split(/\s+/)
//   .slice(0,2)
//   .map((w) => w[0]?.toUpperCase())
//   .join("");
// }

// export default function ProfilePage() {
//   const [user, setUser] = useState(null);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [deleting, setDeleting] = useState(false);
//   const [confirmingDelete, setConfirmingDelete] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     getMe()
//       .then(setUser)
//       .catch((err) => setError(err.message))
//       .finally(() => setLoading(false));
//   }, []);

//   async function handleLogout() {
//     await logout();
//     navigate("/login");
//   }

//   async function handleDelete() {
//     setDeleting(true);
//     try {
//       await deleteMe();
//       localStorage.removeItem("access_token");
//       navigate("/login");
//     } catch (err) {
//       setError(err.message);
//       setDeleting(false);
//     }
//   }

//   return (
//     <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg-deep px-6 py-12 font-body">
//       <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--color-gradient-a)_0%,transparent_50%),radial-gradient(ellipse_at_bottom,var(--color-gradient-b)_0%,transparent_50%)] opacity-35" />

//       <div className="relative z-10 w-full max-w-105">
//         <div className="mb-5">
//           <TokenCard signed={true} instant />
//         </div>

//         {loading && <LoadingCard />}

//         {!loading && error && (
//           <div className="rounded-2xl border border-error/30 bg-error/10 p-6 text-center text-[14px] text-error backdrop-blur-xl">
//             {error}
//           </div>
//         )}

//         {!loading && !error && user && (
//           <div className="rounded-2xl border border-white/10 bg-white/4 p-7 backdrop-blur-xl">
//             {/* Session status */}
//             <div className="mb-6 flex items-center gap-2">
//               <span className="relative flex h-2 w-2">
//                 <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
//                 <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
//               </span>
//               <span className="text-[11px] font-medium uppercase tracking-widest text-text-muted">
//                 Active session
//               </span>
//             </div>

//             {/* Identity */}
//             <div className="mb-7 flex items-center gap-4">
//               <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-cyan to-gradient-a font-display text-lg font-semibold text-bg-deep">
//                 {initials(user.name) || "?"}
//               </div>
//               <div className="min-w-0">
//                 <div className="truncate font-display text-lg font-semibold text-text-primary">
//                   {user.name}
//                 </div>
//                 <div className="truncate text-[13px] text-text-muted">{user.email}</div>
//               </div>
//             </div>

//             {/* Details grid */}
//             <div className="mb-7 grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
//               <Stat label="Age" value={user.age} />
//               <Stat label="Occupation" value={user.occupation} />
//               <Stat label="Education" value={user.education_qualification} span />
//             </div>

//             {/* Actions */}
//             <div className="flex flex-col gap-2.5">
//               <Button
//                 onClick={handleLogout}
//                 variant="ghost"
//                 className="w-full rounded-xl border border-white/10 bg-white/5 text-text-primary hover:bg-white/10"
//               >
//                 Log out
//               </Button>

//               {!confirmingDelete ? (
//                 <button
//                   onClick={() => setConfirmingDelete(true)}
//                   className="mt-1 text-center text-[12px] text-text-muted underline decoration-white/20 underline-offset-4 transition-colors hover:text-error"
//                 >
//                   Delete account
//                 </button>
//               ) : (
//                 <div className="mt-1 rounded-xl border border-error/30 bg-error/[0.06] p-3.5">
//                   <p className="mb-3 text-[12px] leading-relaxed text-text-muted">
//                     This permanently deletes your account and cannot be undone.
//                   </p>
//                   <div className="flex gap-2">
//                     <Button
//                       onClick={handleDelete}
//                       disabled={deleting}
//                       className="flex-1 rounded-lg bg-error font-semibold text-white hover:bg-error/90"
//                     >
//                       {deleting ? "Deleting..." : "Confirm delete"}
//                     </Button>
//                     <Button
//                       onClick={() => setConfirmingDelete(false)}
//                       variant="ghost"
//                       className="flex-1 rounded-lg border border-white/10 text-text-muted hover:bg-white/5"
//                     >
//                       Cancel
//                     </Button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function Stat({ label, value, span }) {
//   return (
//     <div className={span ? "col-span-2" : ""}>
//       <div className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
//         {label}
//       </div>
//       <div className="truncate text-[14px] text-text-primary">{value}</div>
//     </div>
//   );
// }

// function LoadingCard() {
//   return (
//     <div className="animate-pulse rounded-2xl border border-white/10 bg-white/4 p-7 backdrop-blur-xl">
//       <div className="mb-6 h-2 w-24 rounded-full bg-white/10" />
//       <div className="mb-7 flex items-center gap-4">
//         <div className="h-14 w-14 rounded-2xl bg-white/10" />
//         <div className="flex-1 space-y-2">
//           <div className="h-4 w-32 rounded bg-white/10" />
//           <div className="h-3 w-40 rounded bg-white/5" />
//         </div>
//       </div>
//       <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
//         <div className="h-8 rounded bg-white/5" />
//         <div className="h-8 rounded bg-white/5" />
//       </div>
//     </div>
//   );
// }
import AppShell from "@/components/AppShell";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getMe, deleteMe } from "../api/user";
import { logout } from "../api/auth";

function initials(name = "") {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
}

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getMe().then(setUser).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, []);

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteMe();
      localStorage.removeItem("access_token");
      navigate("/login");
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  }

//   return (
//     <div className="min-h-screen bg-bg-muted p-4 font-body">
//       {/* Floating card containing the whole app shell */}
//       <div className="flex h-[calc(100vh-2rem)] w-full overflow-hidden rounded-2xl border border-border bg-bg-panel shadow-lg">
//         {/* Icon sidebar */}
//         <aside className="flex w-16 shrink-0 flex-col items-center gap-6 border-r border-border py-6">
//           <div className="mb-2 h-9 w-9 rounded-lg bg-brand" />
//           <SidebarIcon active label="Profile">
//             <GridIcon />
//           </SidebarIcon>
//           <SidebarIcon label="Chat" onClick={() => navigate("/chat")}>
//             <ChatIcon />
//           </SidebarIcon>
//         </aside>

//         <div className="flex-1">
//           {/* Top bar */}
//           <header className="flex items-center justify-between border-b border-border px-8 py-4">
//             <div>
//               <h1 className="font-display text-lg font-semibold text-text-primary">
//                 {loading ? "Welcome" : `Welcome, ${user?.name?.split(" ")[0] || ""}`}
//               </h1>
//               <p className="text-xs text-text-muted">
//                 {new Date().toLocaleDateString(undefined, { weekday: "short", day: "2-digit", month: "long", year: "numeric" })}
//               </p>
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="rounded-lg border border-border bg-bg-page px-3 py-1.5 text-sm text-text-faint">
//                 Search
//               </div>
//               <div className="h-9 w-9 rounded-full bg-brand/10" />
//             </div>
//           </header>

//           <main className="p-6">
//             {loading && <LoadingCard />}

// {!loading && error && (
//   <div className="mt-6 rounded-2xl border border-error/30 bg-error-bg p-6 text-center text-[14px] text-error">
//     {error}
//   </div>
// )}

// {!loading && !error && user && (
//   <div className="px-2">
//     {/* Banner */}
//     <div className="relative h-28 rounded-2xl bg-gradient-to-r from-brand via-accent-violet to-accent-yellow opacity-90">
//       <div className="absolute -bottom-8 left-6 flex h-16 w-16 items-center justify-center rounded-full border-4 border-bg-panel bg-gradient-to-br from-brand to-accent-violet font-display text-lg font-semibold text-white">
//         {initials(user.name) || "?"}
//       </div>
//     </div>

//     {/* Name, email, Edit */}
//     <div className="mb-8 mt-10 flex items-center justify-between pl-24">
//       <div>
//         <div className="font-display text-lg font-semibold text-text-primary">{user.name}</div>
//         <div className="text-[13px] text-text-muted">{user.email}</div>
//       </div>
//       <Button className="rounded-lg bg-brand text-white hover:bg-brand-dark">
//         Edit
//       </Button>
//     </div>

        return (
          <AppShell
            title={loading ? "Welcome" : `Welcome, ${user?.name?.split(" ")[0] || ""}`}
            subtitle={new Date().toLocaleDateString(undefined, { weekday: "short", day: "2-digit", month: "long", year: "numeric" })}
          >
            <div className="p-6">
              {loading && <LoadingCard />}

              {!loading && error && (
                <div className="mt-6 rounded-2xl border border-error/30 bg-error-bg p-6 text-center text-[14px] text-error">
                  {error}
                </div>
              )}

              {!loading && !error && user && (
                <div className="px-2">
                  {/* Banner */}
                  <div className="relative h-28 rounded-2xl bg-gradient-to-r from-brand via-accent-violet to-accent-yellow opacity-90">
                    <div className="absolute -bottom-8 left-6 flex h-16 w-16 items-center justify-center rounded-full border-4 border-bg-panel bg-gradient-to-br from-brand to-accent-violet font-display text-lg font-semibold text-white">
                      {initials(user.name) || "?"}
                    </div>
                  </div>

                  <div className="mb-8 mt-10 flex items-center justify-between pl-24">
                    <div>
                      <div className="font-display text-lg font-semibold text-text-primary">{user.name}</div>
                      <div className="text-[13px] text-text-muted">{user.email}</div>
                    </div>
                    <Button className="rounded-lg bg-brand text-white hover:bg-brand-dark">
                      Edit
                    </Button>
                  </div>


                {/* Field grid — 2 columns, matching reference */}
                <div className="mb-8 grid grid-cols-2 gap-x-10 gap-y-5">
                  <ReadField label="Full Name" value={user.name} />
                  <ReadField label="Age" value={user.age} />
                  <ReadField label="Occupation" value={user.occupation} />
                  <ReadField label="Education" value={user.education_qualification} />
                  <ReadField label="Email" value={user.email} />
                </div>

                {/* Session + actions footer */}
                <div className="flex items-center justify-between border-t border-border pt-5">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-success" />
                    <span className="text-[12px] font-medium text-text-muted">Active session</span>
                  </div>

                  <div className="flex gap-2.5">
                    <Button onClick={handleLogout} variant="outline" className="rounded-lg border-border text-text-primary hover:bg-bg-muted">
                      Log out
                    </Button>
                    {!confirmingDelete ? (
                      <button onClick={() => setConfirmingDelete(true)} className="text-[13px] text-error hover:underline">
                        Delete account
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <Button onClick={handleDelete} disabled={deleting} className="rounded-lg bg-error text-white hover:bg-error/90">
                          {deleting ? "Deleting..." : "Confirm"}
                        </Button>
                        <Button onClick={() => setConfirmingDelete(false)} variant="outline" className="rounded-lg border-border">
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
        </div>
      </AppShell>
  );
}

function ReadField({ label, value }) {
  return (
    <div>
      <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-text-faint">{label}</div>
      <div className="rounded-lg border border-border bg-bg-muted px-3 py-2 text-[14px] text-text-primary">{value}</div>
    </div>
  );
}

function SidebarIcon({ children, active, label, onClick }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
        active ? "bg-brand/10 text-brand" : "text-text-faint hover:bg-bg-muted hover:text-text-primary"
      }`}
    >
      {children}
    </button>
  );
}

function GridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M3 4h14v9H7l-4 4V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function LoadingCard() {
  return (
    <div className="mt-6 animate-pulse rounded-2xl border border-border p-7">
      <div className="mb-7 flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-bg-muted" />
        <div className="space-y-2">
          <div className="h-4 w-32 rounded bg-bg-muted" />
          <div className="h-3 w-40 rounded bg-bg-muted" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 border-t border-border pt-6">
        <div className="h-10 rounded bg-bg-muted" />
        <div className="h-10 rounded bg-bg-muted" />
      </div>
    </div>
  );
}