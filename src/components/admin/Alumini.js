import React, { useState } from 'react';
import { useFormik } from 'formik';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';

const FileUpload = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  

  // Formik form initialization
  const formik = useFormik({
    initialValues: {
      file: null,
    },
    onSubmit: async (values) => {
      if (!values.file) {
        alert('Please upload a file');
        return;
      }

      setLoading(true);
      const formData = new FormData();
      formData.append('file', values.file);

      try {
        const response = await axios.post('https://shiloh-server-2t51.onrender.com/users/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setData(response.data);  // Set the table data
        setLoading(false);
        setSnackbarSeverity("success");
        setSnackbarMessage("File upload successfully!");
        setSnackbarOpen(true);
        
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Error uploading file');
        setLoading(false);
      }
    },
  });
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // React Dropzone setup for file drop
  const { getRootProps, getInputProps } = useDropzone({
    accept: '.csv,.xlsx,.xls',
    onDrop: (acceptedFiles) => {
      formik.setFieldValue('file', acceptedFiles[0]);
    },
  });

  return (
    <div>
      <Typography variant="h5" gutterBottom>Upload a Spreadsheet File</Typography>

      {/* Form with Formik */}
      <form onSubmit={formik.handleSubmit}>
        <div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: '20px', cursor: 'pointer' }}>
          <input {...getInputProps()} />
          <Typography variant="body1" color="primary" sx={{alignItems:'center', justifyContent:'center'}}>
            Drag & Drop a file here, or click to select a file
          </Typography>
        </div>

        <Button variant="contained" color="primary" type="submit" style={{ marginTop: '20px' }}>
          Upload File
        </Button>
      </form>

      {loading && <CircularProgress />}

      {data.length > 0 && !loading && (
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                {Object.keys(data[0]).map((key) => (
                  <TableCell key={key}>{key}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  {Object.values(row).map((value, idx) => (
                    <TableCell key={idx}>{value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbarSeverity}
              variant="filled"
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
    </div>
  );
};

export default FileUpload;
