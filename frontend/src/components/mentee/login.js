'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

export default function MenteeLogin() {
  const [enrollmentNumber, setEnrollmentNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await axios.post('https://tn-backend-1.onrender.com/api/m/login', {
        enrollmentNumber,
        password,
      });
      localStorage.setItem('menteeToken', res.data.token);
      router.push('/dashboard');
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'We could not sign you in. Check your details and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-aside">
        <span className="eyebrow">TechNeeds · Mentee space</span>
        <h1>Keep going.<br /><em>You’re closer than you think.</em></h1>
        <p>Your track, your progress, and the next thing you’ll make—all in one place.</p>
        <Link className="text-link" href="/">Back to TechNeeds ↗</Link>
      </div>
      <section className="auth-card">
        <span className="eyebrow">Welcome back</span>
        <h2>Sign in to your learning space</h2>
        <p>Use the enrollment number and password shared by your mentor.</p>
        <form className="form-stack" onSubmit={handleLogin}>
          <label>
            Enrollment number
            <input
              autoComplete="username"
              required
              value={enrollmentNumber}
              onChange={(event) => setEnrollmentNumber(event.target.value)}
            />
          </label>
          <label>
            Password
            <span className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button type="button" className="password-toggle" onClick={() => setShowPassword((shown) => !shown)}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </span>
          </label>
          {error && <span className="form-error" role="alert">{error}</span>}
          <button className="button auth-submit" type="submit" disabled={isLoading}>
            {isLoading ? 'Signing in…' : 'Continue to my learning'}
          </button>
        </form>
        <p className="auth-footnote">Need help signing in? <a href="mailto:techneedsigdtuw@gmail.com">Contact the team</a></p>
      </section>
    </main>
  );
}
