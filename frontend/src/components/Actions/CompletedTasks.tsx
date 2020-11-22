import React from 'react';
import { Delete as DeleteIcon, LibraryBooks } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';

const CompletedTasks = ({ props }: any) => {
  return (
    <>
      <IconButton
        onClick={(e) =>
          props.handleAction(e, props.row.projectNumber, 'delete')
        }
      >
        <DeleteIcon />
      </IconButton>
      <IconButton
        onClick={(e) => props.handleAction(e, props.row.projectNumber, 'log')}
      >
        <LibraryBooks />
      </IconButton>
    </>
  );
};

export default CompletedTasks;
