import React from 'react';

const Spinner: React.FC<{
  one: boolean;
}> = (props): JSX.Element => {
  return <div className={props.one ? 'loader' : 'loader2'}></div>;
};

export default Spinner;
