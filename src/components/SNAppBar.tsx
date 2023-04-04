import { AuthedUserContext, useSignOut } from '@/utils/authentication';
import stringAvatar from '@/utils/stringAvatar';
import Logout from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import { useContext } from 'react';

export default function SNAppBar() {
  const auth = useContext(AuthedUserContext);
  const [signOut, signOutResult] = useSignOut();

  return (
    <AppBar position="static">
      <Backdrop
        sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
        open={signOutResult.fetching}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Short Links
        </Typography>
        {auth && (
          <PopupState variant="popover" popupId="auth-popup-menu">
            {popupState => (
              <>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  color="inherit"
                  {...bindTrigger(popupState)}
                >
                  <Avatar {...stringAvatar(auth.name)} />
                </IconButton>
                <Menu {...bindMenu(popupState)}>
                  <MenuItem>{`${auth.name} <${auth.username}>`}</MenuItem>
                  <Divider />
                  <MenuItem onClick={signOut}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Sign out
                  </MenuItem>
                </Menu>
              </>
            )}
          </PopupState>
        )}
      </Toolbar>
    </AppBar>
  );
}
