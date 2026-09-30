"use client";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";

type NumberFieldProps = {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  /** Единица измерения выводится отдельным элементом и не перекрывается стрелками. */
  suffix: string;
  label: string;
  decreaseLabel: string;
  increaseLabel: string;
  id?: string;
};

/**
 * Числовое поле со своими кнопками − / + вместо браузерных стрел.
 * Значение зажимается в границы, единица измерения всегда видна справа.
 */
export function NumberField({
  value, onChange, min, max, step = 1, suffix, label, decreaseLabel, increaseLabel, id,
}: NumberFieldProps) {
  const [text, setText] = useState(String(value));

  useEffect(() => {
    setText((current) => (Number(current.replace(",", ".")) === value ? current : String(value)));
  }, [value]);

  const clamp = (next: number) => Math.min(max, Math.max(min, next));

  const commit = (raw: string) => {
    const parsed = Number(raw.replace(",", "."));
    if (!Number.isFinite(parsed)) {
      setText(String(value));
      return;
    }
    const next = clamp(parsed);
    setText(String(next));
    if (next !== value) onChange(next);
  };

  const nudge = (delta: number) => {
    const next = clamp((Number.isFinite(value) ? value : min) + delta);
    setText(String(next));
    onChange(next);
  };

  return (
    <div className="number-field">
      <button type="button" className="number-step" onClick={() => nudge(-step)} aria-label={`${decreaseLabel}: ${label}`} disabled={value <= min}>
        <Icon name="minus" size={14} />
      </button>
      <input
        id={id}
        className="number-input"
        type="text"
        inputMode="decimal"
        autoComplete="off"
        aria-label={label}
        value={text}
        onChange={(event) => {
          const next = event.target.value;
          if (!/^\d{0,4}([.,]\d{0,2})?$/.test(next)) return;
          setText(next);
          const parsed = Number(next.replace(",", "."));
          if (Number.isFinite(parsed) && parsed >= min && parsed <= max) onChange(parsed);
        }}
        onBlur={() => commit(text)}
        onKeyDown={(event) => {
          if (event.key === "ArrowUp") { event.preventDefault(); nudge(step); }
          if (event.key === "ArrowDown") { event.preventDefault(); nudge(-step); }
          if (event.key === "Enter") commit(text);
        }}
      />
      <span className="number-suffix">{suffix}</span>
      <button type="button" className="number-step" onClick={() => nudge(step)} aria-label={`${increaseLabel}: ${label}`} disabled={value >= max}>
        <Icon name="plus" size={14} />
      </button>
    </div>
  );
}
