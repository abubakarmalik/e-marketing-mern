import TopBar from './TopBar';
import TotalContacts from '../../../components/TotalContacts';
import ActiveCard from '../../../components/ActiveCard';
import WrongCard from '../../../components/WrongCard';
import CurrentProcess from '../../../components/CurrentProcess';

const Contact = () => {
  const statusData = {
    contacts: {
      value: '2,345',
      updated: new Date().toISOString(),
    },
    correct: {
      title: 'Active Contacts',
      value: '1734',
      updated: new Date().toISOString(),
    },
    wrong: {
      title: 'Inactive Contacts',
      value: 2345 - 1734,
      updated: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    },
    process: {
      value: 'Whatsapp Campaign',
      status: 'idle',
      updated: new Date().toISOString(),
    },
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4">
      <TopBar />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <TotalContacts type="contacts" {...statusData.contacts} />
        <ActiveCard type="correct" {...statusData.correct} />
        <WrongCard type="wrong" {...statusData.wrong} />
        <CurrentProcess type="process" {...statusData.process} />
      </div>
    </div>
  );
};

export default Contact;
