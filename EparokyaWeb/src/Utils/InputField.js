import React from 'react';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box
} from '@mui/material';

const InputField = ({
  type = 'text',
  label,
  value,
  onChange,
  onFileChange,
  path,
  fieldName,
  required = false,
  fullWidth = true,
  options = [],
  sx = {},
  inputProps = {},
  customValidation = false,
  onCustomValidation,
  ...props
}) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e, path);
    }
  };

  const handleFileChange = (e) => {
    if (onFileChange && fieldName) {
      onFileChange(e, fieldName);
    }
  };

  switch (type) {
    case 'select':
      return (
        <FormControl fullWidth={fullWidth} required={required} sx={sx}>
          <InputLabel>{label}</InputLabel>
          <Select
            value={value}
            onChange={handleChange}
            label={label}
            {...props}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );

    case 'file':
      return (
        <Box sx={sx}>
          <Button variant="contained" component="label" fullWidth={fullWidth}>
            Upload {label}
            <input
              type="file"
              hidden
              onChange={handleFileChange}
              accept="image/*,.pdf,.doc,.docx"
              required={required}
              {...props}
            />
          </Button>
        </Box>
      );

    case 'date':
    case 'time':
      return (
        <TextField
          type={type}
          label={label}
          value={value}
          onChange={customValidation && onCustomValidation ? onCustomValidation : handleChange}
          required={required}
          fullWidth={fullWidth}
          InputLabelProps={{ shrink: true }}
          sx={sx}
          inputProps={inputProps}
          {...props}
        />
      );

    default:
      return (
        <TextField
          type={type}
          label={label}
          value={value}
          onChange={handleChange}
          required={required}
          fullWidth={fullWidth}
          sx={sx}
          inputProps={inputProps}
          {...props}
        />
      );
  }
};

export default InputField;