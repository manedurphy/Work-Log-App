import React from 'react';
import Typography from '@material-ui/core/Typography';

const Title = (props: any): JSX.Element => {
  return (
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
      {props.children}
    </Typography>
  );
};

export default Title;
