'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import './leaderboard.css';

export default function Leaderboard() {
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get('https://tn-backend-1.onrender.com/api/m/leaderboard');
        if (active) setMentees(res.data);
      } catch {
        if (active) setError('The leaderboard is temporarily unavailable. Please try again later.');
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchLeaderboard();
    return () => { active = false; };
  }, []);

  return (
    <main className="leaderboard-page page-width">
      <header className="page-intro">
        <span className="eyebrow">A little friendly momentum</span>
        <h1>Progress worth<br /><em>celebrating.</em></h1>
        <p>Every point represents a small win. Keep learning, keep building, and cheer each other on.</p>
        <Link className="button" href="/mentee">Go to my learning space ↗</Link>
      </header>

      <section className="leaderboard-panel">
        <div className="leaderboard-title">
          <div><span className="eyebrow">Community board</span><h2>Top learners</h2></div>
          <span className="leaderboard-caption">Ranked by total score</span>
        </div>
        {loading ? (
          <div className="empty-state" role="status">Loading the leaderboard…</div>
        ) : error ? (
          <div className="status-message" role="alert">{error}</div>
        ) : mentees.length ? (
          <div className="data-table-wrap">
            <table className="data-table">
              <thead><tr><th>Rank</th><th>Learner</th><th>Total score</th><th>Streak</th></tr></thead>
              <tbody>
                {mentees.map((mentee, index) => (
                  <tr key={mentee._id || `${mentee.name}-${index}`}>
                    <td><span className={`rank-badge${index < 3 ? ' rank-top' : ''}`}>#{mentee.rank ?? index + 1}</span></td>
                    <td><strong>{mentee.name}</strong></td>
                    <td>{mentee.totalScore ?? 0}</td>
                    <td>{mentee.streak ?? 0} days</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">No learners are on the board yet. Your first milestone could be next.</div>
        )}
      </section>
    </main>
  );
}
