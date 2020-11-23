import React from 'react';
import axios, { AxiosResponse } from 'axios';
import { IconButton } from '@material-ui/core';
import { Delete as DeleteIcon, LibraryBooks } from '@material-ui/icons';
import {
  HandleActionType,
  ILog,
  ITask,
  MessageType,
  SetAlertsAndHandleResponseType,
} from '../../type';
import { getToken, GlobalContext } from '../../context/GlobalState';
import { useContext } from 'react';
import { Logs } from '../../enums';

const CompletedTasks: React.FC<{
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertsAndHandleResponse: SetAlertsAndHandleResponseType;
  row: ITask;
}> = (props) => {
  const { state, dispatch } = useContext(GlobalContext);
  const { showLog } = state.log;

  const handleAction: HandleActionType = async (e, projectNumber, command) => {
    e.preventDefault();
    props.setLoading(true);
    let res: AxiosResponse<MessageType>;
    const token = getToken();

    try {
      if (command === 'delete' && !showLog) {
        res = await axios.delete(`api/task/${projectNumber}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        props.setAlertsAndHandleResponse(
          command,
          res.data.message,
          'tasks',
          null,
          null
        );
      } else {
        dispatch({ type: Logs.setShowLog, payload: true });
        const log: AxiosResponse<ILog[]> = await axios.get(
          `api/task/log/${projectNumber}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        dispatch({ type: Logs.setLog, payload: log.data });
      }
      props.setLoading(false);
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
      <IconButton
        onClick={(e) => handleAction(e, props.row.projectNumber, 'delete')}
      >
        <DeleteIcon />
      </IconButton>
      <IconButton
        onClick={(e) => handleAction(e, props.row.projectNumber, 'log')}
      >
        <LibraryBooks />
      </IconButton>
    </>
  );
};

export default CompletedTasks;
