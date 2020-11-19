import React, { useState } from 'react';
import Title from '../Title';
import moment from 'moment';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  LibraryBooks,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from '@material-ui/icons';
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  IconButton,
  Box,
  Collapse,
} from '@material-ui/core';

const Row = (props: any) => {
  const [open, setOpen] = useState(false);
  const [modify, setModify] = useState(false);
  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          {moment().format(props.row.createdAt).slice(0, 10)}
        </TableCell>
        <TableCell>{props.row.name}</TableCell>
        <TableCell>{props.row.projectNumber}</TableCell>
        <TableCell>{props.row.hoursAvailableToWork}</TableCell>
        <TableCell>{props.row.hoursWorked}</TableCell>
        <TableCell>{props.row.numberOfReviews}</TableCell>
        {!props.showCompleted && (
          <TableCell>
            {!modify ? (
              <IconButton onClick={() => setModify(!modify)}>
                <MoreVertIcon />
              </IconButton>
            ) : (
              <>
                <IconButton
                  onClick={(e) =>
                    props.handleAction(e, props.row.projectNumber, 'edit')
                  }
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
                  onClick={(e) =>
                    props.handleAction(e, props.row.projectNumber, 'log')
                  }
                >
                  <LibraryBooks />
                </IconButton>
              </>
            )}
          </TableCell>
        )}
        {props.showCompleted && (
          <TableCell>
            {!modify ? (
              <IconButton onClick={() => setModify(!modify)}>
                <MoreVertIcon />
              </IconButton>
            ) : (
              <>
                <IconButton
                  onClick={(e) =>
                    props.handleAction(e, props.row.projectNumber, 'delete')
                  }
                >
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  onClick={(e) =>
                    props.handleAction(e, props.row.projectNumber, 'log')
                  }
                >
                  <LibraryBooks />
                </IconButton>
              </>
            )}
          </TableCell>
        )}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box>
              <Title>More Information</Title>
              <Table size="small" aria-label="more-information">
                <TableHead>
                  <TableRow>
                    <TableCell>Hours for BIM</TableCell>
                    <TableCell>Review Hours</TableCell>
                    <TableCell>Hours Remaining</TableCell>
                    <TableCell>Notes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{props.row.hoursRequiredByBim}</TableCell>
                    <TableCell>{props.row.reviewHours}</TableCell>
                    <TableCell>{props.row.hoursRemaining}</TableCell>
                    <TableCell>{props.row.notes}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default Row;
