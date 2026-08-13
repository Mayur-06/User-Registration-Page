export const validators = {
  name: (v) => {
  if (v.trim().length < 1) return "Name is required";
  if (/^\d+$/.test(v.trim())) return "This doesn't look like a valid name";
  return null;
},
  age: (v) => {
    const n = Number(v);
    if (v === "") return "Age is required";
    if (Number.isNaN(n) || n < 1 || n > 119) return "Enter an age between 1 and 119";
    return null;
  },

  occupation: (v) => {
  if (v.trim().length < 1) return "Occupation is required";
  if (/^\d+$/.test(v.trim())) return "This doesn't look like a valid occupation";
  return null;
},

  education_qualification: (v) => (v.trim().length >= 1 ? null : "This field is required"),
  email: (v) => {
    if (!v) return "Email is required";
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    return ok ? null : "Enter a valid email address";
  },
  password: (v) => (v.length >= 8 ? null : "At least 8 characters"),
};