'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  addMentorToProgram,
  createMentor,
  createProgram,
  getAllMentors,
  getAllPrograms,
} from '../lib/api';
import WorkspaceLayout from './workspace/WorkspaceLayout';

export default function AdminPanel() {
  const [programName, setProgramName] = useState('');
  const [mentorData, setMentorData] = useState({ name: '', email: '', password: '' });
  const [programs, setPrograms] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const fetchData = useCallback(async () => {
    setError('');
    try {
      const [programRes, mentorRes] = await Promise.all([getAllPrograms(), getAllMentors()]);
      setPrograms(programRes);
      setMentors(mentorRes);
    } catch (requestError) {
      setError(requestError.message || 'Could not load programs and mentors.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleProgramSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setNotice('');
    try {
      await createProgram(programName.trim());
      setProgramName('');
      setNotice('Program created.');
      await fetchData();
    } catch (requestError) {
      setError(requestError.message || 'Could not create this program.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMentorSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setNotice('');
    try {
      await createMentor(mentorData);
      setMentorData({ name: '', email: '', password: '' });
      setNotice('Mentor account created.');
      await fetchData();
    } catch (requestError) {
      setError(requestError.message || 'Could not create this mentor.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignMentor = async (programId, mentorId) => {
    setError('');
    setNotice('');
    try {
      await addMentorToProgram(programId, mentorId);
      setNotice('Mentor assigned to the program.');
      await fetchData();
    } catch (requestError) {
      setError(requestError.message || 'Could not assign this mentor.');
    }
  };

  return (
    <WorkspaceLayout
      role="admin"
      active="admin"
      eyebrow="Community operations"
      title="Build the learning spaces."
      description="Create programs, invite mentors, and connect the people who make each cohort work."
    >
      {error && <p className="status-message" role="alert">{error}</p>}
      {notice && <p className="success-message" role="status">{notice}</p>}

      <div className="admin-forms">
        <section className="surface-card">
          <span className="eyebrow">01 / Program</span>
          <h2>Create a learning track</h2>
          <form className="form-stack" onSubmit={handleProgramSubmit}>
            <label>
              Program name
              <input value={programName} onChange={(event) => setProgramName(event.target.value)} required />
            </label>
            <button className="button" type="submit" disabled={submitting}>Create program</button>
          </form>
        </section>

        <section className="surface-card">
          <span className="eyebrow">02 / People</span>
          <h2>Bring in a mentor</h2>
          <form className="form-stack" onSubmit={handleMentorSubmit}>
            <label>
              Name
              <input value={mentorData.name} onChange={(event) => setMentorData({ ...mentorData, name: event.target.value })} required />
            </label>
            <label>
              Email
              <input type="email" autoComplete="email" value={mentorData.email} onChange={(event) => setMentorData({ ...mentorData, email: event.target.value })} required />
            </label>
            <label>
              Temporary password
              <input type="password" autoComplete="new-password" value={mentorData.password} onChange={(event) => setMentorData({ ...mentorData, password: event.target.value })} required />
            </label>
            <button className="button" type="submit" disabled={submitting}>Create mentor</button>
          </form>
        </section>
      </div>

      <section className="surface-card admin-programs">
        <div className="workspace-heading">
          <div><span className="eyebrow">The learning map</span><h2>Programs &amp; mentors</h2></div>
          <span className="eyebrow">{programs.length} programs · {mentors.length} mentors</span>
        </div>
        {loading ? (
          <div className="empty-state" role="status">Loading program data…</div>
        ) : programs.length ? (
          <div className="admin-program-list">
            {programs.map((program) => {
              const assignedMentors = mentors.filter((mentor) =>
                (mentor.programs || []).some((item) => String(item._id || item) === String(program._id))
              );
              const availableMentors = mentors.filter((mentor) => !mentor.programs?.length);
              return (
                <article className="admin-program" key={program._id}>
                  <div>
                    <span className="eyebrow">Learning program</span>
                    <h3>{program.name}</h3>
                    <p>{assignedMentors.length ? assignedMentors.map((mentor) => mentor.name).join(' · ') : 'No mentors assigned yet'}</p>
                  </div>
                  {availableMentors.length > 0 && (
                    <label className="assign-select">
                      Add a mentor
                      <select defaultValue="" onChange={(event) => {
                        if (event.target.value) handleAssignMentor(program._id, event.target.value);
                        event.target.value = '';
                      }}>
                        <option value="">Choose mentor…</option>
                        {availableMentors.map((mentor) => (
                          <option key={mentor._id} value={mentor._id}>{mentor.name}</option>
                        ))}
                      </select>
                    </label>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">No programs yet. Create your first learning track above.</div>
        )}
      </section>
    </WorkspaceLayout>
  );
}
