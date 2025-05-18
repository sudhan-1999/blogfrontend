import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userid');
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Button color="inherit" component={Link} to="/blogs">
            Blogs
          </Button>
          <Button color="inherit" component={Link} to="/myblogs">
            My Posts
          </Button>
          <Button color="inherit" component={Link} to="/postblog">
            Add post
          </Button>
        </Typography>
        <Button color="inherit" onClick={handleLogout}>
          Log Out
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
