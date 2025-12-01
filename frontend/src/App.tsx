import { useEffect, useState, useCallback, type FormEvent } from 'react'
import { useStoreActions, useStoreState } from './store';
import './App.css'
import type { ProblemType } from '@backend/models/problem.model'
import ProblemForm from './components/ProblemForm';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function App() {
  const [hasAccount, setHasAccount] = useState(false);
  const [problems, setProblems] = useState<ProblemType[]>([]);
  const jwt = useStoreState((state) => state.jwt);
  const setToken = useStoreActions((actions) => actions.setToken);

  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [tags] = useState([]);
  const [selectedTags, setSelectedTags] = useState<Array<{ value: string, label: string }>>([]);
  const [editingProblem, setEditingProblem] = useState<ProblemType|null>(null);

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

  const createProblem = async (formData: FormData) => {
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
      alert(data?.message ?? "Failed to create a problem! Please try again.");
      return;
    }

    getProblems();
  }

  const editProblem = async (formData: FormData, problemId: string) => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/problems/update/${problemId}`, {
      method: 'PATCH',
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
      alert(data?.message ?? "Failed to edit a problem! Please try again.");
      return;
    }

    getProblems();
  }

  const deleteProblem = async (problemId: string) => {
    const ok = window.confirm("Are you sure you want to delete this problem?");
    if (!ok) return;

    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/problems/delete/${problemId}`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${jwt!}`,
      },
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      alert(data?.message ?? "Failed to delete a problem! Please try again.");
      return;
    }

    getProblems();
  }

  return (
    <div className="container-fluid" style={{ maxWidth: '1230px' }}>
      <div className="">
        {!jwt && (
          !hasAccount ? (
            <>
              <h1 className="mt-4">PeekCode</h1>
              <form onSubmit={handleRegister}>
                <label className="form-label" htmlFor="email">Email</label>
                <input type="email" className="form-control" id="email" name="email" />
                <label className="form-label" htmlFor="password">Password</label>
                <input type="password" className="form-control" id="password" name="password" />
                <label className="form-label" htmlFor="username">Username</label>
                <input type="text" className="form-control" id="username" name="username" /><br />
                <button className="btn btn-outline-secondary">Sign Up</button><br />
                <button className="textButton" onClick={() => setHasAccount(true)}>I already have an account.</button>
              </form>
            </>) : (<>
              <h1 className="mt-4">PeekCode</h1>
              <form onSubmit={handleLogin}>
                <label className="form-label" htmlFor="email">Email</label>
                <input type="email" className="form-control" id="email" name="email" />
                <label className="form-label" htmlFor="password">Password</label>
                <input type="password" className="form-control" id="password" name="password" /><br />
                <button className="btn btn-outline-secondary">Log In</button><br />
                <button className="textButton" onClick={() => setHasAccount(true)}>Actually, I don't have one yet.</button>
              </form>
            </>
          )
        )}

        {jwt && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h1 className="mt-4">PeekCode</h1>
              <div>
                {/* add button */}
                <button
                  type="button"
                  className="btn btn-outline-primary me-2"
                  onClick={() => {
                    setSelectedTags([]);
                    setEditingProblem(null);
                    setModalMode("create");
                  }}
                >
                  Add Problem
                </button>
                <button className="btn btn-outline-secondary" onClick={() => setToken(null)}>Log Out</button>
              </div>
            </div>

            {problems.length === 0 ? (
              <p>Ready to Start?</p>
            ) : (
              <div className="d-flex flex-wrap gap-3 justify-content-start mt-4">
                {problems.map(problem => (
                  <div className="card" style={{ width: '18rem', maxHeight: '22rem', overflowY: 'auto' }} key={problem._id.toString()}>
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <a href={problem.url!} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <h5 className="card-title">{problem.title}</h5>
                        </a>
                        <div>
                          {/* edit button */}
                          <button
                            className="btn btn-sm p-1 me-1"
                            style={{ background: 'none', border: 'none' }}
                            onClick={() => {
                              setEditingProblem(problem);
                              setSelectedTags(problem.tags.map(t => ({ value: t, label: t })));
                              setModalMode("edit");
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                            </svg>
                          </button>
                          {/* delete button */}
                          <button
                            className="btn btn-sm p-1"
                            style={{ background: 'none', border: 'none' }}
                            onClick={() => {
                              deleteProblem(problem._id.toString());
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash2" viewBox="0 0 16 16">
                              <path d="M14 3a.7.7 0 0 1-.037.225l-1.684 10.104A2 2 0 0 1 10.305 15H5.694a2 2 0 0 1-1.973-1.671L2.037 3.225A.7.7 0 0 1 2 3c0-1.105 2.686-2 6-2s6 .895 6 2M3.215 4.207l1.493 8.957a1 1 0 0 0 .986.836h4.612a1 1 0 0 0 .986-.836l1.493-8.957C11.69 4.689 9.954 5 8 5s-3.69-.311-4.785-.793"/>
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <p className="card-subtitle text-muted m-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar" viewBox="0 0 16 16">
                            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
                          </svg>
                          {" "}{new Date(problem.date).toLocaleDateString()}
                        </p>

                        <p className="card-subtitle text-muted m-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clock" viewBox="0 0 16 16">
                            <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
                            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/>
                          </svg>
                          {" "}{problem.timeSpent} min
                        </p>
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

            <Modal
              isOpen={modalMode !== null}
              onRequestClose={() => setModalMode(null)}
              className="myModal"
              contentLabel='Add New Problem'
            >
              <ProblemForm
                initialData={modalMode === "edit" ? editingProblem : null}
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                tags={tags}
                onSubmit={
                  modalMode === "edit"
                    ? (formData) => editProblem(formData, editingProblem!._id.toString())
                    : createProblem
                }
                onClose={() => setModalMode(null)}
              ></ProblemForm>
            </Modal>
          </>
        )}
      </div>
    </div>
  )
}

export default App
