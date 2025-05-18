import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Stack,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Mynewpost() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userid");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !category || !author || !content) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!token || !userId) {
      toast.error("User not authenticated");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://blogbackend-pxag.onrender.com/api/postblog", 
        { title, category, author, content, id: userId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(response.data.message || "Blog posted successfully!");
      // Clear form after success
      setTitle("");
      setCategory("");
      setAuthor("");
      setContent("");
    } catch (error) {
      console.error("Post blog error:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || "Failed to post blog. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Create New Blog Post
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={3}>
            <TextField
              label="Title"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <TextField
              label="Category"
              variant="outlined"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
            <TextField
              label="Author"
              variant="outlined"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
            <TextField
              label="Content"
              variant="outlined"
              multiline
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              size="large"
            >
              {loading ? "Posting..." : "Post Blog"}
            </Button>
          </Stack>
        </Box>
      </Container>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default Mynewpost;
