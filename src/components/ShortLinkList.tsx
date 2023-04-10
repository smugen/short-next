import { ShortLinkListContext } from '@/utils/shortLink';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useContext, useMemo } from 'react';

interface Props {
  remove: (shortLinkIdList: string[]) => void;
}

export default function ShortLinkList({ remove }: Props) {
  const shortLinks = useContext(ShortLinkListContext);

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

  return (
    <List>
      {shortLinks.map(({ id, viewCount, slug, fullLink }) => {
        const url = new URL(`/${slug}`, window.location.origin);

        return (
          <ListItem
            key={id}
            secondaryAction={
              <IconButton aria-label="delete" onClick={() => remove([id])}>
                <DeleteIcon />
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
}
