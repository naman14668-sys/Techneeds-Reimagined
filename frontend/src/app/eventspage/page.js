import Link from 'next/link';

export default function EventsPage() {
  return (
    <main className="events-page page-width">
      <header className="page-intro">
        <span className="eyebrow">Good things happen together</span>
        <h1>Make time for<br /><em>something new.</em></h1>
        <p>
          Workshops, speaker sessions, hackathons, and the moments in between:
          TechNeeds is built around learning out loud.
        </p>
      </header>

      <section className="events-feature">
        <div className="events-mark" aria-hidden="true">✳</div>
        <div>
          <span className="eyebrow">The next gathering</span>
          <h2>Stay close to the community.</h2>
          <p>
            Event dates are shared by the TechNeeds team as sessions are announced.
            Reach out or follow the community to hear when the next one is happening.
          </p>
          <div className="events-actions">
            <a className="button" href="mailto:techneedsigdtuw@gmail.com">Ask about upcoming events ↗</a>
            <Link className="text-link" href="/team">Meet the people behind it</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
