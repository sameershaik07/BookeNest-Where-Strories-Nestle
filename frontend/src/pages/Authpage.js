// ./pages/AuthPage.js
import React, { useState } from 'react';

const AuthPage = () => {
  const [isSignIn, setIsSignIn] = useState(true);

  const toggleMode = () => setIsSignIn(!isSignIn);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white px-4">
      <div className="w-full max-w-md bg-[#141414] p-8 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-red-600">
          {isSignIn ? 'Sign In' : 'Create an Account'}
        </h2>

        <form className="space-y-4">
          {!isSignIn && (
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
          <button
            type="submit"
            className="w-full py-2 mt-2 bg-red-600 hover:bg-red-700 rounded text-white font-semibold transition-all"
          >
            {isSignIn ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-400">
          {isSignIn ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button onClick={toggleMode} className="text-red-500 hover:underline">
            {isSignIn ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
