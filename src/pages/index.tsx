import MyShortLinks from '@/components/MyShortLinks';
import type { MyShortLinksRef } from '@/components/MyShortLinks';
import SNAppBar from '@/components/SNAppBar';
import UserService from '@/services/UserService';
import {
  AuthedUser,
  LOGIN_PATH,
  useDispatchAuthedUser,
} from '@/utils/authentication';
import type { GetServerSideProps } from 'next';
import { useRef } from 'react';
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
  const myShortLinksRef = useRef<MyShortLinksRef>(null);

  return (
    <>
      <SNAppBar
        refresh={() => myShortLinksRef.current?.refresh()}
        add={() => myShortLinksRef.current?.add()}
        toggleSelectRemove={() =>
          myShortLinksRef.current?.toggleSelectRemove() ?? false
        }
      />
      <MyShortLinks ref={myShortLinksRef} />
    </>
  );
}

// Speed Dial
// Drawer
// Dialog
// Snackbar
