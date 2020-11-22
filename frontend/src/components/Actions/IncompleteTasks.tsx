import React from 'react';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  LibraryBooks,
} from '@material-ui/icons';
import { IconButton } from '@material-ui/core';

const IncompleteTasks = ({ props }: any) => {
  return (
    <>
      <IconButton
        onClick={(e) => props.handleAction(e, props.row.projectNumber, 'edit')}
      >
        <EditIcon />
      </IconButton>
      <IconButton
        onClick={(e) =>
          props.handleAction(e, props.row.projectNumber, 'delete')
        }
      >
        <DeleteIcon />
      </IconButton>
      <IconButton
        onClick={(e) =>
          props.handleAction(e, props.row.projectNumber, 'success')
        }
      >
        <CheckCircleOutlineIcon />
      </IconButton>
      <IconButton
        onClick={(e) => props.handleAction(e, props.row.projectNumber, 'log')}
      >
        <LibraryBooks />
      </IconButton>
    </>
  );
};

export default IncompleteTasks;
