import { useEffect, useState } from "react";
import { ChevronDown, Users, Building2, ChevronRight, Sun, Moon, Plus } from "lucide-react";

type MenuItem = { label: string; href: string };
type MenuGroup = { label: string; items: MenuItem[] };

type NavigationProps = {
    logo?: { src?: string; text?: string; href?: string };
    addPropertyHref?: string;
    accountHref?: string;
    findAgentHref?: string;
    sticky?: boolean;
    className?: string;
    defaultTheme?: "light" | "dark";
    defaultLanguage?: "EN" | "FR";
    onLanguageChange?: (lang: "EN" | "FR") => void;
};

export const Navigation: React.FC<NavigationProps> = ({
                                                          logo = { text: "Property237", href: "/" },
                                                          addPropertyHref = "/add-property",
                                                          accountHref = "/account",
                                                          findAgentHref = "/find-agent",
                                                          sticky = true,
                                                          className = "",
                                                          defaultTheme,
                                                          defaultLanguage = "EN",
                                                          onLanguageChange,
                                                      }) => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [theme, setTheme] = useState<"light" | "dark">(() => {
        if (typeof window === "undefined") return defaultTheme || "light";
        const stored = localStorage.getItem("theme") as "light" | "dark" | null;
        if (stored) return stored;
        if (defaultTheme) return defaultTheme;
        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    });

    const [activeLanguage, setActiveLanguage] = useState<"EN" | "FR">(() => {
        if (typeof window === "undefined") return defaultLanguage;
        const stored = localStorage.getItem("p237-lang") as "EN" | "FR" | null;
        if (stored === "EN" || stored === "FR") return stored;
        const nav = (navigator.language || (navigator as any).userLanguage || "en").toLowerCase();
        return nav.startsWith("fr") ? "FR" : "EN";
    });

    useEffect(() => {
        if (typeof document === "undefined") return;
        const root = document.documentElement;
        if (theme === "dark") root.classList.add("dark");
        else root.classList.remove("dark");
        localStorage.setItem("theme", theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem("p237-lang", activeLanguage);
        onLanguageChange?.(activeLanguage);
    }, [activeLanguage, onLanguageChange]);

    // Static menu data based on your specifications
    const buyersMenu: MenuGroup = {
        label: "For Buyers",
        items: [
            { label: "Bungalows", href: "/buy/bungalows" },
            { label: "Villa / Duplex", href: "/buy/villa-duplex" },
            { label: "Commercial Properties", href: "/buy/commercial" },
            { label: "Land / plots", href: "/buy/land" },
            { label: "Warehouses", href: "/buy/warehouses" },
        ],
    };

    const tenantsMenu: MenuGroup = {
        label: "For Tenants",
        items: [
            { label: "Modern Rooms", href: "/rent/rooms" },
            { label: "Studio", href: "/rent/studio" },
            { label: "Apartments", href: "/rent/apartments" },
            { label: "Bungalows", href: "/rent/bungalows" },
            { label: "Villa / Duplex", href: "/rent/villa-duplex" },
            { label: "Guest Houses", href: "/rent/guest-houses" },
            { label: "Commercial Properties", href: "/rent/commercial-properties" },
            { label: "Land (lease options)", href: "/rent/land" },
            { label: "Warehouses", href: "/rent/warehouses" },
        ],
    };

    const wrapperClass = [
        sticky ? "property237-header" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    const MenuDropdown = ({
                              id,
                              group,
                          }: {
        id: string;
        group: MenuGroup;
    }) => (
        <div
            className="property237-dropdown"
            onMouseEnter={() => setOpenDropdown(id)}
            onMouseLeave={() => setOpenDropdown((v) => (v === id ? null : v))}
        >
            <button
                className="property237-nav-link"
                aria-haspopup="menu"
                aria-expanded={openDropdown === id}
                onClick={() => setOpenDropdown((v) => (v === id ? null : id))}
            >
                {group.label}
                <ChevronDown className="property237-icon-sm" />
            </button>
            {openDropdown === id && (
                <div role="menu" className="property237-dropdown-menu">
                    {group.items.map((item) => (
                        <a key={item.href} href={item.href} className="property237-dropdown-item">
                            <span>{item.label}</span>
                            <ChevronRight className="property237-icon-sm dim" />
                        </a>
                    ))}
                </div>
            )}
        </div>
    );

    const handleLanguageToggle = () => {
        setActiveLanguage((current) => (current === "EN" ? "FR" : "EN"));
    };

    return (
        <header className={wrapperClass}>
            <nav className="property237-nav">
                {/* Left: Logo */}
                <div className="property237-nav-left">
                    <a href={logo.href || "/"} className="property237-logo" aria-label="Home">
                        {logo.src ? (
                            <img src={logo.src} alt="Logo" height={32} width={32} />
                        ) : (
                            <span aria-hidden="true">
                <Building2 className="property237-icon-sm" />
              </span>
                        )}
                        <span>{logo.text || "Property237"}</span>
                    </a>
                </div>

                {/* Center: Menus */}
                <div className="property237-nav-center">
                    <MenuDropdown id="buyers" group={buyersMenu} />
                    <MenuDropdown id="tenants" group={tenantsMenu} />
                    <a href={findAgentHref} className="property237-nav-link">
                        Find an Agent
                    </a>
                </div>

                {/* Right: Actions */}
                <div className="property237-nav-right">
                    <button
                        className="property237-nav-link"
                        aria-label="Toggle theme"
                        onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
                        title="Toggle theme"
                    >
                        {theme === "light" ? (
                            <Sun className="property237-icon-sm" />
                        ) : (
                            <Moon className="property237-icon-sm" />
                        )}
                        <span className="sr-only">Toggle theme</span>
                    </button>
                    <a href={accountHref} className="property237-nav-link" aria-label="Account">
                        <Users className="property237-icon-sm" />
                        <span className="sr-only">User Profile / Dashboard</span>
                    </a>
                    <a href={addPropertyHref} className="property237-cta">
                        <Plus className="property237-icon-sm" />
                        <span>Add Property</span>
                    </a>

                    {/* Language Toggle Pill */}
                    <div className="property237-lang">
                        <button
                            className="property237-lang-toggle"
                            data-lang={activeLanguage}
                            onClick={handleLanguageToggle}
                            aria-label={`Switch to ${activeLanguage === "EN" ? "French" : "English"}`}
                            title={`Currently ${activeLanguage === "EN" ? "English" : "French"}, click to switch`}
                        >
                            <div className="lang-labels">
                                <span>EN</span>
                                <span>FR</span>
                            </div>
                            <div className="switch-knob">{activeLanguage}</div>
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navigation;