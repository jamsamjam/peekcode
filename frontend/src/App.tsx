import { useState } from 'react'
import './App.css'

function App() {
  const [isLoggedIn, setisLoggedIn] = useState(false);

  return (
    <>
      <h1>PeekCode</h1>
      {!isLoggedIn && (
        <form action="/api/v1/users">
          <label>Email:</label><br/>
          <input type="text" id="fname" name="fname" value="John"/><br/>
          <label>Last name:</label><br/>
          <input type="text" id="lname" name="lname" value="Doe"/><br/><br/>
        </form>
      )}
    </>
  )
}

export default App
