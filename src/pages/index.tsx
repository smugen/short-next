import UserService from '@/services/UserService';
import {
  AuthedUser,
  LOGIN_PATH,
  useDispatchAuthedUser,
  useSignOut,
} from '@/utils/authentication';
import Button from '@mui/material/Button';
import type { GetServerSideProps } from 'next';
import Container from 'typedi';

interface Props {
  user: AuthedUser;
}

export const getServerSideProps: GetServerSideProps<Props> =
  async function getServerSideProps({ req }) {
    const userService = Container.get(UserService);
    const user = await userService.authenticate(req);

    if (!user) {
      return {
        redirect: {
          destination: LOGIN_PATH,
          permanent: false,
        },
      };
    }

    return {
      props: {
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    };
  };

export default function Page({ user }: Props) {
  useDispatchAuthedUser(user);
  const [signOut] = useSignOut();

  return (
    <>
      <Button variant="contained" onClick={signOut}>
        Sign out
      </Button>
      <hr />
      <textarea value={JSON.stringify(user, void 0, 2)} readOnly></textarea>
    </>
  );
}
