"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Shield, Sparkles, Wrench } from "lucide-react";
import type { ComponentType } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/#tools", label: "Tools", icon: Wrench },
  { href: "/#whats-new", label: "What's New?", icon: Sparkles },
  { href: "/#tutorials", label: "Tutorials", icon: BookOpen },
  { href: "/admin", label: "Admin", icon: Shield }
];

function hrefHash(href: string) {
  const idx = href.indexOf("#");
  return idx >= 0 ? href.slice(idx) : "";
}

export function Navbar() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");
  const [visible, setVisible] = useState(true);
  const visibleRef = useRef(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const lastScrollYRef = useRef(0);
  const lastMouseYRef = useRef<number | null>(null);
  const lastToggleTsRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const mouseRafRef = useRef<number | null>(null);

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash || "");
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(media.matches);
    updateMotion();

    const onMediaChange = () => updateMotion();
    media.addEventListener("change", onMediaChange);

    const revealZonePx = 64;
    const topStayVisiblePx = 16;
    const hideAfterPx = 72;
    const cursorUpDelta = 14;
    const cooldownMs = 320;

    const toggleVisible = (next: boolean) => {
      const now = performance.now();
      if (next === visibleRef.current) return;
      if (now - lastToggleTsRef.current < cooldownMs) return;
      lastToggleTsRef.current = now;
      visibleRef.current = next;
      setVisible(next);
    };

    const onScroll = () => {
      if (rafRef.current !== null) return;

      rafRef.current = window.requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const lastY = lastScrollYRef.current;
        const delta = currentY - lastY;

        if (currentY <= topStayVisiblePx) {
          toggleVisible(true);
        } else if (delta < -2) {
          toggleVisible(true);
        } else if (delta > 2 && currentY > hideAfterPx) {
          toggleVisible(false);
        }

        lastScrollYRef.current = currentY;
        rafRef.current = null;
      });
    };

    const onMouseMove = (ev: MouseEvent) => {
      if (mouseRafRef.current !== null) return;
      mouseRafRef.current = window.requestAnimationFrame(() => {
        const currentY = ev.clientY;
        const lastY = lastMouseYRef.current;

        if (currentY <= revealZonePx) {
          toggleVisible(true);
        } else if (lastY !== null && currentY < lastY - cursorUpDelta) {
          toggleVisible(true);
        }

        lastMouseYRef.current = currentY;
        mouseRafRef.current = null;
      });
    };

    lastScrollYRef.current = window.scrollY;
    lastToggleTsRef.current = performance.now();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      media.removeEventListener("change", onMediaChange);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
      if (mouseRafRef.current !== null) {
        window.cancelAnimationFrame(mouseRafRef.current);
      }
    };
  }, []);

  const activeKey = useMemo(() => {
    if (pathname.startsWith("/admin")) return "/admin";
    if (pathname !== "/") return "";
    if (hash) return hash;
    return "#tools";
  }, [pathname, hash]);

  const isActive = (item: NavItem) => {
    if (item.href === "/admin") return activeKey === "/admin";
    return hrefHash(item.href) === activeKey;
  };

  const desktopItems = NAV_ITEMS.filter((item) => item.href !== "/admin");

  return (
    <>
      <header className="hidden md:block sticky top-0 z-40">
        <div className="h-14 overflow-hidden">
          <div
            className={`h-14 border-b border-border bg-surface ${
              reducedMotion ? "" : "transition-transform duration-200 ease-out"
            } ${visible ? "translate-y-0" : "-translate-y-full"}`}
          >
            <div className="mx-auto max-w-6xl px-4">
              <nav className="h-14 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                <div className="justify-self-start pl-1">
                  <Link href="/" aria-label="NIT" className="inline-flex items-center">
                    <Image
                      src="/nit-logo.png"
                      alt="NIT"
                      width={180}
                      height={40}
                      priority
                      className="h-8 w-auto object-contain"
                    />
                  </Link>
                </div>

                <div className="justify-self-center flex items-center gap-1">
                  {desktopItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                        isActive(item)
                          ? "text-accent underline underline-offset-8 decoration-accent/70"
                          : "text-muted hover:text-accent"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                <div className="justify-self-end pr-1">
                  <Link
                    href="/admin"
                    aria-label="Acesso admin"
                    title="Admin"
                    className={`rounded-xl p-2 transition-colors ${
                      activeKey === "/admin" ? "text-accent" : "text-muted hover:text-accent"
                    }`}
                  >
                    <Shield className="h-4 w-4" />
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 surface border-t border-border">
        <div className="mx-auto max-w-6xl px-2">
          <div className="grid grid-cols-4">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                    active ? "text-accent" : "text-muted hover:text-accent"
                  }`}
                >
                  <Icon className={`h-4 w-4 transition-colors ${active ? "text-accent" : "text-muted group-hover:text-accent"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
