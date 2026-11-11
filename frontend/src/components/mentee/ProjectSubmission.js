'use client';
import { useState } from 'react';
import axios from 'axios';

export default function ProjectSubmissionForm({ resourceId, onSubmitted }) {
  const [githubLink, setGithubLink] = useState('');
  const [deployedLink, setdeployedLink] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const token = localStorage.getItem('menteeToken');
      const res = await axios.post(
        `https://tn-backend-1.onrender.com/api/m/resources/${resourceId}/project`,
        { githubLink, deployedLink, description },
        { headers: { 'x-auth-token': token } }
      );

      onSubmitted(res.data.score || 0);
    } catch (err) {
      setError(err.response?.data?.error || 'Project submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="project-submit form-stack" onSubmit={handleSubmit}>
      <label>
        GitHub repository
        <input
          type="url"
          required
          value={githubLink}
          onChange={(e) => setGithubLink(e.target.value)}
          placeholder="https://github.com/your-repo"
        />
      </label>
      <label>
        Live project link
        <input
          type="url"
          required
          value={deployedLink}
          onChange={(e) => setdeployedLink(e.target.value)}
          placeholder="https://your-project.live"
        />
      </label>
      <label>
        Project description
        <textarea
          rows={6}
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write at least 300 words about your project"
        />
      </label>
      {error && <span className="form-error" role="alert">{error}</span>}
      <button className="button" type="submit" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Project'}
      </button>
    </form>
  );
}
