import React, { useContext } from 'react';
import axios, { AxiosResponse } from 'axios';
import { Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';
import { getToken, GlobalContext } from '../../context/GlobalState';
import { HandleLogActionType, ILog, ITask, MessageType } from '../../type';
import { Logs } from '../../enums';

const Log: React.FC<{
  row: ITask | ILog;
}> = (props) => {
  const { dispatch } = useContext(GlobalContext);

  const handleAction: HandleLogActionType = async (e, logItemId, command) => {
    try {
      if (command === 'delete') {
        const res: AxiosResponse<MessageType> = await axios.delete(
          `api/log/${logItemId}`,
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          }
        );
      } else {
        const res: AxiosResponse<ILog> = await axios.get(
          `/api/log/${props.row.id}`,
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          }
        );

        dispatch({ type: Logs.setLog, payload: res.data });
      }
    } catch (err) {
      //TEST THIS ERROR LATER
    }
  };
  return (
    <>
      <IconButton
        onClick={(e) => handleAction(e, props.row.projectNumber, 'edit')}
      >
        <EditIcon />
      </IconButton>
      <IconButton onClick={(e) => handleAction(e, props.row.id, 'delete')}>
        <DeleteIcon />
      </IconButton>
    </>
  );
};

export default Log;
