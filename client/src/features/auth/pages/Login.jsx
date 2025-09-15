import { useState } from 'react';
import logo from '../../../assets/megaphone.png';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formValues, setFormValues] = useState({
    username: '',
    password: '',
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.auth.loading);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;

    dispatch(loginUser(formValues))
      .unwrap()
      .then(() => {
        navigate('/dashboard');
      })
      .catch((err) => {
        console.error('Login failed:', err);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center m-4">
          <div className="m-1 bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
            <img src={logo} alt="logo" className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 ">
            Welcome Back
          </h2>
          <p className="text-gray-600 text-sm">Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              value={formValues.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formValues.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-700 focus:outline-none"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.234.938-4.675M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.062-4.675A9.956 9.956 0 0122 9c0 5.523-4.477 10-10 10a9.956 9.956 0 01-4.675-.938M3 3l18 18"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm7-2s-4-7-10-7-10 7-10 7 4 7 10 7 10-7 10-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 bg-gradient-to-r from-gray-900 to-black text-white font-semibold rounded-lg shadow-md transition duration-200 ${
              loading
                ? 'opacity-60 cursor-not-allowed'
                : 'hover:from-gray-600 hover:to-gray-600'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
