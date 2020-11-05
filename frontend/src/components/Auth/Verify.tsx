import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { getToken } from '../../context/GlobalState';
import { Redirect } from 'react-router-dom';

const Verify = () => {
  const token = getToken();
  const [isVerified, setIsVerified] = useState(false);
  const [permission, setPermission] = useState(true);

  useEffect(() => {
    !token && setPermission(false);

    axios
      .get('/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setIsVerified(res.data.isVerified);
      });
  });
  return (
    <div>
      {isVerified && <Redirect to="/" />}
      {!permission && <Redirect to="/login" />}
    </div>
  );
};

export default Verify;
