'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  addMentee,
  addResource,
  getAllPrograms,
  getProgramMentees,
  getProgramResources,
  mentorLogin,
} from '../../lib/api';
import UnverifiedProjects from './projects';
import WorkspaceLayout from '../workspace/WorkspaceLayout';
import './mentor.css';

const emptyQuestion = () => ({
  questionText: '',
  options: ['', '', '', ''],
  correctOptionIndex: 0,
  marks: 1,
});

export default function MentorPanel() {
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [mentees, setMentees] = useState([]);
  const [resources, setResources] = useState([]);
  const [menteeData, setMenteeData] = useState({ name: '', email: '', enrollmentNumber: '' });
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceURL, setResourceURL] = useState('');
  const [resourceType, setResourceType] = useState('video');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [revealScores, setRevealScores] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadProgramData = useCallback(async (programId, authToken) => {
    if (!programId || !authToken) return;
    setLoading(true);
    setError('');
    try {
      const [menteesData, resourcesData] = await Promise.all([
        getProgramMentees(programId, authToken),
        getProgramResources(programId, authToken),
      ]);
      setMentees(menteesData);
      setResources(resourcesData);
    } catch (requestError) {
      setError(requestError.message || 'Could not load this program.');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMentorPrograms = useCallback(async (mentor, savedProgram, authToken) => {
    const allPrograms = await getAllPrograms();
    const mentorProgramIds = (mentor.programs || []).map((item) => String(item._id || item));
    const mentorPrograms = allPrograms.filter((program) => mentorProgramIds.includes(String(program._id)));
    setPrograms(mentorPrograms);

    const selected = mentorPrograms.some((program) => String(program._id) === String(savedProgram))
      ? savedProgram
      : mentorPrograms[0]?._id || '';
    setSelectedProgram(selected);
    if (selected) {
      localStorage.setItem('selectedProgram', selected);
      await loadProgramData(selected, authToken);
    }
  }, [loadProgramData]);

  useEffect(() => {
    let active = true;
    const restoreSession = async () => {
      const savedToken = localStorage.getItem('token');
      const savedMentorValue = localStorage.getItem('mentor');
      if (!savedToken || !savedMentorValue) return;

      try {
        const savedMentor = JSON.parse(savedMentorValue);
        if (!active) return;
        setToken(savedToken);
        setLoggedIn(true);
        await loadMentorPrograms(savedMentor, localStorage.getItem('selectedProgram'), savedToken);
      } catch (requestError) {
        if (active) setError(requestError.message || 'Could not restore your mentor workspace.');
      }
    };

    restoreSession();
    return () => { active = false; };
  }, [loadMentorPrograms]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const result = await mentorLogin(email, password);
      localStorage.setItem('token', result.token);
      localStorage.setItem('mentor', JSON.stringify(result.mentor));
      setToken(result.token);
      setLoggedIn(true);
      await loadMentorPrograms(result.mentor, localStorage.getItem('selectedProgram'), result.token);
    } catch (requestError) {
      setError(requestError.message || 'Sign in failed. Check your email and password.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('mentor');
    localStorage.removeItem('selectedProgram');
    setToken('');
    setLoggedIn(false);
    setPrograms([]);
    setMentees([]);
    setResources([]);
    setSelectedProgram('');
  };

  const handleProgramSelect = async (programId) => {
    setSelectedProgram(programId);
    localStorage.setItem('selectedProgram', programId);
    setMentees([]);
    setResources([]);
    await loadProgramData(programId, token);
  };

  const handleAddMentee = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setNotice('');
    try {
      const result = await addMentee(token, {
        ...menteeData,
        programId: selectedProgram,
      });
      setMenteeData({ name: '', email: '', enrollmentNumber: '' });
      setNotice(`Mentee added. Share this temporary password with them: ${result.tempPassword}`);
      await loadProgramData(selectedProgram, token);
    } catch (requestError) {
      setError(requestError.message || 'Could not add this mentee.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddResource = async (event) => {
    event.preventDefault();
    if (resourceType === 'quiz' && !questions.length) {
      setError('Add at least one question before creating a quiz.');
      return;
    }

    setSubmitting(true);
    setError('');
    setNotice('');
    try {
      let resourceData = {
        title: resourceTitle.trim(),
        type: resourceType,
        program: selectedProgram,
      };
      const isQuiz = resourceType === 'quiz';
      if (isQuiz) {
        resourceData = {
          ...resourceData,
          questions,
          startTime,
          endTime,
          revealScores,
          maxScore: questions.reduce((sum, question) => sum + Number(question.marks || 1), 0),
        };
      } else {
        resourceData.url = resourceURL.trim();
      }

      await addResource(token, resourceData, isQuiz);
      setResourceTitle('');
      setResourceURL('');
      setQuestions([]);
      setStartTime('');
      setEndTime('');
      setRevealScores(false);
      setNotice('Learning resource added to the program.');
      await loadProgramData(selectedProgram, token);
    } catch (requestError) {
      setError(requestError.message || 'Could not add this resource.');
    } finally {
      setSubmitting(false);
    }
  };

  const updateQuestion = (questionIndex, key, value) => {
    setQuestions((current) => current.map((question, index) => (
      index === questionIndex ? { ...question, [key]: value } : question
    )));
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    setQuestions((current) => current.map((question, index) => (
      index === questionIndex
        ? { ...question, options: question.options.map((option, itemIndex) => itemIndex === optionIndex ? value : option) }
        : question
    )));
  };

  if (!loggedIn) {
    return (
      <main className="auth-page mentor-auth-page">
        <div className="auth-aside">
          <span className="eyebrow">TechNeeds · Mentor space</span>
          <h1>Good mentors<br /><em>make room.</em></h1>
          <p>Bring your cohort together, share a useful resource, and help a learner make their next move.</p>
        </div>
        <section className="auth-card">
          <span className="eyebrow">Mentor sign in</span>
          <h2>Welcome to your studio</h2>
          <p>Sign in with the mentor account created by your TechNeeds administrator.</p>
          <form className="form-stack" onSubmit={handleLogin}>
            <label>Email<input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
            <label>
              Password
              <span className="password-field">
                <input type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
                <button className="password-toggle" type="button" onClick={() => setShowPassword((shown) => !shown)}>{showPassword ? 'Hide' : 'Show'}</button>
              </span>
            </label>
            {error && <span className="form-error" role="alert">{error}</span>}
            <button className="button auth-submit" type="submit" disabled={submitting}>{submitting ? 'Signing in…' : 'Open mentor studio'}</button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <WorkspaceLayout
      role="mentor"
      active="studio"
      eyebrow="Mentor workspace"
      title="Make learning happen."
      description="Choose a cohort, support its learners, and keep the next useful resource within reach."
      onLogout={handleLogout}
    >
      {error && <p className="status-message" role="alert">{error}</p>}
      {notice && <p className="success-message" role="status">{notice}</p>}

      <section className="surface-card mentor-program-picker">
        <label className="form-stack">
          <span className="eyebrow">Your cohort</span>
          <select value={selectedProgram} onChange={(event) => handleProgramSelect(event.target.value)}>
            <option value="">Select a program</option>
            {programs.map((program) => <option key={program._id} value={program._id}>{program.name}</option>)}
          </select>
        </label>
        {programs.length === 0 && <p className="empty-note">No programs are assigned to your mentor account yet. Ask an administrator to connect a program.</p>}
      </section>

      {selectedProgram && (
        <>
          <div className="mentor-form-grid">
            <section className="surface-card">
              <span className="eyebrow">01 / Learners</span>
              <h2>Add a mentee</h2>
              <form className="form-stack" onSubmit={handleAddMentee}>
                <label>Name<input required value={menteeData.name} onChange={(event) => setMenteeData({ ...menteeData, name: event.target.value })} /></label>
                <label>Email<input type="email" required value={menteeData.email} onChange={(event) => setMenteeData({ ...menteeData, email: event.target.value })} /></label>
                <label>Enrollment number<input required value={menteeData.enrollmentNumber} onChange={(event) => setMenteeData({ ...menteeData, enrollmentNumber: event.target.value })} /></label>
                <button className="button" type="submit" disabled={submitting}>Add to this cohort</button>
              </form>
            </section>

            <section className="surface-card">
              <span className="eyebrow">02 / Resources</span>
              <h2>Share a learning resource</h2>
              <form className="form-stack" onSubmit={handleAddResource}>
                <label>Resource title<input required value={resourceTitle} onChange={(event) => setResourceTitle(event.target.value)} /></label>
                <label>
                  Resource type
                  <select value={resourceType} onChange={(event) => setResourceType(event.target.value)}>
                    <option value="video">Video / reading</option>
                    <option value="project">Project</option>
                    <option value="quiz">Quiz</option>
                  </select>
                </label>
                {resourceType !== 'quiz' && (
                  <label>Resource URL<input type="url" required value={resourceURL} onChange={(event) => setResourceURL(event.target.value)} /></label>
                )}
                {resourceType === 'quiz' && (
                  <div className="quiz-builder">
                    <div className="quiz-builder-times">
                      <label>Starts<input type="datetime-local" value={startTime} onChange={(event) => setStartTime(event.target.value)} /></label>
                      <label>Ends<input type="datetime-local" value={endTime} onChange={(event) => setEndTime(event.target.value)} /></label>
                    </div>
                    <label className="checkbox-label"><input type="checkbox" checked={revealScores} onChange={(event) => setRevealScores(event.target.checked)} /> Reveal scores after submission</label>
                    {questions.map((question, questionIndex) => (
                      <fieldset className="question-builder" key={questionIndex}>
                        <legend>Question {questionIndex + 1}</legend>
                        <label>Prompt<input required value={question.questionText} onChange={(event) => updateQuestion(questionIndex, 'questionText', event.target.value)} /></label>
                        <div className="option-grid">
                          {question.options.map((option, optionIndex) => (
                            <label key={optionIndex}>Option {optionIndex + 1}<input required value={option} onChange={(event) => updateOption(questionIndex, optionIndex, event.target.value)} /></label>
                          ))}
                        </div>
                        <div className="quiz-builder-times">
                          <label>Correct option index (0–3)<input type="number" min="0" max="3" value={question.correctOptionIndex} onChange={(event) => updateQuestion(questionIndex, 'correctOptionIndex', Number(event.target.value))} /></label>
                          <label>Points<input type="number" min="1" value={question.marks} onChange={(event) => updateQuestion(questionIndex, 'marks', Number(event.target.value))} /></label>
                        </div>
                      </fieldset>
                    ))}
                    <button className="button button-secondary" type="button" onClick={() => setQuestions((current) => [...current, emptyQuestion()])}>Add a question</button>
                  </div>
                )}
                <button className="button" type="submit" disabled={submitting}>{submitting ? 'Adding…' : 'Add resource'}</button>
              </form>
            </section>
          </div>

          <section className="surface-card">
            <div className="workspace-heading">
              <div><span className="eyebrow">Cohort overview</span><h2>{programs.find((program) => String(program._id) === String(selectedProgram))?.name}</h2></div>
              <span className="eyebrow">{mentees.length} learners · {resources.length} resources</span>
            </div>
            {loading ? <div className="empty-state" role="status">Loading cohort data…</div> : (
              <>
                <div className="mentor-section">
                  <h3>Mentees</h3>
                  {mentees.length ? (
                    <div className="data-table-wrap">
                      <table className="data-table">
                        <thead><tr><th>Name</th><th>Enrollment number</th></tr></thead>
                        <tbody>{mentees.map((mentee) => (
                          <tr key={mentee._id}><td>{mentee.name}</td><td>{mentee.enrollmentNumber}</td></tr>
                        ))}</tbody>
                      </table>
                    </div>
                  ) : <div className="empty-state">No learners in this cohort yet.</div>}
                </div>
                <div className="mentor-section">
                  <h3>Learning resources</h3>
                  {resources.length ? (
                    <div className="mentor-resource-list">
                      {resources.map((resource) => (
                        <article key={resource._id}>
                          <div><strong>{resource.title}</strong><span>{resource.type}</span></div>
                          {resource.url && <a className="text-link" href={resource.url} target="_blank" rel="noopener noreferrer">Open ↗</a>}
                        </article>
                      ))}
                    </div>
                  ) : <div className="empty-state">Share the first resource with your cohort.</div>}
                </div>
              </>
            )}
          </section>

          <UnverifiedProjects token={token} />
        </>
      )}
    </WorkspaceLayout>
  );
}
