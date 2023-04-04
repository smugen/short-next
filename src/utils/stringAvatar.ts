import stc from 'string-to-color';

export default function stringAvatar(name: string) {
  const [first, second] = name.split(' ');
  return {
    sx: { bgcolor: stc(name) },
    children: `${first[0]}${second?.[0] ?? ''}`,
  };
}
