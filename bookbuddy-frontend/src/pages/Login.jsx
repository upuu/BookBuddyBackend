import { useState } from 'react';
import logo from '../assets/logo.png';
import { signIn, createAccount } from '../api.js';

// Real-looking auth UI (Sign in / Create account). The functions
// it calls are stubs in src/api.js until the backend ships
// register/login endpoints.
export default function Login({
  onEnter = () => {},
  onNavigate = () => {},
}) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  function switchMode(next) {
    setMode(next);
    setError(null);
    setPassword('');
    setConfirm('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setBusy(true);

    try {
      if (mode === 'register' && confirm !== password) {
        setError('Passwords do not match.');
        return;
      }

      const result =
        mode === 'signin'
          ? await signIn(email, password)
          : await createAccount(name, email, password);

      onEnter(result.name);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="onboarding">
      <div className="login-card">
        <img src={logo} alt="BookBuddy" width="180" className="login-logo" />

        <h1>
          {mode === 'signin' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="login-sub">
          {mode === 'signin'
            ? 'Sign in to see picks from our recommendation model.'
            : 'Create an account to keep your lists, ratings and reviews.'}
        </p>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {mode === 'register' && (
            <div className="field">
              <label htmlFor="account-name">Name</label>
              <input
                id="account-name"
                type="text"
                autoComplete="name"
                placeholder="e.g. Varun"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
          )}

          <div className="field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="field">
            <div className="field-row">
              <label htmlFor="login-password">Password</label>
              <button
                type="button"
                className="btn-quiet"
                aria-pressed={showPassword}
                onClick={() => setShowPassword((visible) => !visible)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {mode === 'register' && (
            <div className="field">
              <label htmlFor="login-confirm">Confirm password</label>
              <input
                id="login-confirm"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirm}
                onChange={(event) => setConfirm(event.target.value)}
                required
              />
            </div>
          )}

          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary" disabled={busy}>
            {busy
              ? mode === 'signin'
                ? 'Signing in…'
                : 'Creating account…'
              : mode === 'signin'
                ? 'Sign in'
                : 'Create account'}
          </button>
        </form>

        <hr className="login-divider" />
        <p className="login-new">
          {mode === 'signin' ? 'New here?' : 'Already have an account?'}
        </p>
        <button
          type="button"
          className="btn-link"
          onClick={() =>
            switchMode(mode === 'signin' ? 'register' : 'signin')
          }
        >
          {mode === 'signin' ? 'Create account' : 'Sign in'}
        </button>
        <button
          type="button"
          className="btn-link"
          onClick={() => onNavigate('onboarding')}
        >
          Start with the questionnaire
        </button>

        <p className="login-note">
          Demo sign-in only — real accounts arrive when the backend is ready.
        </p>
        <p className="login-note">
          Tip: use alice@example.com, bob@example.com, charlie@example.com or
          diana@example.com to load that profile&apos;s real picks.
        </p>
      </div>
    </main>
  );
}
