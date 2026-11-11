'use client';

import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'https://tn-backend-1.onrender.com';

export default function UnverifiedProjects({ token }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [verifyingId, setVerifyingId] = useState('');

  const fetchProjects = useCallback(async () => {
    setError('');
    try {
      const authToken = token || localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/unverified-projects`, {
        headers: { 'x-auth-token': authToken },
      });
      setProjects((res.data.unverifiedProjects || []).map((project) => ({
        ...project,
        score: project.score ?? '',
      })));
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Could not load project submissions.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleVerify = async (project) => {
    const score = Number(project.score);
    if (project.score === '' || !Number.isFinite(score) || score < 0) {
      setError('Enter a valid score before approving this project.');
      return;
    }

    const projectId = `${project.menteeId}-${project.resourceId}`;
    setVerifyingId(projectId);
    setError('');
    setNotice('');
    try {
      const authToken = token || localStorage.getItem('token');
      await axios.patch(
        `${API_URL}/api/${project.menteeId}/resources/${project.resourceId}/verify`,
        { score },
        { headers: { 'x-auth-token': authToken } }
      );
      setProjects((current) => current.filter((item) => (
        String(item.menteeId) !== String(project.menteeId)
        || String(item.resourceId) !== String(project.resourceId)
      )));
      setNotice('Project reviewed and score saved.');
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Could not save this review. Please try again.');
    } finally {
      setVerifyingId('');
    }
  };

  return (
    <section className="surface-card review-section">
      <div className="workspace-heading">
        <div><span className="eyebrow">03 / Feedback</span><h2>Project reviews</h2></div>
        <button className="button button-secondary" type="button" onClick={fetchProjects}>Refresh reviews</button>
      </div>
      {error && <p className="status-message" role="alert">{error}</p>}
      {notice && <p className="success-message" role="status">{notice}</p>}
      {loading ? (
        <div className="empty-state" role="status">Loading project submissions…</div>
      ) : projects.length ? (
        <div className="review-grid">
          {projects.map((project, index) => {
            const projectId = `${project.menteeId}-${project.resourceId}`;
            return (
              <article className="review-card" key={projectId || index}>
                <span className="eyebrow">Submitted project</span>
                <h3>{project.resourceTitle}</h3>
                <p className="review-mentee">By {project.menteeName}</p>
                <p className="review-description">{project.description}</p>
                <div className="review-links">
                  <a className="text-link" href={project.githubLink} target="_blank" rel="noopener noreferrer">GitHub repository ↗</a>
                  <a className="text-link" href={project.deployedLink} target="_blank" rel="noopener noreferrer">Live project ↗</a>
                </div>
                {project.submittedOn && <p className="review-date">Submitted {new Date(project.submittedOn).toLocaleDateString()}</p>}
                <label className="form-stack">
                  <span>Score</span>
                  <input
                    type="number"
                    min="0"
                    value={project.score}
                    onChange={(event) => {
                      const { value } = event.target;
                      setProjects((current) => current.map((item, itemIndex) => (
                        itemIndex === index ? { ...item, score: value } : item
                      )));
                    }}
                  />
                </label>
                <button className="button" type="button" disabled={verifyingId === projectId} onClick={() => handleVerify(project)}>
                  {verifyingId === projectId ? 'Saving…' : 'Save review'}
                </button>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">No projects are waiting for review. Your feedback queue is clear.</div>
      )}
    </section>
  );
}
