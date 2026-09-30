"use client";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Icon } from "./Icon";

export type SelectOption = { value: string | number; label: string };

type SelectProps = {
  value: string | number;
  options: readonly SelectOption[];
  onChange: (value: string) => void;
  label: string;
  className?: string;
  /** Компактный вариант для строки быстрого расчёта. */
  compact?: boolean;
};

/**
 * Полностью кастомный выпадающий список в стиле сайта.
 * Доступность: role=combobox/listbox, aria-activedescendant, клавиатура (↑ ↓ Home End Enter Esc Tab),
 * закрытие по клику вне, возврат фокуса на кнопку.
 */
export function Select({ value, options, onChange, label, className, compact }: SelectProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const selectedIndex = useMemo(
    () => Math.max(0, options.findIndex((option) => String(option.value) === String(value))),
    [options, value],
  );
  const selected = options[selectedIndex];

  useEffect(() => {
    if (!open) return;
    setActiveIndex(selectedIndex);
  }, [open, selectedIndex]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!open || !listRef.current) return;
    const node = listRef.current.children[activeIndex] as HTMLElement | undefined;
    node?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  const commit = (index: number) => {
    const option = options[index];
    if (!option) return;
    onChange(String(option.value));
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp": {
        event.preventDefault();
        if (!open) { setOpen(true); return; }
        const delta = event.key === "ArrowDown" ? 1 : -1;
        setActiveIndex((index) => (index + delta + options.length) % options.length);
        return;
      }
      case "Home": if (open) { event.preventDefault(); setActiveIndex(0); } return;
      case "End": if (open) { event.preventDefault(); setActiveIndex(options.length - 1); } return;
      case "Enter":
      case " ": if (open) { event.preventDefault(); commit(activeIndex); } else { event.preventDefault(); setOpen(true); } return;
      case "Escape": if (open) { event.preventDefault(); setOpen(false); } return;
      case "Tab": setOpen(false); return;
      default: return;
    }
  };

  return (
    <div ref={rootRef} className={["select", compact ? "select-compact" : "", open ? "is-open" : "", className ?? ""].filter(Boolean).join(" ")}>
      <button
        ref={buttonRef}
        type="button"
        className="select-trigger"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-haspopup="listbox"
        aria-label={label}
        aria-activedescendant={open ? `${listId}-${activeIndex}` : undefined}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={onKeyDown}
      >
        <span className="select-value">{selected?.label ?? ""}</span>
        <span className="select-arrow"><Icon name="chevron" size={17} /></span>
      </button>
      {open && (
        <ul ref={listRef} id={listId} className="select-menu" role="listbox" aria-label={label} tabIndex={-1}>
          {options.map((option, index) => {
            const isSelected = String(option.value) === String(value);
            return (
              <li
                key={String(option.value)}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={isSelected}
                className={["select-option", isSelected ? "is-selected" : "", index === activeIndex ? "is-active" : ""].filter(Boolean).join(" ")}
                onPointerEnter={() => setActiveIndex(index)}
                onClick={() => commit(index)}
              >
                <span>{option.label}</span>
                {isSelected && <Icon name="check" size={15} />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
