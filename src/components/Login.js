import React, { useState, useEffect } from 'react';
import '../styles/login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [email, setEmail] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [commune, setCommune] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/users')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setUsers(data))
      .catch(error => console.error('Error loading users:', error));
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const storedUser = users.find(user => user.username === username);
    if (storedUser && storedUser.password === password) {
      localStorage.setItem('auth', 'true');
      localStorage.setItem('currentUser', username);
      onLogin(storedUser.role, username);
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const newUser = {
      username: newUsername,
      password: newPassword,
      email: email,
      municipality: municipality,
      commune: commune,
      role: 'user'
    };

    fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUser)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      alert(data.message);
      setIsRegistering(false);
      setUsers([...users, newUser]);
    })
    .catch(error => console.error('Error registering user:', error));
  };

  return (
    <div className="login-container">
      {isRegistering ? (
        <div className="login-form">
          <div className="avatar">
            <img src="/path/to/avatar-icon.png" alt="Avatar" />
          </div>
          <h2>Registro</h2>
          <form id="register-form" onSubmit={handleRegister}>
            <label htmlFor="new-username">Usuario:</label>
            <input type="text" id="new-username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} required />
            <label htmlFor="new-email">Correo Electrónico:</label>
            <input type="email" id="new-email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <label htmlFor="new-password">Contraseña:</label>
            <input type="password" id="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            <label htmlFor="Municipalidad/Empresa">Municipalidad/Empresa:</label>
            <input type="text" id="Municipalidad/Empresa" value={municipality} onChange={(e) => setMunicipality(e.target.value)} required />
            <label htmlFor="Comuna">Comuna:</label>
            <input type="text" id="Comuna" value={commune} onChange={(e) => setCommune(e.target.value)} required />
            <button type="submit">Registrarse</button>
          </form>
          <p>¿Ya tienes una cuenta? <a href="#" onClick={() => setIsRegistering(false)}>Inicia sesión aquí</a></p>
        </div>
      ) : (
        <div className="login-form">
          <div className="avatar">
            <img src="/path/to/avatar-icon.png" alt="Avatar" />
          </div>
          <h2>Iniciar Sesión</h2>
          <form id="login-form" onSubmit={handleLogin}>
            <label htmlFor="username">Usuario:</label>
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <label htmlFor="password">Contraseña:</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <div className="options">
              <label>
                <input type="checkbox" name="remember" /> Recuérdame
              </label>
              <a href="#forgot">¿Olvidaste tu contraseña?</a>
            </div>
            <button type="submit">Iniciar Sesión</button>
          </form>
          <p>¿No tienes una cuenta? <a href="#" onClick={() => setIsRegistering(true)}>Regístrate aquí</a></p>
        </div>
      )}
    </div>
  );
};

export default Login;
