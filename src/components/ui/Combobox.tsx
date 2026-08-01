import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  Check,
  ChevronDown,
  CircleAlert,
  LoaderCircle,
  PencilLine,
  Search,
  X,
} from "lucide-react";

export interface ComboboxOption {
  value: string;
  label: string;
}

/** `value` is the option code; it is empty when `label` is free text. */
export interface ComboboxValue {
  value: string;
  label: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  selected: ComboboxValue;
  onChange: (next: ComboboxValue) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  disabledHint?: string;
  loading?: boolean;
  /** Offers an "use what I typed" row so unlisted places can still be entered. */
  allowCustom?: boolean;
  invalid?: boolean;
  icon?: React.ReactNode;
  labelId?: string;
}

/** Villages number in the tens of thousands; only ever paint a window of them. */
const MAX_RENDERED = 60;

const EMPTY: ComboboxValue = { value: "", label: "" };

export default function Combobox({
  options,
  selected,
  onChange,
  placeholder = "ជ្រើសរើស...",
  searchPlaceholder = "ស្វែងរក...",
  disabled = false,
  disabledHint,
  loading = false,
  allowCustom = true,
  invalid = false,
  icon,
  labelId,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const listboxId = useId();
  const optionId = (index: number) => `${listboxId}-opt-${index}`;

  const normalizedQuery = query.trim().toLowerCase();

  const matches = useMemo(() => {
    if (!normalizedQuery) return options;
    // Prefix hits first — typing "ភ" should surface ភ្នំពេញ before ក្រុងព្រះស៊ីហនុ.
    const starts: ComboboxOption[] = [];
    const contains: ComboboxOption[] = [];
    for (const option of options) {
      const label = option.label.toLowerCase();
      if (label.startsWith(normalizedQuery)) starts.push(option);
      else if (label.includes(normalizedQuery)) contains.push(option);
    }
    return starts.concat(contains);
  }, [options, normalizedQuery]);

  const visible = matches.slice(0, MAX_RENDERED);
  const overflow = matches.length - visible.length;

  const customLabel = query.trim();
  const showCustomRow =
    allowCustom &&
    customLabel.length > 0 &&
    !matches.some((option) => option.label === customLabel);

  // The custom row lives at the end of the same keyboard ring as the options.
  const rowCount = visible.length + (showCustomRow ? 1 : 0);
  const customIndex = showCustomRow ? visible.length : -1;

  const close = useCallback((refocus = true) => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
    if (refocus) triggerRef.current?.focus();
  }, []);

  const commit = useCallback(
    (next: ComboboxValue) => {
      onChange(next);
      close();
    },
    [onChange, close]
  );

  const pick = useCallback(
    (index: number) => {
      if (index === customIndex) {
        commit({ value: "", label: customLabel });
        return;
      }
      const option = visible[index];
      if (option) commit(option);
    },
    [visible, customIndex, customLabel, commit]
  );

  /* --- positioning: the panel is portalled so parent `overflow-hidden`
         (the form card) cannot clip it ------------------------------------- */
  const [rect, setRect] = useState<{
    left: number;
    top: number;
    width: number;
    placement: "bottom" | "top";
    maxHeight: number;
  } | null>(null);

  const reposition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const box = trigger.getBoundingClientRect();
    const gap = 8;
    const below = window.innerHeight - box.bottom - gap - 12;
    const above = box.top - gap - 12;
    const placeTop = below < 240 && above > below;
    setRect({
      left: box.left,
      width: box.width,
      top: placeTop ? box.top - gap : box.bottom + gap,
      placement: placeTop ? "top" : "bottom",
      maxHeight: Math.max(200, Math.min(380, placeTop ? above : below)),
    });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    reposition();
    inputRef.current?.focus();
  }, [open, reposition]);

  useEffect(() => {
    if (!open) return;
    const onScrollOrResize = () => reposition();
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [open, reposition]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        panelRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      ) {
        return;
      }
      close(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, close]);

  // Keep the active row inside the scroll viewport as it moves.
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector<HTMLElement>(`[data-row="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex, normalizedQuery]);

  useEffect(() => setActiveIndex(0), [normalizedQuery]);

  const onTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
      return;
    }
    // Type-to-open: seed the search box with the first character.
    if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
      setQuery(event.key);
      setOpen(true);
    }
  };

  const onPanelKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((i) => (rowCount === 0 ? 0 : (i + 1) % rowCount));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((i) => (rowCount === 0 ? 0 : (i - 1 + rowCount) % rowCount));
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(Math.max(0, rowCount - 1));
        break;
      case "Enter":
        event.preventDefault();
        pick(activeIndex);
        break;
      case "Escape":
        event.preventDefault();
        close();
        break;
      case "Tab":
        close(false);
        break;
    }
  };

  const hasValue = selected.label.length > 0;
  const isCustom = hasValue && !selected.value;

  return (
    <>
      {/* The trigger is a transparent button stretched over the whole control so
          the "clear" button can be a real sibling — a <button> inside a <button>
          is invalid HTML and screen readers skip the inner one. */}
      <div
        className={`field group relative flex items-center gap-2.5 ${
          invalid ? "field-invalid" : ""
        } ${
          open
            ? "border-brand-500 bg-surface ring-4 ring-brand-500/15"
            : "focus-within:border-brand-500 focus-within:bg-surface focus-within:ring-4 focus-within:ring-brand-500/15"
        } ${disabled ? "cursor-not-allowed opacity-55" : "cursor-pointer"}`}
      >
        <button
          ref={triggerRef}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={open ? listboxId : undefined}
          aria-labelledby={labelId}
          aria-invalid={invalid || undefined}
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={onTriggerKeyDown}
          className="absolute inset-0 rounded-2xl focus:outline-none focus-visible:ring-0"
        >
          <span className="sr-only">
            {hasValue ? selected.label : placeholder}
          </span>
        </button>

        {icon && (
          <span className="pointer-events-none shrink-0 text-ink-faint transition-colors group-hover:text-brand-500">
            {icon}
          </span>
        )}

        <span
          aria-hidden="true"
          className={`pointer-events-none min-w-0 flex-1 truncate ${
            hasValue ? "text-ink" : "text-ink-faint"
          }`}
        >
          {hasValue ? selected.label : disabled ? disabledHint ?? placeholder : placeholder}
        </span>

        {isCustom && (
          <span
            className="pointer-events-none shrink-0 text-gold-500"
            title="បញ្ចូលដោយដៃ"
          >
            <PencilLine size={14} />
          </span>
        )}

        {hasValue && !disabled && (
          <button
            type="button"
            aria-label="សម្អាតតម្លៃ"
            onClick={() => onChange(EMPTY)}
            className="relative shrink-0 rounded-full p-1 text-ink-faint transition hover:bg-line hover:text-ink"
          >
            <X size={13} />
          </button>
        )}

        {loading ? (
          <LoaderCircle
            size={15}
            className="pointer-events-none shrink-0 animate-spin text-brand-500"
          />
        ) : (
          <ChevronDown
            size={16}
            aria-hidden="true"
            className={`pointer-events-none shrink-0 text-ink-faint transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        )}
      </div>

      {open &&
        rect &&
        createPortal(
          <div
            ref={panelRef}
            onKeyDown={onPanelKeyDown}
            style={{
              position: "fixed",
              left: rect.left,
              top: rect.placement === "bottom" ? rect.top : undefined,
              bottom:
                rect.placement === "top"
                  ? window.innerHeight - rect.top
                  : undefined,
              width: rect.width,
              zIndex: 90,
            }}
            className="animate-scale-in overflow-hidden rounded-2xl border border-line bg-surface-raised shadow-lift"
          >
            <div className="flex items-center gap-2 border-b border-line px-3.5 py-2.5">
              <Search size={15} className="shrink-0 text-ink-faint" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={searchPlaceholder}
                aria-autocomplete="list"
                aria-controls={listboxId}
                aria-activedescendant={rowCount ? optionId(activeIndex) : undefined}
                className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
              />
              {query && (
                <button
                  type="button"
                  aria-label="សម្អាតការស្វែងរក"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  className="rounded-full p-1 text-ink-faint transition hover:bg-line hover:text-ink"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <ul
              ref={listRef}
              id={listboxId}
              role="listbox"
              aria-labelledby={labelId}
              style={{ maxHeight: rect.maxHeight }}
              className="overflow-y-auto overscroll-contain py-1.5"
            >
              {visible.map((option, index) => {
                const isActive = index === activeIndex;
                const isSelected = option.value === selected.value;
                return (
                  <li key={option.value} role="none">
                    <div
                      id={optionId(index)}
                      data-row={index}
                      role="option"
                      aria-selected={isSelected}
                      onPointerEnter={() => setActiveIndex(index)}
                      onClick={() => pick(index)}
                      className={`mx-1.5 flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors ${
                        isActive ? "bg-brand-500/10 text-ink" : "text-ink-muted"
                      }`}
                    >
                      <span className="min-w-0 flex-1 truncate">{option.label}</span>
                      {isSelected && (
                        <Check size={15} className="shrink-0 text-brand-600" />
                      )}
                    </div>
                  </li>
                );
              })}

              {showCustomRow && (
                <li role="none">
                  <div
                    id={optionId(customIndex)}
                    data-row={customIndex}
                    role="option"
                    aria-selected={false}
                    onPointerEnter={() => setActiveIndex(customIndex)}
                    onClick={() => pick(customIndex)}
                    className={`mx-1.5 mt-1 flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-line-strong px-3 py-2 text-sm transition-colors ${
                      activeIndex === customIndex
                        ? "bg-gold-400/15 text-ink"
                        : "text-ink-muted"
                    }`}
                  >
                    <PencilLine size={14} className="shrink-0 text-gold-500" />
                    <span className="min-w-0 flex-1 truncate">
                      ប្រើ “{customLabel}”
                    </span>
                    <span className="shrink-0 text-[11px] text-ink-faint">បញ្ចូលដោយដៃ</span>
                  </div>
                </li>
              )}

              {rowCount === 0 && (
                <li
                  role="none"
                  className="flex flex-col items-center gap-1.5 px-4 py-8 text-center"
                >
                  <CircleAlert size={18} className="text-ink-faint" />
                  <p className="text-sm text-ink-muted">
                    {loading ? "កំពុងទាញយកទិន្នន័យ..." : "រកមិនឃើញលទ្ធផល"}
                  </p>
                  {!loading && !allowCustom && (
                    <p className="text-xs text-ink-faint">សូមព្យាយាមពាក្យស្វែងរកផ្សេង</p>
                  )}
                </li>
              )}
            </ul>

            {overflow > 0 && (
              <div className="border-t border-line bg-surface-sunken px-3.5 py-2 text-center text-[11px] text-ink-faint">
                បង្ហាញ {visible.length} ក្នុងចំណោម {matches.length} — សូមបញ្ចូលពាក្យបន្ថែម
              </div>
            )}
          </div>,
          document.body
        )}
    </>
  );
}
