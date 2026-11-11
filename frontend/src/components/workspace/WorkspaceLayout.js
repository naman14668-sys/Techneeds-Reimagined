import Link from 'next/link';

const navigation = {
  mentee: [
    { href: '/dashboard', label: 'My learning', key: 'learning' },
    { href: '/profile', label: 'My profile', key: 'profile' },
    { href: '/leaderboard', label: 'Leaderboard', key: 'leaderboard' },
  ],
  mentor: [
    { href: '/mentor', label: 'Mentor studio', key: 'studio' },
    { href: '/techboard', label: 'Learning hub', key: 'learning' },
  ],
  admin: [
    { href: '/admin', label: 'Programs & mentors', key: 'admin' },
    { href: '/techboard', label: 'Learning hub', key: 'learning' },
  ],
};

export default function WorkspaceLayout({
  role,
  active,
  eyebrow,
  title,
  description,
  onLogout,
  children,
}) {
  const links = navigation[role] || [];

  return (
    <div className="workspace-page">
      <div className="workspace-shell">
        <aside className="workspace-sidebar">
          <p className="workspace-label">{role} workspace</p>
          <nav className="workspace-nav" aria-label={`${role} workspace navigation`}>
            {links.map(({ href, label, key }) => (
              <Link key={key} href={href} aria-current={active === key ? 'page' : undefined}>
                {label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="workspace-main">
          <header className="workspace-heading">
            <div>
              <span className="eyebrow">{eyebrow}</span>
              <h1>{title}</h1>
              {description && <p>{description}</p>}
            </div>
            {onLogout && (
              <button className="button button-secondary" type="button" onClick={onLogout}>
                Sign out
              </button>
            )}
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
