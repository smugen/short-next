import { SetGlobalLoadingContext } from '@/pages/_app';
import { useAddShortLink } from '@/utils/shortLink';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import { useContext, useEffect, useRef } from 'react';

interface Props {
  isOpen: boolean;
  onClose: (refresh?: boolean) => void;
}

export default function AddShortLinkDialog({ isOpen, onClose }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [addShortLink, addShortLinkResult] = useAddShortLink();
  const setGlobalLoading = useContext(SetGlobalLoadingContext);

  function add() {
    const fullLink = inputRef.current?.value;
    if (fullLink) {
      addShortLink({ fullLink }).then(
        res => res.data && !res.error && onClose(true),
      );
    }
  }

  useEffect(() => {
    setGlobalLoading(addShortLinkResult.fetching);
  }, [addShortLinkResult.fetching, setGlobalLoading]);

  return (
    <Dialog open={isOpen} onClose={() => onClose()}>
      <DialogTitle>Add a new short link</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To add a new short link, please enter the full link here.
        </DialogContentText>
        <TextField
          inputRef={inputRef}
          autoFocus
          margin="dense"
          id="fullLink"
          label="Full Link"
          type="url"
          fullWidth
          variant="standard"
        />
        <Collapse in={!!addShortLinkResult.error}>
          <Divider>Result</Divider>
          <Alert severity="error" sx={{ mb: 2 }}>
            {addShortLinkResult.error?.toString()}
          </Alert>
        </Collapse>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()}>Cancel</Button>
        <Button onClick={add}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}
