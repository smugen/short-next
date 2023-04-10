import { ShortLinkItem } from '@/utils/shortLink';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

interface Props {
  items?: ShortLinkItem[];
  onConfirm: (shortLinkIdList?: string[]) => void;
}

export default function RemoveShortLinkDialog({ items, onConfirm }: Props) {
  function confirm() {
    onConfirm(items?.map(i => i.id));
  }

  return (
    <Dialog open={!!items} onClose={() => onConfirm()}>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please confirm that these short links will be removed.
        </DialogContentText>
        <List>
          {items?.map(({ id, slug, fullLink }) => {
            const url = new URL(`/${slug}`, window.location.origin);

            return (
              <ListItem key={id}>
                <ListItemText
                  primary={
                    <a target="new" href={url.href}>
                      <Tooltip title="Open in new">
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {url.href}
                        </Typography>
                      </Tooltip>
                    </a>
                  }
                  secondary={fullLink}
                />
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onConfirm()}>Cancel</Button>
        <Button onClick={confirm}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
}
