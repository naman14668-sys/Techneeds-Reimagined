'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import './homepage.css';
import Reveal from '../animation/Reveal';
import communityImage from '../../assets/Glimpse.png';
import webImage from '../../assets/WEB.jpeg';
import cImage from '../../assets/C.png';
import mlImage from '../../assets/ML.png';
import javaImage from '../../assets/JAVA.jpeg';
import arImage from '../../assets/ar.png';
import appImage from '../../assets/app.jpg';

const tracks = [
  { title: 'Web Development', mentor: 'Build for the browser', category: 'Build', image: webImage, tone: 'mint' },
  { title: 'Data Structures', mentor: 'Think in systems', category: 'Code', image: cImage, tone: 'peach' },
  { title: 'Machine Learning', mentor: 'Find patterns in data', category: 'Explore', image: mlImage, tone: 'lilac' },
  { title: 'Java & DSA', mentor: 'Make your logic stronger', category: 'Code', image: javaImage, tone: 'sun' },
  { title: 'AR / VR', mentor: 'Design new dimensions', category: 'Explore', image: arImage, tone: 'sky' },
  { title: 'App Development', mentor: 'Make ideas useful', category: 'Build', image: appImage, tone: 'rose' },
];

const categories = ['All tracks', 'Build', 'Code', 'Explore'];

export default function Homepage() {
  const [activeCategory, setActiveCategory] = useState('All tracks');
  const visibleTracks = useMemo(
    () => activeCategory === 'All tracks'
      ? tracks
      : tracks.filter((track) => track.category === activeCategory),
    [activeCategory]
  );

  return (
    <main className="home-page">
      <section className="home-hero page-width">
        <div className="hero-copy">
          <span className="hero-kicker"><span /> A learning community at IGDTUW</span>
          <h1>Learn by making.<br /><em>Grow by sharing.</em></h1>
          <p>
            Find your people, try something new, and turn curiosity into work you’re
            proud to put your name on.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/techboard">Explore learning <span aria-hidden="true">↗</span></Link>
            <Link className="button button-secondary" href="/team">Meet the community</Link>
          </div>
          <div className="hero-note">
            <div className="avatar-stack" aria-hidden="true"><span>TN</span><span>✦</span><span>+</span></div>
            <span>Peer-led. Project-powered. Better together.</span>
          </div>
        </div>

        <div className="hero-art">
          <div className="hero-art-frame">
            <Image src={webImage} alt="A calm coding workspace with plants and a laptop" priority />
          </div>
          <div className="hero-sticker" aria-hidden="true">
            <span>Make</span>
            <strong>room<br />to grow</strong>
            <b>✳</b>
          </div>
          <div className="hero-caption"><span>01 / COMMUNITY</span><span>Ideas grow here ↗</span></div>
        </div>
      </section>

      <section className="home-proof page-width" aria-label="TechNeeds community at a glance">
        <div><strong>1,200+</strong><span>learners supported</span></div>
        <div><strong>50+</strong><span>mentors sharing what they know</span></div>
        <div><strong>10+</strong><span>cohorts to learn with</span></div>
        <p>Small steps, real momentum.</p>
      </section>

      <section className="tracks-section">
        <div className="page-width">
          <Reveal className="section-lead">
            <div>
              <span className="eyebrow">Pick a direction</span>
              <h2 className="section-title">Curiosity looks good <em>on you.</em></h2>
            </div>
            <p className="section-copy">Explore mentorship tracks led by students and mentors who have been there—and want to help you get there too.</p>
          </Reveal>

          <div className="track-toolbar">
            <div className="track-filters" role="group" aria-label="Filter learning tracks">
              {categories.map((category) => (
                <button
                  type="button"
                  key={category}
                  className={activeCategory === category ? 'is-selected' : ''}
                  aria-pressed={activeCategory === category}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            <Link className="text-link" href="/techboard">Find your learning space ↗</Link>
          </div>

          <div className="track-grid">
            {visibleTracks.map((track, index) => (
              <Reveal key={track.title} className={`track-card track-${track.tone}`}>
                <Link href="/techboard" aria-label={`Explore ${track.title} learning track`}>
                  <div className="track-image">
                    <Image src={track.image} alt="" sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 33vw" />
                    <span className="track-index">0{index + 1}</span>
                    <span className="track-arrow" aria-hidden="true">↗</span>
                  </div>
                  <div className="track-card-copy">
                    <span className="eyebrow">{track.category} · Mentorship</span>
                    <h3>{track.title}</h3>
                    <p>{track.mentor}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="home-story page-width">
        <Reveal className="story-copy">
          <span className="eyebrow">More than a course</span>
          <h2 className="section-title">A place to try.<br /><em>A team to try with.</em></h2>
          <p className="section-copy">
            From your first line of code to the project you can’t wait to demo,
            TechNeeds makes room for questions, experiments, and the people who
            make the hard parts easier.
          </p>
          <Link className="button button-coral" href="/team">Get to know us <span aria-hidden="true">↗</span></Link>
        </Reveal>
        <Reveal className="story-visual">
          <Image src={communityImage} alt="A collage of TechNeeds workshops, talks, and student projects" />
          <div className="story-note"><span>WHAT WE BELIEVE</span><strong>Learning is better<br />when it’s shared.</strong></div>
        </Reveal>
      </section>

      <section className="home-quote">
        <Reveal className="page-width quote-inner">
          <span className="eyebrow">A note from the community</span>
          <blockquote>“The best part is knowing there’s always someone ready to help you take the next step.”</blockquote>
          <Link className="text-link" href="/faq">How TechNeeds works ↗</Link>
        </Reveal>
      </section>

      <section className="home-join page-width">
        <div>
          <span className="eyebrow">Your next chapter</span>
          <h2>Bring your questions.<br /><em>Leave with momentum.</em></h2>
        </div>
        <div className="join-actions">
          <Link className="button" href="/techboard">Find your learning space ↗</Link>
          <Link className="text-link" href="/mentee">Already in a cohort? Sign in</Link>
        </div>
      </section>
    </main>
  );
}
