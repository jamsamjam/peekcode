import { useState, type FormEvent } from 'react'
import { useStoreActions, useStoreState } from './store';
import './App.css'

function App() {
  const [hasAccount, setHasAccount] = useState(false);
  const [problems, setProblems] = useState([]);
  const jwt = useStoreState((state) => state.jwt);
  const setToken = useStoreActions((actions) => actions.setToken);

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

  return (
    <>
      <h1>PeekCode</h1>
      {!jwt && (
        !hasAccount ? (
          <form onSubmit={handleRegister}>
            <label htmlFor="email">Email: </label>
            <input type="email" id="email" name="email" /><br/>
            <label htmlFor="password">Password: </label>
            <input type="password" id="password" name="password" /><br/>
            <label htmlFor="username">Username: </label>
            <input type="text" id="username" name="username" /><br/><br/>
            <button>Sign Up</button><br/>
            <button className="textButton" onClick={() => setHasAccount(true)}>I have an account.</button>
          </form>) : (
          <form onSubmit={handleLogin}>
            <label htmlFor="email">Email: </label>
            <input type="email" id="email" name="email" /><br/>
            <label htmlFor="password">Password: </label>
            <input type="password" id="password" name="password" /><br/><br/>
            <button>Log In</button><br/>
            <button className="textButton" onClick={() => setHasAccount(true)}>Actually, I don't have one yet.</button>
          </form>
        )
      )}

      {jwt && (
        <>
          <h2>My Problems</h2>
          {problems.length === 0 ? (
            <p>No problems found</p>
          ) : (
            <></>
          )}
        </>
      )}


    </>
  )
}

export default App
