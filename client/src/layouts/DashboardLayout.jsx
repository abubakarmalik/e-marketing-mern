import { useState } from 'react';
import Branding from '../components/Branding';
import Header from '../components/Header';
import TabManu from '../components/TabManu';
import Dashboard from '../features/dashboard/pages/Dashboard';
import Contact from '../features/contacts/pages/Contact';
import Email from '../features/emails/pages/Email';
import Setting from '../features/settings/pages/Setting';
import TopHeading from '../components/TopHeading';

const tabPages = [
  <Dashboard key="dashboard" />,
  <Contact key="contacts" />,
  <Email key="emails" />,
  <Setting key="settings" />,
];

const DashboardLayout = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <Header />
      <TabManu active={activeTab} onChange={setActiveTab} />
      {tabPages[activeTab]}
      <Branding />
    </>
  );
};

export default DashboardLayout;
