
import { Box, TextField, Typography, Button } from '@mui/material';
import './app.css';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SignIn() {
  const [signup, setSignup] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');

    // Email format validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Invalid email format.', {
        position: 'top-right',
      });
      return;
    }

    axios.post("https://blogbackend-pxag.onrender.com/api/auth/signup", { name, email, password })
      .then((response) => {
        console.log(response.data);
        toast.success('Signup Successful!', {
          position: 'top-right',
        });
        navigate("/login");
      })
      .catch((error) => {
        console.error(error);
        if (error.response && error.response.status === 400) {
          setSignup(true);
          if (error.response.data.message === "user already exists") {
            toast.error("This email is already registered.", {
              position: "top-right",
            });
          }
        } else {
          toast.error('Signup Failed. Please try again.', {
            position: 'top-right',
          });
        }
      });
  };

  return (
    <>
      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 10 }}>
        <Typography variant="h5" gutterBottom>Sign In</Typography>
        {signup && (
          <Typography variant="h5" className='signup' gutterBottom>
            User already exists
          </Typography>
        )}
        <TextField name="name" label="Name" fullWidth margin="normal" required />
        <TextField name="email" label="Email" fullWidth margin="normal" required />
        <TextField name="password" label="Password" type="password" autoComplete='' fullWidth margin="normal" required />
        <Button type="submit" variant="contained" fullWidth>Sign In</Button>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account? <Button onClick={() => { navigate("/login") }}>Log In</Button>
        </Typography>
      </Box>
      <ToastContainer />
    </>
  );
}
