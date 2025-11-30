import { useState, type FormEvent } from 'react'
import { useStoreActions, useStoreState } from './store';
import './App.css'
import CreatableSelect from 'react-select/creatable';

function App() {
  const [hasAccount, setHasAccount] = useState(false);
  const [problems, setProblems] = useState([]);
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
  }

  const showProblems = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/problems/getProblems`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${jwt}`,
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch problems');
      }

      const data = await response.json();
      setProblems(data);
    } catch (error) {
      console.error('Error fetching problems:', error);
      alert('Failed to load problems');
    } 
  }

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
  }

  return (
    <div className="container">
      <div className="col-12 col-lg-3 p-3">
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
            <h2>My Problems</h2>
            <button className="btn btn-outline-secondary" onClick={() => setToken(null)}>Log Out</button><br/><br/>
            <button type="button" className="btn btn-outline-primary">Add</button> 
            <button type="button" className="btn btn-outline-danger">Delete</button><br/><br/>

            {problems.length === 0 ? (
              <p>Ready to Start?</p>
            ) : (
              <></>
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
