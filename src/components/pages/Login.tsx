import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const SECRET_KEY = '6cAz_CfVZYysFOGpKxPx_1HqPeEJjqxV3rPqNN2z2pM=';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToEncrypt = JSON.stringify({ username, password });
      const encryptedData = CryptoJS.AES.encrypt(dataToEncrypt, SECRET_KEY).toString();

      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post(`${baseUrl}/login`, {
        encrypted_data: encryptedData,
        email: username,
        password: password,
      });
      console.log("login API response",response)
      const result = response.data;

      if (response.status === 200 && result.status === 200) {
        console.log(result.msg);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('userData', JSON.stringify(result.data));

        navigate('/');
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-black to-gray-900 p-4">
      {/* Company Name at top */}
      <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-8 text-center">
        SMART ELITE TRADING CLUB
      </h1>

      {/* Login Form */}
      <form
        onSubmit={handleLogin}
        className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200/30"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-white mb-2">AlgoTrade Login</h2>
          <p className="text-gray-300 text-sm">Enter your credentials to continue</p>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-300 mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300 text-white py-3 rounded-lg font-semibold text-lg"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p className="text-center text-gray-400 text-xs mt-6">
          Secure Algo Trading Platform
        </p>
      </form>
    </div>
  );
};

export default Login;
