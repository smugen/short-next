import { ShortLinkItem, ShortLinkListContext } from '@/utils/shortLink';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';

export interface ShortLinkListRef {
  getRemoveChecked: () => ShortLinkItem[];
}

interface Props {
  remove: (shortLinks: ShortLinkItem[]) => void;
  selectRemoveMode: boolean;
}

const ShortLinkList = forwardRef<ShortLinkListRef, Props>(
  function ShortLinkList({ remove, selectRemoveMode }: Props, ref) {
    const shortLinks = useContext(ShortLinkListContext);
    const [checked, setChecked] = useState<Record<string, boolean | undefined>>(
      {},
    );

    useImperativeHandle(ref, () => ({
      getRemoveChecked: () => {
        return shortLinks.filter(shortLink => checked[shortLink.id]);
      },
    }), [shortLinks, checked]);

    useEffect(() => {
      selectRemoveMode || setChecked({});
    }, [selectRemoveMode]);

    useMemo(() => {
      shortLinks.sort((a, b) =>
        b.createdAt && a.createdAt
          ? b.createdAt.getTime() - a.createdAt.getTime()
          : 0,
      );
    }, [shortLinks]);

    function doCopy(text: string) {
      navigator.clipboard.writeText(text);
    }

    function toggleRemoveSelect(id: string) {
      setChecked({ ...checked, [id]: !checked[id] });
    }

    return (
      <List>
        {shortLinks.map(shortLink => {
          const { id, viewCount, slug, fullLink } = shortLink;
          const url = new URL(`/${slug}`, window.location.origin);

          return (
            <ListItem
              key={id}
              secondaryAction={
                <IconButton
                  aria-label="delete"
                  onClick={() =>
                    selectRemoveMode
                      ? toggleRemoveSelect(id)
                      : remove([shortLink])
                  }
                >
                  {selectRemoveMode ? (
                    checked[id] ? (
                      <DeleteForeverIcon />
                    ) : (
                      <DeleteOutlineIcon />
                    )
                  ) : (
                    <DeleteIcon />
                  )}
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={viewCount}
                >
                  <Tooltip title="Click to copy">
                    <Avatar onClick={() => doCopy(url.href)}>
                      <ContentCopyIcon />
                    </Avatar>
                  </Tooltip>
                </Badge>
              </ListItemAvatar>
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
    );
  },
);

export default ShortLinkList;
