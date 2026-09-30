"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Мягкое появление блока при прокрутке.
 * Работает только при наличии JS (класс js на <html>) и не мешает, если анимации отключены системно.
 */
export function Reveal({
  children, className, delay = 0, as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "article" | "li";
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const props = {
    ref: ref as React.Ref<never>,
    className: ["reveal", visible ? "is-visible" : "", className ?? ""].filter(Boolean).join(" "),
    style: delay ? { transitionDelay: `${delay}ms` } : undefined,
  };

  return <Tag {...props}>{children}</Tag>;
}
