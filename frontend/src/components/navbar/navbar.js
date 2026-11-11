'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import logo from '../../assets/logo.png';
import './navbar.css';

const links = [
  { href: '/techboard', label: 'Learning' },
  { href: '/eventspage', label: 'Events' },
  { href: '/team', label: 'People' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/faq', label: 'FAQs' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <nav className="site-nav page-width" aria-label="Main navigation">
        <Link className="brand" href="/" onClick={closeMenu} aria-label="TechNeeds IGDTUW home">
          <Image src={logo} alt="" width={48} height={48} priority />
          <span>
            <strong>TechNeeds</strong>
            <small>IGDTUW · Learn together</small>
          </span>
        </Link>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>

        <div
          className={`nav-content${menuOpen ? ' is-open' : ''}`}
          id="primary-navigation"
        >
          <div className="nav-links">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                aria-current={pathname === href ? 'page' : undefined}
                onClick={closeMenu}
              >
                {label}
              </Link>
            ))}
          </div>
          <Link className="nav-cta" href="/techboard" onClick={closeMenu}>
            Enter the studio <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
