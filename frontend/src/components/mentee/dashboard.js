'use client';

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import QuizAttempt from './QuizAttempt';
import ProjectSubmissionForm from './ProjectSubmission';
import WorkspaceLayout from '../workspace/WorkspaceLayout';

const API_URL = 'https://tn-backend-1.onrender.com';

export default function MenteeDashboard() {
  const [mentee, setMentee] = useState(null);
  const [activeQuizResource, setActiveQuizResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    let active = true;
    const fetchDashboard = async () => {
      const token = localStorage.getItem('menteeToken');
      if (!token) {
        router.replace('/mentee');
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/api/m/dashboard`, {
          headers: { 'x-auth-token': token },
        });
        if (active) setMentee(res.data);
      } catch {
        if (!active) return;
        localStorage.removeItem('menteeToken');
        setError('Your session could not be restored. Please sign in again.');
        router.replace('/mentee');
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchDashboard();
    return () => { active = false; };
  }, [router]);

  const resources = useMemo(
    () => (mentee?.programs || []).flatMap((program) => program.resources || []),
    [mentee]
  );
  const completedCount = resources.filter((resource) => resource.completed).length;
  const progress = resources.length ? Math.round((completedCount / resources.length) * 100) : 0;

  const updateResource = (resourceId, values) => {
    setMentee((current) => ({
      ...current,
      programs: (current.programs || []).map((program) => ({
        ...program,
        resources: (program.resources || []).map((resource) =>
          resource._id === resourceId ? { ...resource, ...values } : resource
        ),
      })),
    }));
  };

  const handleComplete = async (resourceId) => {
    try {
      const token = localStorage.getItem('menteeToken');
      const res = await axios.post(
        `${API_URL}/api/m/resources/${resourceId}/complete`,
        {},
        { headers: { 'x-auth-token': token } }
      );
      updateResource(resourceId, {
        completed: true,
        score: res.data.score,
        completedOn: new Date().toISOString(),
      });
      setError('');
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'We could not mark this resource complete. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('menteeToken');
    router.push('/mentee');
  };

  if (loading) {
    return <div className="workspace-page"><div className="empty-state" role="status">Loading your learning space…</div></div>;
  }

  if (!mentee) {
    return <div className="workspace-page"><div className="empty-state">{error || 'Your learning space is unavailable.'}</div></div>;
  }

  return (
    <WorkspaceLayout
      role="mentee"
      active="learning"
      eyebrow="Your learning space"
      title={`Welcome back, ${mentee.name}.`}
      description="Pick up where you left off, or take the next small step in your track."
      onLogout={handleLogout}
    >
      {error && <p className="status-message" role="alert">{error}</p>}

      <section className="workspace-grid" aria-label="Learning progress">
        <div className="metric-card"><span>Track progress</span><strong>{progress}%</strong></div>
        <div className="metric-card"><span>Total score</span><strong>{mentee.totalScore ?? 0}</strong></div>
        <div className="metric-card"><span>Current streak</span><strong>{mentee.streak ?? 0} days</strong></div>
      </section>

      <section className="surface-card">
        <div className="workspace-heading">
          <div>
            <span className="eyebrow">Your track</span>
            <h2>{mentee.programs?.length ? 'Keep your momentum going' : 'Your learning space is getting ready'}</h2>
          </div>
          {mentee.rank != null && <span className="eyebrow">Community rank #{mentee.rank}</span>}
        </div>

        {!mentee.programs?.length ? (
          <div className="empty-state">Your mentor will add your first program here. Check back soon.</div>
        ) : (
          <div className="program-list">
            {mentee.programs.map((program) => (
              <section className="program-section" key={program._id}>
                <div className="program-heading">
                  <h3>{program.name}</h3>
                  <span>{(program.resources || []).filter((resource) => resource.completed).length} of {(program.resources || []).length} complete</span>
                </div>

                {program.resources?.length ? (
                  <div className="resource-grid">
                    {program.resources.map((resource) => (
                      <article className="resource-card" key={resource._id}>
                        <span className="eyebrow">
                          {resource.isLocked ? 'Locked' : resource.completed ? 'Completed' : resource.type}
                        </span>
                        <h3>{resource.title}</h3>
                        <p>
                          {resource.completed
                            ? `Completed${resource.score != null ? ` · Score ${resource.score}` : ''}`
                            : resource.deadline ? `Due ${new Date(resource.deadline).toLocaleDateString()}` : 'Ready when you are'}
                        </p>

                        {resource.isLocked ? (
                          <span className="resource-state">Unlocks as you progress</span>
                        ) : resource.completed ? (
                          <span className="resource-state">Done ✓</span>
                        ) : resource.type === 'quiz' ? (
                          activeQuizResource === resource._id ? (
                            <QuizAttempt
                              resourceId={resource._id}
                              onComplete={(score) => {
                                updateResource(resource._id, {
                                  completed: true,
                                  score,
                                  completedOn: new Date().toISOString(),
                                });
                                setActiveQuizResource(null);
                              }}
                            />
                          ) : (
                            <button className="button" type="button" onClick={() => setActiveQuizResource(resource._id)}>
                              Start quiz
                            </button>
                          )
                        ) : resource.type === 'project' ? (
                          <ProjectSubmissionForm
                            resourceId={resource._id}
                            onSubmitted={(score) => updateResource(resource._id, {
                              completed: true,
                              score,
                              completedOn: new Date().toISOString(),
                            })}
                          />
                        ) : (
                          <div className="resource-actions">
                            {resource.url && (
                              <a className="text-link" href={resource.url} target="_blank" rel="noopener noreferrer">
                                Open resource ↗
                              </a>
                            )}
                            <button className="button button-secondary" type="button" onClick={() => handleComplete(resource._id)}>
                              Mark complete
                            </button>
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">Your mentor hasn’t added any learning materials yet.</div>
                )}
              </section>
            ))}
          </div>
        )}
      </section>
    </WorkspaceLayout>
  );
}
