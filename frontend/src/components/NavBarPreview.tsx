// frontend/src/components/NavBarPreview.tsx
import { useEffect, useMemo, useState } from "react";
import {
    Menu,
    X,
    ChevronDown,
    Search,
    User,
    LogIn,
    Sparkles,
} from "lucide-react";

type NavItem =
    | { type: "link"; label: string; href: string }
    | {
    type: "dropdown";
    label: string;
    items: { label: string; href: string; icon?: React.ReactNode }[];
};

type CTA = { label: string; href: string; variant?: "primary" | "ghost" };

type Props = {
    logo?: { src?: string; text?: string; href?: string };
    items?: NavItem[];
    ctas?: CTA[];
    activePath?: string; // optional manual override if not using location.pathname
    className?: string;
    sticky?: boolean;
    blur?: boolean;
    dark?: boolean;
};

export default function NavBarPreview({
                                          logo = { text: "Brand", href: "/" },
                                          items = [
                                              { type: "link", label: "Buy", href: "/buy" },
                                              { type: "link", label: "Rent", href: "/rent" },
                                              {
                                                  type: "dropdown",
                                                  label: "Explore",
                                                  items: [
                                                      { label: "Map", href: "/map", icon: <Sparkles className="h-4 w-4" /> },
                                                      { label: "Agents", href: "/agents" },
                                                      { label: "Neighborhoods", href: "/neighborhoods" },
                                                  ],
                                              },
                                          ],
                                          ctas = [
                                              { label: "Log in", href: "/login", variant: "ghost" },
                                              { label: "Get started", href: "/signup", variant: "primary" },
                                          ],
                                          activePath,
                                          className = "",
                                          sticky = true,
                                          blur = true,
                                          dark = false,
                                      }: Props) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);

    const currentPath =
        activePath ||
        (typeof window !== "undefined" ? window.location.pathname : "/");

    useEffect(() => {
        if (!mobileOpen) return;
        const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
        document.addEventListener("keydown", onEsc);
        return () => document.removeEventListener("keydown", onEsc);
    }, [mobileOpen]);

    const isDark = dark; // could be wired to a theme
    const wrapperClasses = useMemo(
        () =>
            [
                sticky ? "sticky top-0 z-50" : "",
                "w-full",
                isDark ? "dark" : "",
            ].join(" "),
        [sticky, isDark]
    );

    return (
        <header className={wrapperClasses}>
            <nav
                className={[
                    "mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8",
                    blur
                        ? "backdrop-blur supports-[backdrop-filter]:bg-background/70 bg-background/90"
                        : "bg-background",
                    "border-b border-border/50",
                    className,
                ].join(" ")}
                aria-label="Global"
            >
                {/* Left: Logo */}
                <a
                    className="flex items-center gap-2 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
                    href={logo.href || "/"}
                >
                    {logo.src ? (
                        <img
                            src={logo.src}
                            alt={logo.text || "Logo"}
                            className="h-7 w-7 rounded-md"
                        />
                    ) : (
                        <div className="h-7 w-7 rounded-md bg-primary/15 grid place-items-center">
                            <Sparkles className="h-4 w-4 text-primary" />
                        </div>
                    )}
                    <span className="font-brand text-lg font-semibold text-foreground">
            {logo.text || "Brand"}
          </span>
                </a>

                {/* Center: Desktop nav */}
                <div className="hidden md:flex items-center gap-1">
                    {items.map((item, idx) => {
                        if (item.type === "link") {
                            const active =
                                item.href === "/" ? currentPath === "/" : currentPath.startsWith(item.href);
                            return (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    className={[
                                        "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                        active
                                            ? "text-primary bg-primary/10"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
                                    ].join(" ")}
                                >
                                    {item.label}
                                </a>
                            );
                        }
                        return (
                            <div
                                key={idx}
                                className="relative"
                                onMouseEnter={() => setOpenDropdown(idx)}
                                onMouseLeave={() => setOpenDropdown((v) => (v === idx ? null : v))}
                            >
                                <button
                                    className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                                    aria-haspopup="menu"
                                    aria-expanded={openDropdown === idx}
                                    onClick={() =>
                                        setOpenDropdown((v) => (v === idx ? null : idx))
                                    }
                                >
                                    {item.label}
                                    <ChevronDown className="h-4 w-4" />
                                </button>
                                {openDropdown === idx && (
                                    <div
                                        role="menu"
                                        className="absolute left-0 mt-2 w-56 rounded-lg border border-border bg-popover shadow-lg p-2"
                                    >
                                        {item.items.map((sub) => (
                                            <a
                                                key={sub.href}
                                                href={sub.href}
                                                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40"
                                                role="menuitem"
                                            >
                                                {sub.icon}
                                                <span>{sub.label}</span>
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Right: Actions */}
                <div className="hidden md:flex items-center gap-2">
                    <a
                        href="/search"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    >
                        <Search className="h-4 w-4" />
                        <span>Search</span>
                    </a>
                    {ctas.map((cta) =>
                        cta.variant === "primary" ? (
                            <a
                                key={cta.href}
                                href={cta.href}
                                className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90"
                            >
                                <Sparkles className="h-4 w-4" />
                                {cta.label}
                            </a>
                        ) : (
                            <a
                                key={cta.href}
                                href={cta.href}
                                className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium border border-border hover:bg-muted/40"
                            >
                                <LogIn className="h-4 w-4" />
                                {cta.label}
                            </a>
                        )
                    )}
                    <a
                        href="/account"
                        className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-muted/40"
                        aria-label="Account"
                    >
                        <User className="h-4 w-4" />
                    </a>
                </div>

                {/* Mobile toggle */}
                <button
                    className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-border hover:bg-muted/40"
                    aria-label="Open menu"
                    aria-expanded={mobileOpen}
                    onClick={() => setMobileOpen(true)}
                >
                    <Menu className="h-5 w-5" />
                </button>
            </nav>

            {/* Mobile sheet */}
            {mobileOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    className="fixed inset-0 z-[60] md:hidden"
                >
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setMobileOpen(false)}
                    />
                    <div className="absolute right-0 top-0 h-full w-[86%] max-w-sm bg-background border-l border-border shadow-xl p-4 flex flex-col">
                        <div className="flex items-center justify-between">
                            <a className="flex items-center gap-2" href={logo.href || "/"}>
                                {logo.src ? (
                                    <img src={logo.src} alt="Logo" className="h-7 w-7 rounded-md" />
                                ) : (
                                    <div className="h-7 w-7 rounded-md bg-primary/15 grid place-items-center">
                                        <Sparkles className="h-4 w-4 text-primary" />
                                    </div>
                                )}
                                <span className="font-brand text-lg font-semibold">
                  {logo.text || "Brand"}
                </span>
                            </a>
                            <button
                                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border hover:bg-muted/40"
                                aria-label="Close menu"
                                onClick={() => setMobileOpen(false)}
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mt-4 flex-1 overflow-y-auto">
                            <a
                                href="/search"
                                className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40"
                            >
                                <Search className="h-4 w-4" />
                                Search
                            </a>

                            <div className="mt-2 space-y-1">
                                {items.map((item, idx) => {
                                    if (item.type === "link") {
                                        const active =
                                            item.href === "/"
                                                ? currentPath === "/"
                                                : currentPath.startsWith(item.href);
                                        return (
                                            <a
                                                key={item.href}
                                                href={item.href}
                                                className={[
                                                    "block rounded-md px-3 py-2 text-sm",
                                                    active
                                                        ? "text-primary bg-primary/10"
                                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
                                                ].join(" ")}
                                                onClick={() => setMobileOpen(false)}
                                            >
                                                {item.label}
                                            </a>
                                        );
                                    }
                                    return (
                                        <div key={idx} className="rounded-md border border-border">
                                            <div className="px-3 py-2 text-xs font-semibold uppercase text-muted-foreground">
                                                {item.label}
                                            </div>
                                            <div className="p-1">
                                                {item.items.map((sub) => (
                                                    <a
                                                        key={sub.href}
                                                        href={sub.href}
                                                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40"
                                                        onClick={() => setMobileOpen(false)}
                                                    >
                                                        {sub.icon}
                                                        <span>{sub.label}</span>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mt-4 space-y-2">
                            {ctas.map((cta) =>
                                cta.variant === "primary" ? (
                                    <a
                                        key={cta.href}
                                        href={cta.href}
                                        className="block text-center rounded-md px-3 py-2 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        {cta.label}
                                    </a>
                                ) : (
                                    <a
                                        key={cta.href}
                                        href={cta.href}
                                        className="block text-center rounded-md px-3 py-2 text-sm font-medium border border-border hover:bg-muted/40"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        {cta.label}
                                    </a>
                                )
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}