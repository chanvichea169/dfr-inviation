import { useId } from "react";
import { CircleAlert } from "lucide-react";

interface FieldProps {
  label: string;
  /** Rendered with the label; use for the "optional"/"required" nuance. */
  badge?: React.ReactNode;
  hint?: string;
  error?: string | null;
  required?: boolean;
  /** Receives the generated ids so the control can wire up its a11y attrs. */
  children: (ids: { id: string; labelId: string; describedBy?: string }) => React.ReactNode;
}

export function Field({
  label,
  badge,
  hint,
  error,
  required,
  children,
}: FieldProps) {
  const base = useId();
  const id = `${base}-control`;
  const labelId = `${base}-label`;
  const hintId = `${base}-hint`;
  const errorId = `${base}-error`;

  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div className="min-w-0">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label id={labelId} htmlFor={id} className="text-[13px] font-semibold text-ink-muted">
          {label}
          {required && <span className="ms-1 text-rose-500">*</span>}
        </label>
        {badge}
      </div>

      {children({ id, labelId, describedBy })}

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400"
        >
          <CircleAlert size={13} className="shrink-0" />
          {error}
        </p>
      ) : (
        hint && (
          <p id={hintId} className="hint">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

/** A right-aligned live character counter that warns as the limit approaches. */
export function CharCount({ value, max }: { value: string; max: number }) {
  const near = value.length > max * 0.9;
  return (
    <span
      className={`tabular-nums text-[11px] font-medium transition-colors ${
        near ? "text-gold-600 dark:text-gold-400" : "text-ink-faint"
      }`}
    >
      {value.length}/{max}
    </span>
  );
}
