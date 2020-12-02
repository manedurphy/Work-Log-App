import {
  Box,
  Button,
  createStyles,
  Fade,
  makeStyles,
  Modal,
  Theme,
} from '@material-ui/core';
import React from 'react';
import { Commands } from '../../enums';
import { HandleActionType } from '../../global/types/type';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  })
);
const DeleteModal: React.FC<{
  id: number;
  open: boolean;
  handleClose: () => void;
  handleAction: HandleActionType;
}> = (props) => {
  const classes = useStyles();

  return (
    <Modal open={props.open} className={classes.modal}>
      <Fade in={props.open}>
        <div className={classes.paper}>
          <h2>Are you sure you want to delete?</h2>
          <Box display="flex">
            <Box flexGrow={1}>
              <Button
                variant="contained"
                color="secondary"
                onClick={(e) =>
                  props.handleAction(e, props.id, Commands.DELETE)
                }
              >
                Yes, delete
              </Button>
            </Box>
            <Button variant="contained" onClick={props.handleClose}>
              Cancel
            </Button>
          </Box>
        </div>
      </Fade>
    </Modal>
  );
};

export default DeleteModal;
