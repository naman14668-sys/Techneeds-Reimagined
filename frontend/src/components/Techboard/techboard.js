'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './techboard.css';

export default function Techboard() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const menteeToken = localStorage.getItem('menteeToken');
    const mentorToken = localStorage.getItem('token');

    if (menteeToken) {
      router.replace('/dashboard');
      return;
    }
    if (mentorToken) {
      router.replace('/mentor');
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return <main className="techboard-page page-width"><div className="empty-state" role="status">Finding your place…</div></main>;
  }

  return (
    <main className="techboard-page page-width">
      <header className="page-intro">
        <span className="eyebrow">Your next step starts here</span>
        <h1>Make a little<br /><em>room to grow.</em></h1>
        <p>Already part of a cohort, mentoring others, or just finding your way around? Choose the path that fits.</p>
      </header>
      <section className="role-grid" aria-label="Choose your TechNeeds space">
        <article className="role-card role-mentee">
          <span className="role-number">01 / LEARN</span>
          <div className="role-symbol" aria-hidden="true">↗</div>
          <h2>I’m learning</h2>
          <p>Open your cohort, follow your progress, and take on the next resource.</p>
          <Link className="button" href="/mentee">Mentee sign in</Link>
        </article>
        <article className="role-card role-mentor">
          <span className="role-number">02 / SHARE</span>
          <div className="role-symbol" aria-hidden="true">✳</div>
          <h2>I’m mentoring</h2>
          <p>Support your learners, share resources, and review project submissions.</p>
          <Link className="button button-secondary" href="/mentor">Mentor sign in</Link>
        </article>
        <article className="role-card role-new">
          <span className="role-number">03 / EXPLORE</span>
          <div className="role-symbol" aria-hidden="true">✦</div>
          <h2>I’m just looking</h2>
          <p>Meet the people and explore the learning tracks that make this community.</p>
          <Link className="button button-secondary" href="/team">Explore TechNeeds</Link>
        </article>
      </section>
      <p className="techboard-help">Need a hand? <a href="mailto:techneedsigdtuw@gmail.com">Get in touch with the team</a>.</p>
    </main>
  );
}
