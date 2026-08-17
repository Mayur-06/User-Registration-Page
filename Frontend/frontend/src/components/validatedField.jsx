// // import { useState } from "react";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";

// // export default function ValidatedField({
// //   label,
// //   name,
// //   value,
// //   onChange,
// //   validator,
// //   type = "text",
// //   ...inputProps
// // }) {
// //   const [touched, setTouched] = useState(false);

// //   const errorMsg = touched && validator ? validator(value) : null;
// //   const isSuccess = touched && validator && value !== "" && !errorMsg;
// //   const status = errorMsg ? "error" : isSuccess ? "success" : "idle";

// //   const borderClass =
// //     status === "error"
// //       ? "border-error/70 focus-visible:border-error focus-visible:ring-error/30"
// //       : status === "success"
// //       ? "border-success/50 focus-visible:border-success focus-visible:ring-success/30"
// //       : "border-white/15 focus-visible:border-accent-cyan/60 focus-visible:ring-accent-cyan/30";

// //   return (
// //     <div className="flex flex-col gap-1.5">
// //       <Label className="text-[12px] font-medium text-text-muted">{label}</Label>

// //       <div className="relative">
// //         <Input
// //           type={type}
// //           value={value}
// //           onChange={onChange}
// //           onBlur={() => setTouched(true)}
// //           className={`bg-white/5 text-text-primary placeholder:text-text-muted/50 focus-visible:ring-1 pr-8 ${borderClass}`}
// //           {...inputProps}
// //         />
// //         {status === "success" && (
// //           <CheckIcon className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-success" />
// //         )}
// //       </div>

// //       {errorMsg && <span className="text-[11px] text-error">{errorMsg}</span>}
// //     </div>
// //   );
// // }

// // function CheckIcon(props) {
// //   return (
// //     <svg viewBox="0 0 20 20" fill="none" {...props}>
// //       <path
// //         d="M4 10.5l3.5 3.5L16 5"
// //         stroke="currentColor"
// //         strokeWidth="2"
// //         strokeLinecap="round"
// //         strokeLinejoin="round"
// //       />
// //     </svg>
// //   );
// // }

// import { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// export default function ValidatedField({
//   label,
//   name,
//   value,
//   onChange,
//   validator,
//   type = "text",
//   ...inputProps
// }) {
//   const [touched, setTouched] = useState(false);

//   const errorMsg = touched && validator ? validator(value) : null;
//   const isSuccess = touched && validator && value !== "" && !errorMsg;
//   const status = errorMsg ? "error" : isSuccess ? "success" : "idle";

//   const borderClass =
//     status === "error"
//       ? "border-error focus-visible:border-error focus-visible:ring-error/20"
//       : status === "success"
//       ? "border-success focus-visible:border-success focus-visible:ring-success/20"
//       : "border-border focus-visible:border-brand focus-visible:ring-brand/20";

//   return (
//     <div className="flex flex-col gap-1.5">
//       <Label className="text-[13px] font-medium text-text-primary">{label}</Label>

//       <div className="relative">
//         <Input
//           type={type}
//           value={value}
//           onChange={onChange}
//           onBlur={() => setTouched(true)}
//           className={`bg-bg-panel text-text-primary placeholder:text-text-faint focus-visible:ring-2 pr-8 ${borderClass}`}
//           {...inputProps}
//         />
//         {status === "success" && (
//           <CheckIcon className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-success" />
//         )}
//       </div>

//       {errorMsg && <span className="text-[11px] text-error">{errorMsg}</span>}
//     </div>
//   );
// }

// function CheckIcon(props) {
//   return (
//     <svg viewBox="0 0 20 20" fill="none" {...props}>
//       <path
//         d="M4 10.5l3.5 3.5L16 5"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </svg>
//   );
// }



import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ValidatedField({
  label,
  name,
  value,
  onChange,
  validator,
  type = "text",
  ...inputProps
}) {
  const [touched, setTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const actualType = isPassword && showPassword ? "text" : type;

  const errorMsg = touched && validator ? validator(value) : null;
  const isSuccess = touched && validator && value !== "" && !errorMsg;
  const status = errorMsg ? "error" : isSuccess ? "success" : "idle";

  const borderClass =
    status === "error"
      ? "border-error focus-visible:border-error focus-visible:ring-error/20"
      : status === "success"
      ? "border-success focus-visible:border-success focus-visible:ring-success/20"
      : "border-border focus-visible:border-brand focus-visible:ring-brand/20";

  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-[13px] font-medium text-text-primary">{label}</Label>

      <div className="relative">
        <Input
          type={actualType}
          value={value}
          onChange={onChange}
          onBlur={() => setTouched(true)}
          className={`bg-bg-panel text-text-primary placeholder:text-text-faint focus-visible:ring-2 ${
            isPassword ? "pr-16" : "pr-8"
          } ${borderClass}`}
          {...inputProps}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-faint hover:text-text-muted"
            tabIndex={-1}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}

        {!isPassword && status === "success" && (
          <CheckIcon className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-success" />
        )}
      </div>

      {errorMsg && <span className="text-[11px] text-error">{errorMsg}</span>}
    </div>
  );
}

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <path d="M4 10.5l3.5 3.5L16 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path d="M1 10s3-6 9-6 9 6 9 6-3 6-9 6-9-6-9-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path d="M2.5 2.5l15 15M8.3 8.4a2.5 2.5 0 003.3 3.3M6 5.1C3.6 6.4 2 9 2 9s3 6 9 6c1.4 0 2.6-.3 3.7-.8M10 4c6 0 9 6 9 6s-.7 1.4-2 2.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}