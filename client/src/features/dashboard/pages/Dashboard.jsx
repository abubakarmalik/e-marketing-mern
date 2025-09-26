import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../auth/authSlice';
import { selectContactsTotal } from '../../contacts/contactSlice';
import TopHeading from '../../../components/shared/TopHeading';
import Overview from './Overview';
import TotalContacts from '../../../components/TotalContacts';
import TotalEmails from '../../../components/TotalEmails';
import LastBroadcast from '../../../components/LastBroadcast';
import CurrentProcess from '../../../components/CurrentProcess';

const Dashboard = () => {
  const user = useSelector(selectCurrentUser);
  const total = useSelector(selectContactsTotal);

  const statusData = {
    contacts: {
      value: total,
      updated: new Date().toISOString(),
    },
    emails: {
      value: 0,
      updated: new Date().toISOString(),
    },
    broadcast: {
      value: 0,
      status: 'completed',
      updated: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    },
    process: {
      value: 'Email Campaign',
      status: 'active',
      updated: new Date().toISOString(),
    },
  };

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center border-b border-gray-200 bg-white px-8 py-4 mb-4">
          <TopHeading
            heading={`Welcome back, ${user?.name || 'User'}!`}
            subheading="Here's a summary of your dashboard"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <TotalContacts type="contacts" {...statusData.contacts} />
          <TotalEmails type="emails" {...statusData.emails} />
          <LastBroadcast type="broadcast" {...statusData.broadcast} />
          <CurrentProcess type="process" {...statusData.process} />
        </div>
      </div>

      <Overview />
    </>
  );
};

export default Dashboard;
