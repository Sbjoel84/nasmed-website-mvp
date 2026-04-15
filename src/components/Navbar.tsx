import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import logo from "@/assets/nasmed-logo.png";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Strategic Plan", path: "/strategic-plan" },
  { label: "Membership", path: "/membership" },
  { label: "Publications", path: "/publications" },
  { label: "Store", path: "/store" },
  { label: "News", path: "/news" },
  { label: "Contact", path: "/contact" },
  { label: "Member Login", path: "/member-login" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[1000] px-5 md:px-10 py-3 flex items-center justify-between bg-nasmed-navy/[0.97] backdrop-blur-xl shadow-[0_2px_24px_rgba(0,0,0,.18)]">
      <Link to="/" className="flex items-center gap-2.5 no-underline">
        <img src={logo} alt="NASMED" className="w-[52px] h-[52px] rounded-full object-cover border-2 border-white/25 bg-white p-0.5" />
        <div className="flex flex-col leading-none">
          <strong className="text-white text-[15px] font-bold tracking-wide">NASMED</strong>
        </div>
      </Link>

      {/* Mobile toggle */}
      <button className="md:hidden text-white text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? "✕" : "☰"}
      </button>

      {/* Links */}
      <ul className={`${menuOpen ? "flex" : "hidden"} md:flex flex-col md:flex-row absolute md:static top-full left-0 right-0 bg-nasmed-navy md:bg-transparent items-center gap-1 md:gap-6 list-none p-4 md:p-0`}>
        {navLinks.map((link) => {
          const isActive = pathname === link.path;
          return (
            <li key={link.label}>
              <Link
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`text-white/80 no-underline text-[13.5px] font-medium tracking-wide transition-colors hover:text-white relative block py-2 md:py-1 group
                  ${isActive ? "!text-white" : ""}`}
              >
                {link.label}
                {/* Active white underline */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white rounded-full" />
                )}
                {/* Hover green underline - animated from left */}
                {!isActive && (
                  <span className="absolute bottom-0 left-0 h-[2px] bg-nasmed-green rounded-full w-0 group-hover:w-full transition-all duration-300 ease-out" />
                )}
              </Link>
            </li>
          );
        })}
        <li>
          <Link to="/membership" onClick={() => setMenuOpen(false)} className="bg-nasmed-green text-white border-none py-2 px-5 rounded-md text-[13px] font-semibold no-underline transition-all hover:bg-nasmed-green-light hover:-translate-y-px">
            Join NASMED
          </Link>
        </li>
      </ul>
    </nav>
  );
}
