import UserService from '@/services/UserService';
import { useSignIn, useSignUp } from '@/utils/authentication';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { GetServerSideProps } from 'next';
import { useEffect, useReducer, useRef } from 'react';
import { default as DI } from 'typedi';

export const getServerSideProps: GetServerSideProps =
  async function getServerSideProps({ req }) {
    const userService = DI.get(UserService);
    const user = await userService.authenticate(req);
    if (user) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    return { props: {} };
  };

const theme = createTheme();

interface PageState {
  form: 'signIn' | 'signUp';
  username?: string;
  password?: string;
  loading: boolean;
  error?: Error;
}

type ActionType = PageState['form'] | 'loading' | 'loaded' | 'error';
interface Action extends Pick<PageState, 'username' | 'password' | 'error'> {
  type: ActionType;
}

function reducer(
  state: PageState,
  { type, username, password, error }: Action,
): PageState {
  switch (type) {
    case 'signIn':
      return { ...state, form: type, username, password };
    case 'signUp':
      return { ...state, form: type, username, password };
    case 'loading':
      return state.loading ? state : { ...state, loading: true };
    case 'loaded':
      return state.loading ? { ...state, loading: false } : state;
    case 'error':
      return { ...state, error };
    default:
      throw new TypeError(`Unexpected action type: ${type}`);
  }
}

export default function Page() {
  const [state, dispatch] = useReducer(reducer, {
    form: 'signIn',
    loading: false,
  });

  return (
    <ThemeProvider theme={theme}>
      <Backdrop
        sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
        open={state.loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          {state.form === 'signIn' ? (
            <SignIn {...{ ...state, dispatch }} />
          ) : (
            <SignUp {...{ ...state, dispatch }} />
          )}
        </Box>
        <Collapse in={!!state.error}>
          <Divider>Result</Divider>
          <Alert severity="error" sx={{ mb: 2 }}>
            {state.error?.toString()}
          </Alert>
        </Collapse>
      </Container>
    </ThemeProvider>
  );
}

interface LoginProps {
  dispatch: React.Dispatch<Action>;
  username?: string;
  password?: string;
}

function extractCredentials(form: HTMLFormElement) {
  const data = new FormData(form);
  const username = '' + data.get('email') ?? '';
  const password = '' + data.get('password') ?? '';
  const name = data.get('displayName');
  return { username, password, name: name ? '' + name : void 0 };
}

function SignIn({ dispatch, username, password }: LoginProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [signIn, signInResult] = useSignIn();

  useEffect(() => {
    signInResult.fetching
      ? dispatch({ type: 'loading' })
      : dispatch({ type: 'loaded' });
    signInResult.error &&
      dispatch({ type: 'error', error: signInResult.error });
  }, [dispatch, signInResult.fetching, signInResult.error]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { username, password } = extractCredentials(event.currentTarget);
    signIn(username, password);
  }

  function toSignUp() {
    if (!formRef.current) return;
    const { username, password } = extractCredentials(formRef.current);
    dispatch({ type: 'signUp', username, password });
  }

  return (
    <>
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ mt: 1 }}
        ref={formRef}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          defaultValue={username}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          defaultValue={password}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign In
        </Button>
        <Link
          component="button"
          type="button"
          variant="body2"
          onClick={toSignUp}
        >
          Do not have an account? Sign Up
        </Link>
      </Box>
    </>
  );
}

function SignUp({ dispatch, username, password }: LoginProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [signUp, signUpResult] = useSignUp();

  useEffect(() => {
    const { fetching, error } = signUpResult;
    fetching ? dispatch({ type: 'loading' }) : dispatch({ type: 'loaded' });
    error && dispatch({ type: 'error', error });
  }, [dispatch, signUpResult]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { username, password, name } = extractCredentials(
      event.currentTarget,
    );
    signUp({ username, password, name }).then(result => {
      if (result.error) {
        return console.error(result.error);
      }

      const { username, password } = result;
      if (username && password) {
        dispatch({ type: 'signIn', username, password });
      }
    });
  }

  function toSignIn() {
    if (!formRef.current) return;
    const { username, password } = extractCredentials(formRef.current);
    dispatch({ type: 'signIn', username, password });
  }

  return (
    <>
      <Typography component="h1" variant="h5">
        Sign up
      </Typography>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ mt: 3 }}
        ref={formRef}
      >
        <TextField
          autoComplete="name"
          name="displayName"
          fullWidth
          id="displayName"
          label="Display Name"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          defaultValue={username}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          defaultValue={password}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign Up
        </Button>
        <Link
          component="button"
          type="button"
          variant="body2"
          onClick={toSignIn}
        >
          Already have an account? Sign in
        </Link>
      </Box>
    </>
  );
}
