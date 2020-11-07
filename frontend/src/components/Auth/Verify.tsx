import React from 'react';
import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { VerifyProps } from '../../type';

const Verify: React.FC<VerifyProps> = ({ match: { params } }) => {
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res: AxiosResponse<{ isVerified: boolean }> = await axios.get(
          `/api/auth/verify/${params.hash}`
        );

        setIsVerified(res.data.isVerified);
      } catch (error) {
        throw error;
      }
    })();
  });
  return <div>{isVerified && <Redirect to="/verified-account" />}</div>;
};

export default Verify;
