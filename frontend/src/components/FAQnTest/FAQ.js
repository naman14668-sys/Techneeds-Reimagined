'use client';

import { useState } from 'react';
import Link from 'next/link';
import './FAQ.css';

const faqs = [
  {
    question: 'What is TechNeeds?',
    answer: 'TechNeeds is a student-led technology community at IGDTUW. We create space to learn, share knowledge, build projects, and grow together.',
  },
  {
    question: 'Who can join?',
    answer: 'Students who are curious about technology and want to learn with others are welcome. Explore the learning hub or meet the team to find your next step.',
  },
  {
    question: 'What can I learn here?',
    answer: 'Our community runs mentorship tracks, introductory sessions, hackathons, and speaker events across a range of technology topics.',
  },
  {
    question: 'How does mentorship work?',
    answer: 'Mentors share learning resources and project work through a cohort. If you have joined a cohort, sign in with the details your mentor provided to see your track.',
  },
  {
    question: 'How can I get help with my account?',
    answer: 'Email the TechNeeds team at techneedsigdtuw@gmail.com and include your enrollment number so we can help with your mentee account.',
  },
];

export default function Faq() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <main className="faq-page page-width">
      <header className="page-intro">
        <span className="eyebrow">Good questions belong here</span>
        <h1>Let’s clear<br /><em>things up.</em></h1>
        <p>New to TechNeeds or picking up a learning track? Here are a few useful starting points.</p>
      </header>

      <section className="faq-list" aria-label="Frequently asked questions">
        {faqs.map((faq, index) => {
          const expanded = activeIndex === index;
          const answerId = `faq-answer-${index}`;
          return (
            <article className={`faq-item${expanded ? ' is-open' : ''}`} key={faq.question}>
              <h2>
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={answerId}
                  onClick={() => setActiveIndex(expanded ? null : index)}
                >
                  <span>{faq.question}</span>
                  <span className="faq-icon" aria-hidden="true">{expanded ? '−' : '+'}</span>
                </button>
              </h2>
              {expanded && <p id={answerId}>{faq.answer}</p>}
            </article>
          );
        })}
      </section>

      <section className="faq-contact">
        <div><span className="eyebrow">Still wondering?</span><h2>We’re happy to help.</h2></div>
        <div className="faq-contact-actions">
          <a className="button" href="mailto:techneedsigdtuw@gmail.com">Email the team ↗</a>
          <Link className="text-link" href="/techboard">Explore the learning hub</Link>
        </div>
      </section>
    </main>
  );
}
