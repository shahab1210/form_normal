import { useState, useEffect } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL
const APP_TITLE = import.meta.env.VITE_APP_TITLE || 'Name Registry'

function App() {
  const [name, setName] = useState('')
  const [names, setNames] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')

  // Fetch all saved names on mount
  useEffect(() => {
    fetchNames()
  }, [])

  const fetchNames = async () => {
    setFetching(true)
    try {
      const res = await fetch(`${API_URL}/names`)
      const data = await res.json()
      setNames(data)
    } catch {
      setError('Could not load names. Is the server running?')
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}/names`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (!res.ok) throw new Error('Failed to save')
      const saved = await res.json()
      setNames((prev) => [saved, ...prev])
      setName('')
    } catch {
      setError('Error saving name. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <div className="icon">👤</div>
          <h1>{APP_TITLE}</h1>
          <p>Submit your name and see everyone who joined</p>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              autoFocus
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn-submit" disabled={!name.trim() || loading}>
            {loading ? 'Saving…' : 'Submit'}
          </button>
        </form>

        <div className="names-section">
          <h2>All Names <span className="count">{names.length}</span></h2>
          {fetching ? (
            <p className="hint">Loading…</p>
          ) : names.length === 0 ? (
            <p className="hint">No names yet. Be the first!</p>
          ) : (
            <ul className="names-list">
              {names.map((n) => (
                <li key={n._id} className="name-item">
                  <span className="avatar">{n.name.charAt(0).toUpperCase()}</span>
                  <div>
                    <span className="name-text">{n.name}</span>
                    <span className="name-date">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
