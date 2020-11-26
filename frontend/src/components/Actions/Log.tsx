import React, { useContext } from 'react';
import axios, { AxiosResponse } from 'axios';
import { Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';
import { GlobalContext } from '../../context/GlobalState';
import { getLogs, getToken } from '../../globalFunctions';
import { HandleLogActionType, ILog, MessageType } from '../../type';
import { Alerts, Logs } from '../../enums';

const Log: React.FC<{
  row: ILog;
}> = (props) => {
  const { state, dispatch } = useContext(GlobalContext);

  const handleAction: HandleLogActionType = async (e, logItemId, command) => {
    try {
      if (command === 'delete') {
        console.log('THIS BLOCK WAS HIT');
        const res: AxiosResponse<MessageType> = await axios.delete(
          `api/log/${logItemId}`,
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          }
        );

        dispatch({
          type: Logs.setLogs,
          payload: await getLogs(props.row.projectNumber),
        });
        dispatch({ type: Alerts.setAlerts, payload: res.data });
        setTimeout(() => {
          dispatch({ type: Alerts.removeAlerts, payload: [] });
        }, 3000);
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
      dispatch({ type: Alerts.setAlerts, payload: err.response.data.message });
      setTimeout(() => {
        dispatch({ type: Alerts.removeAlerts, payload: [] });
      }, 3000);
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
