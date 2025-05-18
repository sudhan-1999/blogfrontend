import { useEffect, useState } from "react";
import axios from "axios";

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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

function Blogs() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");

  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("userid");

  // Initial fetch all blogs
  useEffect(() => {
    setLoading(true);
    setError("");
    axios
      .get("https://blogbackend-pxag.onrender.com/api/blogs", {
        headers: { authorization: token },
      })
      .then((res) => {
        if (res.data.length === 0) {
          setError("No blogs found.");
          setData([]);
        } else {
          setData(res.data);

          // Extract unique categories and authors dynamically
          const uniqueCategories = [
            ...new Set(res.data.map((b) => b.category).filter(Boolean)),
          ];
          const uniqueAuthors = [
            ...new Set(res.data.map((b) => b.author).filter(Boolean)),
          ];
          setCategories(uniqueCategories);
          setAuthors(uniqueAuthors);
          setError("");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setError("Failed to fetch blogs.");
        setLoading(false);
        setData([]);
      });
  }, [token]);

  // Fetch filtered blogs when category or author changes
  useEffect(() => {
    if (!selectedCategory && !selectedAuthor) {
      return;
    }

    setLoading(true);
    setError("");

    const params = new URLSearchParams();
    if (selectedCategory) params.append("category", selectedCategory);
    if (selectedAuthor) params.append("author", selectedAuthor);
    params.append("userid", userid);

    axios
      .get(`https://blogbackend-pxag.onrender.com/api/blogs?${params.toString()}`, {
        headers: { authorization: token },
      })
      .then((res) => {
        if (res.data.length === 0) {
          setError("No blogs found for selected filters.");
          setData([]);
        } else {
          setData(res.data);
          setError("");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Filter API Error:", err);
        setError("Failed to fetch filtered blogs.");
        setData([]);
        setLoading(false);
      });
  }, [selectedCategory, selectedAuthor, token, userid]);

  return (
    <Container sx={{ mt: 4 }}>
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            value={selectedCategory}
            label="Category"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="author-label">Author</InputLabel>
          <Select
            labelId="author-label"
            value={selectedAuthor}
            label="Author"
            onChange={(e) => setSelectedAuthor(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {authors.map((auth) => (
              <MenuItem key={auth} value={auth}>
                {auth}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {/* Blog content */}
      {loading ? (
        <Stack direction="row" spacing={4} id="blogscard">
          {[...Array(3)].map((_, i) => (
            <Box key={i} sx={{ width: 300 }}>
              <Skeleton variant="rectangular" width={300} height={180} />
              <Skeleton variant="text" height={40} sx={{ fontSize: "1.5rem", mt: 1 }} />
              <Skeleton variant="text" height={20} sx={{ fontSize: "1rem" }} />
              <Skeleton variant="text" height={20} width="80%" sx={{ fontSize: "1rem" }} />
            </Box>
          ))}
        </Stack>
      ) : error ? (
        <Typography variant="h5" color="error" align="center">
          {error}
        </Typography>
      ) : (
        <Grid container spacing={4} id="blogcard">
          {data.map((blog) => (
            <Grid item xs={12} sm={6} md={4} key={blog._id}>
              <Card sx={{ maxWidth: 450 }}>
                {blog.img ? (
                  <CardMedia
                    sx={{ height: 140 }}
                    image={blog.image || "/static/images/cards/contemplative-reptile.jpg"}
                    title={blog.title}
                  />
                ) : null}
                <CardContent sx={{ height: 300 }}>
                  <Typography gutterBottom variant="h4" component="div">
                    {blog.title}
                  </Typography>
                  <Typography gutterBottom variant="h5" component="div">
                    {blog.category}
                  </Typography>
                  <Typography gutterBottom variant="h6" component="div">
                    {blog.author}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 5,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {blog.content}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default Blogs;
