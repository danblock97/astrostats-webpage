"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import NavLink from "./NavLink";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import MenuOverlay from "./MenuOverlay";
import { useSession, signIn, signOut } from "next-auth/react";

const navLinks = [
  { title: "Premium", path: "/pricing" },
  { title: "Invite", path: "https://discord.gg/BeszQxTn9D" },
  { title: "Support", path: "/support" },
  { title: "Docs", path: "/commands" },
];

const Navbar = () => {
	const [navbarOpen, setNavbarOpen] = useState(false);
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    function onDocClick(e) {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        if (!session) return setIsPremium(false);
        const res = await fetch("/api/me");
        if (res.ok) {
          const data = await res.json();
          setIsPremium(Boolean(data.premium));
        }
      } catch {}
    };
    load();
  }, [session]);

	// No useEffect needed anymore as we've removed the Jira issue collector functionality

	return (
    <nav className="fixed mx-auto top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#121212]/95 backdrop-blur supports-[backdrop-filter]:bg-[#121212]/70">
      <div className="flex container h-16 items-center justify-between mx-auto px-4">
                <Link
                    href="/"
                    className="text-xl md:text-3xl text-white font-semibold"
                >
					AstroStats
				</Link>
				<div className="mobile-menu block md:hidden">
					{!navbarOpen ? (
						<button
							onClick={() => setNavbarOpen(true)}
							className="flex items-center px-3 py-2 border rounded border-slate-200 text-slate-200 hover:text-white hover:border-white"
						>
							<Bars3Icon className="h-5 w-5" />
						</button>
					) : (
						<button
							onClick={() => setNavbarOpen(false)}
							className="flex items-center px-3 py-2 border rounded border-slate-200 text-slate-200 hover:text-white hover:border-white"
						>
							<XMarkIcon className="h-5 w-5" />
						</button>
					)}
				</div>
        <div className="hidden items-center gap-6 md:flex">
          <div className="menu md:w-auto" id="navbar">
            <ul className="flex p-4 md:p-0 md:flex-row md:space-x-6 mt-0">
              {navLinks.map((link, index) => (
                <li key={index}>
                  {link.path.startsWith("http") ? (
                    <a href={link.path} target="_blank" rel="noreferrer" className="block py-2 pl-3 pr-4 text-[#adb7be] text-sm md:text-sm rounded md:p-0 hover:text-white">{link.title}</a>
                  ) : (
                    <NavLink href={link.path} title={link.title} />
                  )}
                </li>
              ))}
            </ul>
          </div>
          {!session ? (
            <button
              onClick={() => signIn("discord")}
              className="rounded-lg bg-[#5865F2] px-3 py-2 text-xs md:text-sm font-semibold text-white hover:bg-[#4752C4]"
            >
              Login with Discord
            </button>
          ) : (
            <button
              onClick={() => signOut()}
              className="rounded-lg bg-white/10 px-3 py-2 text-xs md:text-sm text-white hover:bg-white/20"
            >
              Sign out
            </button>
          )}
        </div>
			</div>
			{navbarOpen ? <MenuOverlay links={navLinks} /> : null}
		</nav>
	);
};

export default Navbar;
