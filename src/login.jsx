import { Box, TextField, Typography, Button } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const navigate = useNavigate();
  const [login, setLogin] = useState();
  const [emailError, setEmailError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    // Validate for email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    } else {
      setEmailError("");
    }

    axios
      .post("https://blogbackend-pxag.onrender.com/api/auth/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        
        console.log(response.data);
         console.log(response.data.token);
          console.log(response.data.user);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userid", response.data.user._id);
        toast.success("login successful!", {
          position: "top-right",
        });
      })
      .then(() => {
        navigate("/blogs");
      })
      .catch((error) => {
        console.error(error);
        if (error.response && error.response.status === 400) {
          setLogin(true);
        }
        toast.error("login Failed. Please try again.", {
          position: "top-right",
        });
      });
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ maxWidth: 400, mx: "auto", mt: 10 }}
      >
        <Typography variant="h5" gutterBottom>
          Log In
        </Typography>
        {login === true && (
          <Typography variant="h5" className="login" gutterBottom>
            Invalid credentials
          </Typography>
        )}
        <TextField
          name="email"
          label="Email"
          fullWidth
          margin="normal"
          error={!!emailError}
          helperText={emailError}
          required
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" fullWidth>
          Log In
        </Button>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account?{" "}
          <Button
            onClick={() => {
              navigate("/");
            }}
          >
            Sign up
          </Button>
        </Typography>
      </Box>
      <ToastContainer />
    </>
  );
}
