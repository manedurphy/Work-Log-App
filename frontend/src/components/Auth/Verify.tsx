import React from 'react';
import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { getToken } from '../../context/GlobalState';
import { Redirect } from 'react-router-dom';

const Verify = () => {
  const token = getToken();
  const [isVerified, setIsVerified] = useState(false);
  const [permission, setPermission] = useState(true);

  useEffect(() => {
    !token && setPermission(false);

    (async () => {
      try {
        const res: AxiosResponse<{ isVerified: boolean }> = await axios.get(
          '/api/auth/verify',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setIsVerified(res.data.isVerified);
      } catch (error) {
        throw error;
      }
    })();
  });
  return (
    <div>
      {isVerified && <Redirect to="/" />}
      {!permission && <Redirect to="/login" />}
    </div>
  );
};

export default Verify;
