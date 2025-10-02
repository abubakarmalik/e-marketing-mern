import dashboard from '../assets/layout.png';
import number from '../assets/number.png';
import mail from '../assets/mail.png';
import user from '../assets/user.png';

const tabs = [
  {
    id: 1,
    name: 'Dashboard',
    icon: <img src={dashboard} alt="Dashboard" className="h-4 w-auto" />,
  },
  {
    id: 2,
    name: 'Contacts',
    icon: <img src={number} alt="Contacts" className="h-4 w-auto" />,
  },
  // {
  //   id: 3,
  //   name: 'Emails',
  //   icon: <img src={mail} alt="Emails" className="h-4 w-auto" />,
  // },
  {
    id: 3,
    name: 'Settings',
    icon: <img src={user} alt="Settings" className="h-4 w-auto" />,
  },
];

const TabManu = ({ active, onChange }) => {
  return (
    <nav className="w-full bg-white border-t border-b border-gray-200 shadow-sm">
      <ul className="flex items-center gap-8 px-8 py-2">
        {tabs.map((tab, idx) => (
          <li key={tab.name}>
            <button
              className={`flex items-center gap-2 px-2 py-1 text-base font-medium transition-colors duration-150 focus:outline-none ${
                active === idx
                  ? 'text-gray-900 border-b-2 border-gray-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => onChange(idx)}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.name}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TabManu;
