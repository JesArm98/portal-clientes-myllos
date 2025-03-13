import { useState } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Box,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Badge,
  Container,
  Grid,
  Paper,
  CssBaseline,
  Drawer as MuiDrawer,
  AppBar as MuiAppBar
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import ClickableAvatar from '@/Components/Avatar/ClickableAvatar';

// Import your sidebar menu items
import { mainListItems } from './listItems';

// Configure drawer width
const drawerWidth = 280;

// Styled components for responsive drawer behavior
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  backgroundColor: '#000',
  zIndex: theme.zIndex.drawer + 1,
  height: '60px',
  // Eliminamos las transiciones para que el AppBar no se mueva con el drawer
  transition: 'none',
  width: '100%',
  // Quitamos el marginLeft para que no se mueva con el drawer
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      backgroundColor: "black",
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

// Create a theme
const defaultTheme = createTheme();

export default function DashboardLayout() {
  const [open, setOpen] = useState(true);
  const [nombreEmpleado, setNombreEmpleado] = useState("Jesus Armando Estrada Aramburo");
  const location = useLocation();
  const navigate = useNavigate();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check authentication
  useState(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      if (location.pathname !== "/sign-in") {
        navigate("/sign-in");
      }
    }
    
    setIsCheckingAuth(false);

    // Get employee name from localStorage
    const storedName = localStorage.getItem("nombreEmpleado");
    if (storedName) {
      setNombreEmpleado(storedName);
    }
  }, [navigate, location.pathname]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  // Function to convert path to friendly name
  const getOptionName = (path) => {
    if (path === "/") return "Inicio"
    return path.replace("/", "").toUpperCase();
  };

  // Block rendering until auth is checked
  if (
    isCheckingAuth ||
    (!localStorage.getItem("token") && location.pathname !== "/sign-in")
  ) {
    return null;
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed">
          <Toolbar sx={{ pr: '24px' }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
              }}
            >
              <MenuIcon />
            </IconButton>
            
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1, fontWeight: 700, fontSize: '1.5em' }}
            >
              {location.pathname !== "/" && "OPCIÓN DE "}{" "}
              {getOptionName(location.pathname)}
            </Typography>

            <Box sx={{ display: "flex", gap: 4, alignItems: 'center' }}>
              <Typography fontWeight={500} fontSize={"1em"}>
                {nombreEmpleado}
              </Typography>
              <ClickableAvatar />
            </Box>


          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon sx={{color:"white"}}/>
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems}
            <Divider sx={{ my: 1 }} />
            {/* Secondary list items could go here */}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
            marginLeft: open ? 0 : `-${drawerWidth - 280}px`, 
            transition: defaultTheme.transitions.create('margin', {
              easing: defaultTheme.transitions.easing.sharp,
              duration: defaultTheme.transitions.duration.enteringScreen,
            }),
          }}
        >
          <Toolbar />
          <Container maxWidth="auto" sx={{ mt: 4, mb: 4 }}>
            <Outlet />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}