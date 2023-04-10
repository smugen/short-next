import { SetGlobalLoadingContext } from '@/pages/_app';
import {
  ShortLinkItem,
  ShortLinkListContext,
  useMyShortLinks,
  useRemoveShortLinks,
} from '@/utils/shortLink';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import LinearProgress from '@mui/material/LinearProgress';
import { forwardRef, useContext, useImperativeHandle, useState } from 'react';

import AddShortLinkDialog from './AddShortLinkDialog';
import RemoveShortLinkDialog from './RemoveShortLinkDialog';
import ShortLinkList from './ShortLinkList';

export interface MyShortLinksRef {
  refresh: () => void;
  add: () => void;
}

const MyShortLinks = forwardRef<MyShortLinksRef>(function MyShortLinks(_, ref) {
  const [result, refresh] = useMyShortLinks();
  const [removeShortLinks, removeShortLinksResult] = useRemoveShortLinks();
  const [openAdd, setOpenAdd] = useState(false);
  const [itemsToRemove, setItemsToRemove] = useState<ShortLinkItem[]>();
  const setGlobalLoading = useContext(SetGlobalLoadingContext);

  useImperativeHandle(ref, () => ({ refresh, add }), [refresh]);

  function add() {
    setOpenAdd(true);
  }

  function closeAdd(doRefresh?: boolean) {
    doRefresh && refresh();
    setOpenAdd(false);
  }

  function remove(shortLinks: ShortLinkItem[]) {
    setItemsToRemove(shortLinks);
  }

  async function closeRemove(shortLinkIdList?: string[]) {
    if (!shortLinkIdList) {
      return setItemsToRemove(void 0);
    }
    setGlobalLoading(true);
    await removeShortLinks({ shortLinkIdList });
    setItemsToRemove(void 0);
    setGlobalLoading(false);
    refresh();
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
        <Collapse in={!!removeShortLinksResult.error}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {removeShortLinksResult.error?.toString()}
          </Alert>
        </Collapse>
        <Collapse in={fetching || stale}>
          <LinearProgress />
        </Collapse>
      </Box>
      <AddShortLinkDialog isOpen={openAdd} onClose={closeAdd} />
      <RemoveShortLinkDialog items={itemsToRemove} onConfirm={closeRemove} />
      <ShortLinkList remove={remove} />
    </ShortLinkListContext.Provider>
  );
});

export default MyShortLinks;
