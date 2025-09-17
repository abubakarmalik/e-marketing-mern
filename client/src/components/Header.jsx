import logo from '../assets/technogixt-logo.png';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentUser,
  selectCurrentToken,
  logoutUser,
} from '../features/auth/authSlice';
import { FiLogOut, FiBell, FiSettings, FiChevronDown } from 'react-icons/fi';

const Header = () => {
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);
  const dispatch = useDispatch();

  // Get initials for avatar
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className=" mx-auto px-4 py-1 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex-shrink-0 p-1">
            <img src={logo} alt="Logo" className="h-16 w-auto" />
          </div>

          {/* Right: User menu */}
          <div className="flex items-center space-x-6">
            {/* Avatar */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold ring-2 ring-white">
                  {initials}
                </div>
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-400 border-2 border-white"></div>
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-sm font-medium text-gray-700">
                  {user.name}
                </span>
                <span className="text-xs text-gray-500">Administrator</span>
              </div>
            </div>

            {/* User Menu */}
            <div className="relative flex items-center space-x-4">
              {/* Sign Out Button */}
              <button
                onClick={() => {
                  if (token) {
                    dispatch(logoutUser(token));
                  }
                }}
                className="hidden md:flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg border border-gray-200 transition-colors duration-150 ease-in-out"
              >
                <FiLogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
