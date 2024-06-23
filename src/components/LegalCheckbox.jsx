import React from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';

const LegalCheckbox = ({ isLegal, setIsLegal }) => {
  const handleCheckboxChange = (event) => {
    setIsLegal(event.target.checked);
  };

  return (
    <FormControlLabel
      control={<Checkbox checked={isLegal} onChange={handleCheckboxChange} color="primary" />}
      label="Is the place still legal?"
    />
  );
};

export default LegalCheckbox;
