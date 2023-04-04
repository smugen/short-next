import type { User } from '@/models';
import { useRouter } from 'next/router';
import {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useMutation } from 'urql';

import { graphql } from '../../gql_generated';

export const LOGIN_PATH = '/sys/login';

export const AuthedUserContext = createContext<AuthedUser | null | undefined>(
  void 0,
);
export const AuthedUserDispatchContext = createContext<Dispatch<
  SetStateAction<AuthedUser | null>
> | null>(null);

AuthedUserContext.displayName = 'AuthedUserContext';
AuthedUserDispatchContext.displayName = 'AuthedUserDispatchContext';

export type AuthedUser = Pick<
  User,
  'id' | 'createdAt' | 'updatedAt' | 'name' | 'username'
>;

export function AuthedUserProvider({ children }: React.PropsWithChildren) {
  const [authedUser, setAuthedUser] = useState<AuthedUser | null>();
  const prevAuthedUserRef = useRef<AuthedUser | null>();
  const router = useRouter();

  const setNoUndefined = useCallback(
    function setNoUndefined(value: SetStateAction<AuthedUser | null>) {
      setAuthedUser(
        value instanceof Function ? prev => value(prev ?? null) : value,
      );
    },
    [setAuthedUser],
  );

  useEffect(() => {
    const { current } = prevAuthedUserRef;
    if (current && !authedUser) {
      router.replace(LOGIN_PATH);
    }

    if (!current && authedUser) {
      router.replace('/');
    }

    prevAuthedUserRef.current = authedUser;
  }, [authedUser, router]);

  return (
    <AuthedUserContext.Provider value={authedUser}>
      <AuthedUserDispatchContext.Provider value={setNoUndefined}>
        {children}
      </AuthedUserDispatchContext.Provider>
    </AuthedUserContext.Provider>
  );
}

export function useDispatchAuthedUser(user: AuthedUser | null) {
  const authedUser = useContext(AuthedUserContext);
  const dispatchAuthedUser = useContext(AuthedUserDispatchContext);

  useEffect(() => {
    if (user && authedUser === undefined) {
      dispatchAuthedUser?.(user);
    }
  }, [authedUser, dispatchAuthedUser, user]);
}

const addUserMutation = graphql(/* GraphQL */ `
  mutation addUser($input: AddUserInput!) {
    addUser(input: $input) {
      password
      user {
        username
      }
    }
  }
`);

const signInMutation = graphql(/* GraphQL */ `
  mutation signIn($input: SignInInput!) {
    signIn(input: $input) {
      user {
        id
        name
        username
        createdAt
        updatedAt
      }
    }
  }
`);

const signOutMutation = graphql(/* GraphQL */ `
  mutation signOut {
    signOut
  }
`);

export function useSignUp() {
  const [addUserResult, doAddUser] = useMutation(addUserMutation);

  const credentialsFromAddUserResult = useCallback(
    function credentialsFromAddUserResult(
      result: Omit<typeof addUserResult, 'fetching'>,
    ) {
      const { password, user } = result.data?.addUser ?? {};
      return {
        ...addUserResult,
        password,
        username: user?.username,
      };
    },
    [addUserResult],
  );

  const addUser = useCallback(
    async function addUser(input: Parameters<typeof doAddUser>[0]['input']) {
      const result = await doAddUser(
        { input },
        { requestPolicy: 'network-only' },
      );
      return credentialsFromAddUserResult(result);
    },
    [credentialsFromAddUserResult, doAddUser],
  );

  return [addUser, addUserResult] as const;
}

export function useSignIn() {
  const dispatchAuthedUser = useContext(AuthedUserDispatchContext);
  const [signInResult, doSignIn] = useMutation(signInMutation);

  const authedUserFromSignInResult = useCallback(
    function authedUserFromSignInResult(
      result: Omit<typeof signInResult, 'fetching'>,
    ) {
      const u = result.data?.signIn?.user;
      const user = u && {
        id: u.id,
        name: u.name,
        username: u.username,
        createdAt: new Date(u.createdAt),
        updatedAt: new Date(u.updatedAt),
      };

      return {
        ...signInResult,
        user,
      };
    },
    [signInResult],
  );

  const signIn = useCallback(
    async function signIn(username: string, password: string) {
      const result = await doSignIn(
        { input: { username, password } },
        { requestPolicy: 'network-only' },
      );
      const { user } = authedUserFromSignInResult(result);
      dispatchAuthedUser?.(user ?? null);
    },
    [authedUserFromSignInResult, dispatchAuthedUser, doSignIn],
  );

  return [signIn, authedUserFromSignInResult(signInResult)] as const;
}

export function useSignOut() {
  const dispatchAuthedUser = useContext(AuthedUserDispatchContext);
  const [signOutResult, doSignOut] = useMutation(signOutMutation);

  const signOut = useCallback(
    async function signOut() {
      await doSignOut({}, { requestPolicy: 'network-only' });
      dispatchAuthedUser?.(null);
    },
    [dispatchAuthedUser, doSignOut],
  );

  return [signOut, signOutResult] as const;
}
