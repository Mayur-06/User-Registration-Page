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

  const errorMsg = touched && validator ? validator(value) : null;
  const isSuccess = touched && validator && value !== "" && !errorMsg;
  const status = errorMsg ? "error" : isSuccess ? "success" : "idle";

  const borderClass =
    status === "error"
      ? "border-error/70 focus-visible:border-error focus-visible:ring-error/30"
      : status === "success"
      ? "border-success/50 focus-visible:border-success focus-visible:ring-success/30"
      : "border-white/15 focus-visible:border-accent-cyan/60 focus-visible:ring-accent-cyan/30";

  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-[12px] font-medium text-text-muted">{label}</Label>

      <div className="relative">
        <Input
          type={type}
          value={value}
          onChange={onChange}
          onBlur={() => setTouched(true)}
          className={`bg-white/5 text-text-primary placeholder:text-text-muted/50 focus-visible:ring-1 pr-8 ${borderClass}`}
          {...inputProps}
        />
        {status === "success" && (
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
      <path
        d="M4 10.5l3.5 3.5L16 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}