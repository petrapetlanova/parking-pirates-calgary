import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function BasicButtons() {
  
  return (
    <Stack spacing={2} direction="row">
      
      {/* <Button style={{color:'yellow', backgroundColor:'#212121'}} variant="contained">show in map</Button> */}
      <Button variant="outlined" style={{color:'white', backgroundColor:'#212121'}}>Navigate</Button>
    </Stack>
  );
}