import { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField
} from "@mui/material";

import {
  Box,
  Stack,
  Skeleton,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Container,
  CardActions,
  Button,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Myblogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState({
    _id: "",
    title: "",
    category: "",
    author: "",
    content: "",
  });

  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("userid");
  const authHeader = token ? `Bearer ${token}` : "";

  // OPEN MODAL 
  const handleEditClick = (blog) => {
    setEditData(blog); 
    setEditDialogOpen(true);
  };

  //CLOSE MODAL 
  const handleDialogClose = () => {
    setEditDialogOpen(false);
  };

  //SAVE EDIT 
  const handleSaveEdit = async () => {
    const { _id, title, category, author, content } = editData;
    if (!title || !category || !author || !content) {
      toast.error("All fields are required");
      return;
    }
    try {
      await axios.put(
        `https://blogbackend-pxag.onrender.com/api/updateblog/${_id}`,
        { title, category, author, content, userId: userid },
        { headers: { Authorization: authHeader } }
      );
      toast.success("Blog updated successfully!");
      setRefresh((p) => !p);
      setEditDialogOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };
  // Delete blog function
  const deleteBlog = async (id) => {
    try {
      await axios.delete(`https://blogbackend-pxag.onrender.com/api/deleteblog/${id}`, {
        headers: { Authorization: authHeader },
        params: { userid }, 
      });
      toast.success("Blog deleted successfully!");
      setRefresh((prev) => !prev);
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
      toast.error("Failed to delete blog. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  // Confirm deletion effect
  useEffect(() => {
    if (deletingId) {
      if (window.confirm("Are you sure you want to delete this blog?")) {
        deleteBlog(deletingId);
      } else {
        setDeletingId(null);
      }
    }
  }, [deletingId]);

  // Fetch blogs effect
  useEffect(() => {
    if (!token || !userid) return;

    setLoading(true);
    axios
      .get("https://blogbackend-pxag.onrender.com/api/myblogs", {
        headers: { Authorization: authHeader },
        params: { userid },
      })
      .then(({ data }) => setBlogs(data))
      .catch((err) => {
        console.error("Fetch error:", err);
        //toast.error("Failed to fetch blogs");
      })
      .finally(() => setLoading(false));
  }, [authHeader, userid, refresh]);

  return (
    <>
<Dialog open={editDialogOpen} onClose={handleDialogClose} fullWidth maxWidth="sm">
  <DialogTitle>Edit Blog</DialogTitle>
  <DialogContent dividers>
    <Stack spacing={2} sx={{ mt: 1 }}>
      <TextField
        label="Title"
        fullWidth
        value={editData.title}
        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
      />
      <TextField
        label="Category"
        fullWidth
        value={editData.category}
        onChange={(e) => setEditData({ ...editData, category: e.target.value })}
      />
      <TextField
        label="Author"
        fullWidth
        value={editData.author}
        onChange={(e) => setEditData({ ...editData, author: e.target.value })}
      />
      <TextField
        label="Content"
        fullWidth
        multiline
        rows={6}
        value={editData.content}
        onChange={(e) => setEditData({ ...editData, content: e.target.value })}
      />
    </Stack>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleDialogClose}>Cancel</Button>
    <Button variant="contained" onClick={handleSaveEdit}>
      Save
    </Button>
  </DialogActions>
</Dialog>

      <Container sx={{ mt: 4 }}>
        {loading ? (
          <Stack direction="row" spacing={4}>
            {[...Array(3)].map((_, i) => (
              <Box key={i} sx={{ width: 300 }}>
                <Skeleton variant="rectangular" width={300} height={180} />
                <Skeleton
                  variant="text"
                  height={40}
                  sx={{ fontSize: "1.5rem", mt: 1 }}
                />
                <Skeleton
                  variant="text"
                  height={20}
                  sx={{ fontSize: "1rem" }}
                />
                <Skeleton
                  variant="text"
                  height={20}
                  width="80%"
                  sx={{ fontSize: "1rem" }}
                />
              </Box>
            ))}
          </Stack>
        ) : (
          <Grid container spacing={4}>
            {blogs.length === 0 ? (
              <Typography variant="h6" sx={{ m: 2 }}>
                You have no blogs yet.
              </Typography>
            ) : (
              blogs.map((b) => (
                <Grid item xs={12} sm={6} md={4} key={b._id}>
                  <Card sx={{ maxWidth: 450 }}>
                    {b.image && (
                      <CardMedia
                        sx={{ height: 140 }}
                        image={b.image}
                        title={b.title}
                      />
                    )}
                    <CardContent sx={{ height: 300, overflow: "auto" }}>
                      <Typography gutterBottom variant="h5" noWrap>
                        {b.title}
                      </Typography>
                      <Typography
                        gutterBottom
                        variant="subtitle1"
                        color="text.secondary"
                        noWrap
                      >
                        {b.category}
                      </Typography>
                      <Typography
                        gutterBottom
                        variant="subtitle2"
                        color="text.secondary"
                        noWrap
                      >
                        {b.author}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1, maxHeight: "auto", overflowY: "auto" }}
                      >
                        {b.content}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleEditClick(b)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => setDeletingId(b._id)}
                        disabled={deletingId === b._id}
                      >
                        {deletingId === b._id ? "Deleting..." : "Delete"}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        )}
      </Container>

      {/* Toast container for toasts */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default Myblogs;
