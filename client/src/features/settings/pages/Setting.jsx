// client/src/features/settings/pages/Setting.jsx
import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TopHeading from '../../../components/shared/TopHeading';
import ProfileSettings from '../widgets/ProfileSettings';
import WhatsappIntegration from '../widgets/WhatsappIntegration';
import { selectCurrentUser } from '../../auth/authSlice';

import {
  fetchWaStatus,
  linkWhatsapp,
  unlinkWhatsapp,
  selectWaLinked,
  selectWaNumber,
  selectWaStatus,
  selectWaQr,
  selectWaLoading,
} from '../settingSlice';

const Setting = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  const linked = useSelector(selectWaLinked);
  const number = useSelector(selectWaNumber);
  const status = useSelector(selectWaStatus);
  const qr = useSelector(selectWaQr);
  const loading = useSelector(selectWaLoading);

  const pollRef = useRef(null);

  // get current status when page opens
  useEffect(() => {
    dispatch(fetchWaStatus());
  }, [dispatch]);

  // poll while pairing
  useEffect(() => {
    if (status === 'PAIRING') {
      if (!pollRef.current) {
        pollRef.current = setInterval(() => dispatch(fetchWaStatus()), 2000);
      }
    } else if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [status, dispatch]);

  const handleLink = async () => {
    await dispatch(linkWhatsapp()).unwrap(); // flips to PAIRING
    dispatch(fetchWaStatus()); // grab first QR asap
  };

  const handleUnlink = async () => {
    await dispatch(unlinkWhatsapp()).unwrap();
    dispatch(fetchWaStatus());
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex justify-between items-center border-b border-gray-200 bg-white px-8 py-4 mb-4">
        <TopHeading
          heading={`Welcome back, ${user?.name || 'User'}!`}
          subheading="Here's your account settings."
        />
      </div>

      <div className="flex flex-row gap-2">
        <div className="basis-1/2 bg-white p-4">
          <div className="mb-4 border-dashed border-2 border-gray-300 rounded-lg">
            <ProfileSettings />
          </div>
        </div>

        <div className="basis-1/2 bg-white p-4">
          <div className="mb-4 border-dashed border-2 border-gray-300 rounded-lg">
            <WhatsappIntegration
              isLinked={linked}
              linkedNumber={number}
              status={status}
              qr={qr}
              loading={loading}
              onLink={handleLink}
              onUnlink={handleUnlink}
            />
          </div>

          {/* <div className="mb-4 border-dashed border-2 border-gray-300 rounded-lg p-4 text-center">
            <h3>Coming soon!</h3>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Setting;
