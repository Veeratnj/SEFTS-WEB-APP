import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CryptoJS from 'crypto-js'; // Import crypto-js

const SECRET_KEY = '6cAz_CfVZYysFOGpKxPx_1HqPeEJjqxV3rPqNN2z2pM='; // Replace with your actual secret key

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Encrypt the username and password using the secret key
      const dataToEncrypt = JSON.stringify({ username, password });
      const encryptedData = CryptoJS.AES.encrypt(dataToEncrypt, SECRET_KEY).toString();

      // API call using axios
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post(`${baseUrl}/login`, {
        encrypted_data: encryptedData,
        email: username,
        password: password,
      });

      const result = response.data;

      if (response.status === 200 && result.status === 200) {
        console.log(result.msg); // "Login successful"
        localStorage.setItem('isAuthenticated', 'true'); // Store authentication state
        localStorage.setItem('token', result.data.token); // Store the JWT token
        localStorage.setItem('userData', JSON.stringify(result.data));

        navigate('/'); // Redirect to the home page
      } else {
        alert(result.msg || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;