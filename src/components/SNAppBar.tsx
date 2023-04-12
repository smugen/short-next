import { AuthedUserContext, useSignOut } from '@/utils/authentication';
import stringAvatar from '@/utils/stringAvatar';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import Logout from '@mui/icons-material/Logout';
import RefreshIcon from '@mui/icons-material/Refresh';
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
import { useContext, useState } from 'react';

interface Props {
  refresh: () => void;
  add: () => void;
  toggleSelectRemove: () => boolean;
}

export default function SNAppBar({ add, refresh, toggleSelectRemove }: Props) {
  const auth = useContext(AuthedUserContext);
  const [signOut, signOutResult] = useSignOut();
  const [deleteMode, setDeleteMode] = useState(false);

  return (
    <AppBar position="static">
      <Backdrop
        sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
        open={signOutResult.fetching}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Toolbar>
        {/* <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton> */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Short Links
        </Typography>
        {auth && (
          <>
            <IconButton
              size="large"
              aria-label="add"
              color="inherit"
              onClick={add}
            >
              <AddIcon />
            </IconButton>
            <IconButton
              size="large"
              aria-label="select-remove"
              color="inherit"
              onClick={() => setDeleteMode(toggleSelectRemove())}
            >
              {deleteMode ? <DeleteForeverIcon /> : <DeleteSweepIcon />}
            </IconButton>
            <IconButton
              size="large"
              aria-label="refresh"
              color="inherit"
              onClick={refresh}
            >
              <RefreshIcon />
            </IconButton>
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
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
