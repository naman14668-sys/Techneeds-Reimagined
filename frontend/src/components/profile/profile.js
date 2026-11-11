'use client';

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import WorkspaceLayout from '../workspace/WorkspaceLayout';

export default function UserProfile() {
  const [mentee, setMentee] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    let active = true;
    const fetchProfile = async () => {
      const token = localStorage.getItem('menteeToken');
      if (!token) {
        router.replace('/mentee');
        return;
      }

      try {
        const res = await axios.get(
          'https://tn-backend-1.onrender.com/api/m/dashboard',
          { headers: { 'x-auth-token': token } }
        );
        if (active) setMentee(res.data);
      } catch {
        if (!active) return;
        localStorage.removeItem('menteeToken');
        setError('Your session expired. Please sign in again.');
        router.replace('/mentee');
      }
    };

    fetchProfile();
    return () => { active = false; };
  }, [router]);

  const analyticsData = useMemo(
    () => (mentee?.completedResources || []).map((resource) => ({
      date: resource.completedOn ? new Date(resource.completedOn).toLocaleDateString() : '',
      score: resource.score || 0,
    })),
    [mentee]
  );

  const handleLogout = () => {
    localStorage.removeItem('menteeToken');
    router.push('/mentee');
  };

  if (!mentee) {
    return <div className="workspace-page"><div className="empty-state" role="status">{error || 'Loading your profile…'}</div></div>;
  }

  return (
    <WorkspaceLayout
      role="mentee"
      active="profile"
      eyebrow="Your profile"
      title={mentee.name}
      description="A snapshot of what you’ve learned and the progress you’re making."
      onLogout={handleLogout}
    >
      <section className="workspace-grid">
        <div className="metric-card"><span>Community rank</span><strong>#{mentee.rank ?? '—'}</strong></div>
        <div className="metric-card"><span>Total score</span><strong>{mentee.totalScore ?? 0}</strong></div>
        <div className="metric-card"><span>Current streak</span><strong>{mentee.streak ?? 0} days</strong></div>
      </section>

      <section className="surface-card profile-details">
        <div>
          <span className="eyebrow">Account details</span>
          <h2>{mentee.email || 'Your learning profile'}</h2>
        </div>
        <Link className="text-link" href="/dashboard">Back to my learning ↗</Link>
      </section>

      <section className="surface-card profile-chart">
        <span className="eyebrow">Your journey</span>
        <h2>Assessment scores</h2>
        {analyticsData.length ? (
          <div className="chart-area">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={analyticsData} margin={{ top: 16, right: 12, bottom: 4, left: -18 }}>
                <CartesianGrid stroke="#e4e6dc" strokeDasharray="4 4" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#226e67" strokeWidth={3} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="empty-state">Your completed quiz and project scores will appear here.</div>
        )}
      </section>
    </WorkspaceLayout>
  );
}
