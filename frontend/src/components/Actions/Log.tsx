import React from 'react';
import { Delete as DeleteIcon } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';

const Log = ({ props }: any) => {
  return (
    <>
      <IconButton
        onClick={(e) =>
          props.handleAction(e, props.row.projectNumber, 'delete')
        }
      >
        <DeleteIcon />
      </IconButton>
    </>
  );
};

export default Log;
