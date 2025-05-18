import React from 'react';
import { Box, Skeleton, Stack } from '@mui/material';

const Loader = ({ lines = 3 }) => {
  return (
    <Stack spacing={1}>
      {[...Array(lines)].map((_, index) => (
        <Skeleton key={index} variant="text" animation="wave" height={30} />
      ))}
    </Stack>
  );
};

export default Loader;
