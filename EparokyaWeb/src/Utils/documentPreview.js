import React from 'react';
import { Box, Typography } from '@mui/material';

const DocumentPreview = ({ file, previewUrl }) => {
  if (!file || !previewUrl) return null;

  return file.type.startsWith("image/") ? (
    <Box mt={2}>
      <img
        src={previewUrl}
        alt="Preview"
        style={{ maxHeight: "150px", maxWidth: "100%" }}
      />
      <Typography variant="caption" display="block" mt={1}>
        {file.name}
      </Typography>
    </Box>
  ) : (
    <Box mt={2} sx={{ width: "100%", height: "300px", mb: 4 }}>
      <iframe
        src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
        title="Document Preview"
        style={{
          width: "100%",
          height: "100%",
          border: "1px solid #ddd",
          borderRadius: "4px",
        }}
      />
      <Typography variant="caption" display="block" mt={1}>
        {file.name}
      </Typography>
    </Box>
  );
};

export default DocumentPreview;