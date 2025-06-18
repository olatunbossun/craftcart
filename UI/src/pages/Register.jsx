import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

const REGISTER_MUTATION = gql`
  mutation RegisterUser($userInput: UserInput!) {
    register(userInput: $userInput) {
      token
      user {
        id
        name
      }
    }
  }
`;

export default function Register() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
    role: 'BUYER' // Default role
  });
  const navigate = useNavigate();

  const [register, { error, loading }] = useMutation(REGISTER_MUTATION, {
    onCompleted: ({ register }) => {
      localStorage.setItem('token', register.token); // Save the token
      navigate('/'); // Redirect to homepage on success
      window.location.reload(); // Refresh to update navbar
    },
    onError: (err) => {
      console.error("Registration error:", err.message);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    register({
      variables: {
        userInput: {
          name: formState.name,
          email: formState.email,
          password: formState.password,
          role: formState.role
        }
      }
    });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: 'auto' }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Name</label>
          <input
            type="text"
            value={formState.name}
            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Email</label>
          <input
            type="email"
            value={formState.email}
            onChange={(e) => setFormState({ ...formState, email: e.target.value })}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Password</label>
          <input
            type="password"
            value={formState.password}
            onChange={(e) => setFormState({ ...formState, password: e.target.value })}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" disabled={loading} className="action-button">
          {loading ? 'Registering...' : 'Register'}
        </button>
        {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      </form>
    </div>
  );
}