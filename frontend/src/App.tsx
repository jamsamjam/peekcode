import { useEffect, useState, useCallback, type FormEvent } from 'react'
import { useStoreActions, useStoreState } from './store';
import './App.css'
import CreatableSelect from 'react-select/creatable';
import type { ProblemType } from '@backend/models/problem.model'

function App() {
  const [hasAccount, setHasAccount] = useState(false);
  const [problems, setProblems] = useState<ProblemType[]>([]);
  const jwt = useStoreState((state) => state.jwt);
  const setToken = useStoreActions((actions) => actions.setToken);
  const [tags] = useState([]);
  const [selectedTags, setSelectedTags] = useState<Array<{ value: string, label: string }>>([]);

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);

    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/auth/register`, {
      method: 'POST',
      body: JSON.stringify({
        email: formData.get('email'), // could be just formData ?
        password: formData.get('password'),
        username: formData.get('username'),
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);

      if (data && data.message) {
        alert(data.message);
      } else {
        alert('Failed to register! Please try again.');
      }
      return;
    }
  }

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);

    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: formData.get('email'),
        password: formData.get('password'),
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      alert('Failed to log in! Please try again.');
      return;
    }

    const data = await response.json();
    setToken(data.token);
    getProblems();
  }

  // https://infinitypaul.medium.com/reactjs-useeffect-usecallback-simplified-91e69fb0e7a3
  // useCallback ensures the function is only re-created if its dependencies changed
  const getProblems = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/problems/getProblems`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwt}`,
        }
      })

      if (!response.ok) return;

      const data = await response.json();
      setProblems(data);
    } catch (error) {
      console.error('Error fetching problems:', error);
      alert('Failed to load problems');
    } 
  }, [jwt])

  // Functions are just objects in Javascript
  // when the component re-renders, all functions inside it are re-created
  useEffect(() => {
    getProblems();
  }, [getProblems]);

  const createProblem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);

    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/problems/create`, {
      method: 'POST',
      body: JSON.stringify({
        title: formData.get('title'),
        url: formData.get('url'),
        difficulty: formData.get('difficulty'),
        status: formData.get('status'),
        date: formData.get('date'),
        timeSpent: formData.get('timeSpent'),
        tags: selectedTags.map(tag => tag.value),
        notes: formData.get('notes'),
        dependency: formData.get('dependency')
      }),
      headers: { 
        'Authorization': `Bearer ${jwt!}`,
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);

      if (data && data.message) {
        alert(data.message);
      } else {
        alert('Failed to create a problem! Please try again.');
      }
      return;
    }

    getProblems();
  }

  return (
    <div className="container">
      <div className="">
        <h1>PeekCode</h1>
        {!jwt && (
          !hasAccount ? (
            <form onSubmit={handleRegister}>
              <label className="form-label" htmlFor="email">Email</label>
              <input type="email" className="form-control" id="email" name="email" />
              <label className="form-label" htmlFor="password">Password</label>
              <input type="password" className="form-control" id="password" name="password" />
              <label className="form-label" htmlFor="username">Username</label>
              <input type="text" className="form-control" id="username" name="username" /><br/>
              <button className="btn btn-outline-secondary">Sign Up</button><br/>
              <button className="textButton" onClick={() => setHasAccount(true)}>I already have an account.</button>
            </form>) : (
            <form onSubmit={handleLogin}>
              <label className="form-label" htmlFor="email">Email</label>
              <input type="email" className="form-control" id="email" name="email" />
              <label className="form-label" htmlFor="password">Password</label>
              <input type="password" className="form-control" id="password" name="password" /><br/>
              <button className="btn btn-outline-secondary">Log In</button><br/>
              <button className="textButton" onClick={() => setHasAccount(true)}>Actually, I don't have one yet.</button>
            </form>
          )
        )}

        {jwt && (
          <>
            <button className="btn btn-outline-secondary" onClick={() => setToken(null)}>Log Out</button><br/><br/>
            <div>
              <button type="button" className="btn btn-outline-primary">Add</button>
              <button type="button" className="btn btn-outline-warning">Edit</button>
              <button type="button" className="btn btn-outline-danger">Delete</button><br/><br/>
            </div>

            {problems.length === 0 ? (
              <p>Ready to Start?</p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'flex-start' }}>
                {problems.map(problem => (
                  <div className="card" style={{ width: '18rem' }}>
                    <div className="card-body">
                      <a href={problem.url!} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h5 className="card-title">{problem.title}</h5>
                      </a>

                      <div className="d-flex justify-content-between align-items-center">
                        <p className="card-subtitle text-muted m-0">{new Date(problem.date).toLocaleDateString()}</p>

                        <p className="card-subtitle text-muted m-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clock" viewBox="0 0 16 16">
                          <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
                          <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/>
                        </svg>
                        {" "}{problem.timeSpent} min</p>
                      </div>

                      <p className="badge bg-secondary">{problem.difficulty}</p>

                      <p className="card-text small text-muted mb-1">
                        {problem.status}
                      </p>

                      {problem.notes && (
                        <p className="card-text mt-2">{problem.notes}</p>
                      )}

                      {problem.tags && problem.tags.length > 0 && (
                        <div className="mt-2">
                          <span className="text-muted small">{problem.tags.join(", ")}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={createProblem}>
              <label className="form-label" htmlFor="title">Title</label>
              <input type="text" className="form-control" id="title" name="title" />
              <label className="form-label" htmlFor="url">URL</label>
              <input type="text" className="form-control" id="url" name="url" />
              <label className="form-label" htmlFor="difficulty">Difficulty</label>
              <select className="form-select" aria-label="difficulty" id="difficulty" name="difficulty" defaultValue="">
                <option selected value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <label className="form-label" htmlFor="status">Status</label>
              <select className="form-select" aria-label="status" id="status" name="status" defaultValue="Solved">
                <option selected value="Solved">Solved</option>
                <option value="Attempted">Attempted</option>
                <option value="ReviewNeeded">Review Needed</option>
                <option value="Skipped">Skipped</option>
              </select>
              <label className="form-label" htmlFor="date">Date</label>
              <input type="date" className="form-control" id="date" name="date"></input>
              <label className="form-label" htmlFor="timeSpent">Time Spent</label>
              <input type="number" className="form-control" id="timeSpent" name="timeSpent" min="0" />
              <label className="form-label" htmlFor="tags">Tags</label>
              <div className="App" id="tags">
                <CreatableSelect
                  isMulti
                  value={selectedTags}
                  onChange={(newValue) => setSelectedTags(newValue as Array<{value: string, label: string}>)}
                  placeholder=''
                  noOptionsMessage={() => 'Type to Create'}
                  options={tags}
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: 'var(--bs-body-bg)',
                      color: 'var(--bs-body-color)',
                      border: 'var(--bs-border-width) solid var(--bs-border-color)',
                      borderRadius: 'var(--bs-border-radius)',
                    }),
                    input: (base) => ({
                      ...base,
                      color: "var(--bs-body-color)"
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: "var(--bs-body-bg)",
                      border: `var(--bs-border-width) solid var(--bs-border-color)`
                    }),
                    menuList: (base) => ({
                      ...base,
                      backgroundColor: "var(--bs-body-bg)"
                    }),
                  }}
                />
              </div>
              <label className="form-label" htmlFor="notes">Notes</label>
              <input type="text" className="form-control" id="notes" name="notes" />
              <label className="form-label" htmlFor="dependency">Dependency</label>
              <input type="range" className="form-range" min="0" max="100" id="dependency" name="dependency"></input>
              <button type="submit" className="btn btn-outline-light">Submit</button><br/>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default App
