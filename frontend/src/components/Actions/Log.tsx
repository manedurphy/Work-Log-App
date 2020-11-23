import React from 'react';
import axios, { AxiosResponse } from 'axios';
import { Delete as DeleteIcon } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';
import { getToken } from '../../context/GlobalState';
import {
  HandleLogActionType,
  ITask,
  MessageType,
  SetAlertsAndHandleResponseType,
} from '../../type';

const Log: React.FC<{
  setAlertsAndHandleResponse: SetAlertsAndHandleResponseType;
  row: ITask;
}> = (props) => {
  const handleAction: HandleLogActionType = async (e, logItemId) => {
    try {
      const res: AxiosResponse<MessageType> = await axios.delete(
        `api/task/log/${logItemId}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      props.setAlertsAndHandleResponse(
        'delete',
        res.data.message,
        'logs',
        props.row.projectNumber,
        null
      );
    } catch (err) {
      props.setAlertsAndHandleResponse(
        'error',
        err.response.data.message,
        null,
        null,
        err
      );
    }
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
