import React from 'react';
import { MoreVert as MoreVertIcon } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';

const MoreVert = (props: any) => {
  return (
    <IconButton onClick={() => props.setModify(!props.modify)}>
      <MoreVertIcon />
    </IconButton>
  );
};

export default MoreVert;
