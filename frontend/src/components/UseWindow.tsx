import React, { useState, useEffect } from 'react';

const UseWindow = () => {
  const [windowSize, setWindowSize] = useState({
    width: -1,
    height: -1,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

export default UseWindow;
