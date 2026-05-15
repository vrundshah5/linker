import { useState, useEffect } from 'react'

const API_URL = 'http://localhost:5000'

interface StoredUser {
  name: string
  email: string
}

interface AuthState {
  token: string | null
  user: StoredUser | null
  isTracking: boolean
}

export default function App() {
  const [auth, setAuth] = useState<AuthState>({ token: null, user: null, isTracking: false })
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [loginLoading, setLoginLoading] = useState(false)
  const [error, setError] = useState('')

  // Load auth state from chrome storage on mount
  useEffect(() => {
    chrome.storage.local.get(['token', 'user', 'isTracking'], (result) => {
      setAuth({
        token: (result['token'] as string) ?? null,
        user: (result['user'] as StoredUser) ?? null,
        isTracking: (result['isTracking'] as boolean) ?? false,
      })
      setLoading(false)
    })
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setError('')

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      })

      const data = (await res.json()) as {
        success: boolean
        message: string
        data: { token: string; user: { name: string; email: string } }
      }

      if (!res.ok || !data.success) {
        setError(data.message || 'Login failed')
        return
      }

      const { token, user } = data.data
      const storedUser: StoredUser = { name: user.name, email: user.email }

      await chrome.storage.local.set({ token, user: storedUser, isTracking: false })
      setAuth({ token, user: storedUser, isTracking: false })
    } catch {
      setError('Network error. Is the Linker server running?')
    } finally {
      setLoginLoading(false)
    }
  }

  const setTracking = async (value: boolean) => {
    await chrome.storage.local.set({ isTracking: value })
    setAuth((prev) => ({ ...prev, isTracking: value }))
  }

  const handleLogout = async () => {
    await chrome.storage.local.remove(['token', 'user', 'isTracking'])
    setAuth({ token: null, user: null, isTracking: false })
    setEmail('')
    setPassword('')
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
      </div>
    )
  }

  if (!auth.token) {
    return (
      <div className="container">
        <div className="header">
          <div className="logo">🔗</div>
          <h1>Linker</h1>
          <p className="subtitle">Sign in to start saving links</p>
        </div>

        <form onSubmit={handleLogin} className="form">
          {error && <div className="error">{error}</div>}

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loginLoading}>
            {loginLoading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="header">
        <div className="logo">🔗</div>
        <h1>Linker</h1>
        <p className="subtitle">
          {auth.user?.name || auth.user?.email}
        </p>
      </div>

      <div className="status-row">
        <span className={`status-badge ${auth.isTracking ? 'on' : 'off'}`}>
          {auth.isTracking ? '● Tracking ON' : '○ Tracking OFF'}
        </span>
      </div>

      <div className="toggle-group">
        <button
          type="button"
          className={`toggle-btn toggle-on${auth.isTracking ? ' active' : ''}`}
          onClick={() => void setTracking(true)}
        >
          ON
        </button>
        <button
          type="button"
          className={`toggle-btn toggle-off${!auth.isTracking ? ' active' : ''}`}
          onClick={() => void setTracking(false)}
        >
          OFF
        </button>
      </div>

      <p className="hint">
        {auth.isTracking
          ? 'Every link you click is saved to your archive.'
          : 'Press ON to start capturing links automatically.'}
      </p>

      <button type="button" className="btn-logout" onClick={() => void handleLogout()}>
        Sign Out
      </button>
    </div>
  )
}
