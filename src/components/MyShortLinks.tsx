import { ShortLinkListContext, useMyShortLinks } from '@/utils/shortLink';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import LinearProgress from '@mui/material/LinearProgress';
import { forwardRef, useImperativeHandle, useState } from 'react';

import AddShortLinkDialog from './AddShortLinkDialog';
import ShortLinkList from './ShortLinkList';

export interface MyShortLinksRef {
  refresh: () => void;
  add: () => void;
}

const MyShortLinks = forwardRef<MyShortLinksRef>(function MyShortLinks(_, ref) {
  const [result, refresh] = useMyShortLinks();
  const [openAdd, setOpenAdd] = useState(false);

  useImperativeHandle(ref, () => ({ refresh, add }), [refresh]);

  function add() {
    setOpenAdd(true);
  }

  function closeAdd(doRefresh?: boolean) {
    doRefresh && refresh();
    setOpenAdd(false);
  }

  const { shortLinks, error, fetching, stale } = result;

  return (
    <ShortLinkListContext.Provider value={shortLinks ?? []}>
      <Box sx={{ width: '100%' }}>
        <Collapse in={!!error}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error?.toString()}
          </Alert>
        </Collapse>
        <Collapse in={fetching || stale}>
          <LinearProgress />
        </Collapse>
      </Box>
      <AddShortLinkDialog isOpen={openAdd} onClose={closeAdd} />
      <ShortLinkList />
    </ShortLinkListContext.Provider>
  );
});

export default MyShortLinks;
