import Image from 'next/image';
import Link from 'next/link';
import logo from '../../assets/logo.png';
import './footer.css';

const footerLinks = [
  { href: '/techboard', label: 'Learning tracks' },
  { href: '/eventspage', label: 'Events' },
  { href: '/team', label: 'Meet the team' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/faq', label: 'FAQs' },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main page-width">
        <div className="footer-about">
          <Link className="footer-brand" href="/">
            <Image src={logo} alt="" width={54} height={54} />
            <span>TechNeeds <small>IGDTUW</small></span>
          </Link>
          <p>
            A community for curious minds to learn technology, build things that matter,
            and help one another move forward.
          </p>
        </div>
        <div className="footer-links">
          <span className="eyebrow">Explore</span>
          {footerLinks.map(({ href, label }) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
        </div>
        <div className="footer-contact">
          <span className="eyebrow">Say hello</span>
          <a href="mailto:techneedsigdtuw@gmail.com">techneedsigdtuw@gmail.com</a>
          <a href="https://wa.me/918958898580" target="_blank" rel="noreferrer">
            WhatsApp community ↗
          </a>
        </div>
      </div>
      <div className="footer-bottom page-width">
        <span>© {new Date().getFullYear()} TechNeeds IGDTUW</span>
        <span>Made for people who love to learn.</span>
      </div>
    </footer>
  );
}
