import React from 'react';
import { Delete as DeleteIcon } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';
import axios from 'axios';
import { getToken } from '../../context/GlobalState';

const Log = ({ props }: any) => {
  const handleAction: any = async (e: any, logItemId: any) => {
    const res: any = await axios.delete(`api/task/log/${logItemId}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
  };
  return (
    <>
      <IconButton onClick={(e) => handleAction(e, props.row.id)}>
        <DeleteIcon />
      </IconButton>
    </>
  );
};

export default Log;
