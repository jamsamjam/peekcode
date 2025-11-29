import { useState, type FormEvent } from 'react'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasAccount, setHasAccount] = useState(false);

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

    setIsLoggedIn(true);
  }

  return (
    <>
      <h1>PeekCode</h1>
      {!isLoggedIn && (
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

      {isLoggedIn && (
        <>Welcome hello hello</>
      )}
    </>
  )
}

export default App
