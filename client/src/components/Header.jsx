import logo from '../assets/technogixt-logo.png';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentUser,
  selectCurrentToken,
  logoutUser,
} from '../features/auth/authSlice';

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
    <header className="w-full flex items-center justify-between px-8 py-3 bg-gray-100 border-b border-gray-200">
      {/* Left: User info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white font-bold text-lg">
          {initials}
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center">
            <span className="font-semibold text-gray-800 truncate">
              {user.name}
            </span>
          </div>
        </div>
      </div>

      {/* Center: Logo */}
      <div className="flex-1 flex justify-center">
        <img src={logo} alt="Logo" className="h-12 w-auto" />
      </div>

      {/* Right: Sign Out */}
      <div className="flex items-center">
        <button
          className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 font-semibold shadow hover:bg-gray-100 transition"
          onClick={() => {
            if (token) {
              dispatch(logoutUser(token));
            }
          }}
        >
          Sign Out
        </button>
      </div>
    </header>
  );
};

export default Header;
