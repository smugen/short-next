/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
  /** A field whose value conforms to the standard internet email address format as specified in HTML Spec: https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address. */
  EmailAddress: any;
  /** Represents NULL values */
  Void: any;
};

export type AddUserInput = {
  /** Specify name for the User. */
  name?: InputMaybe<Scalars['String']>;
  /** Password for the User. */
  password: Scalars['String'];
  /** Email address as username for the User. */
  username: Scalars['EmailAddress'];
};

export type AddUserOutput = {
  __typename?: 'AddUserOutput';
  /** The password of the User. */
  password: Scalars['String'];
  /** The User object. */
  user: User;
};

export type DaoNode = {
  /** The DAO created at. */
  createdAt?: Maybe<Scalars['DateTime']>;
  /** The DAO deleted at. */
  deletedAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  /** The DAO updated at. */
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Add a new User. */
  addUser: AddUserOutput;
  /** User sign-in. */
  signIn: SignInOutput;
  /** User sign-out. */
  signOut?: Maybe<Scalars['Void']>;
};


export type MutationAddUserArgs = {
  input: AddUserInput;
};


export type MutationSignInArgs = {
  input: SignInInput;
};

export type Node = {
  id: Scalars['ID'];
};

export type Query = {
  __typename?: 'Query';
  /** Who am I? */
  me?: Maybe<User>;
};


export type QueryMeArgs = {
  token?: InputMaybe<Scalars['String']>;
};

export type SignInInput = {
  /** Password for the User. */
  password: Scalars['String'];
  /** Email address as username for the User. */
  username: Scalars['EmailAddress'];
};

export type SignInOutput = {
  __typename?: 'SignInOutput';
  /** The token of this session. */
  cyToken: Scalars['String'];
  /** The User object. */
  user: User;
};

export type User = DaoNode & Node & {
  __typename?: 'User';
  /** The DAO created at. */
  createdAt?: Maybe<Scalars['DateTime']>;
  /** The DAO deleted at. */
  deletedAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  /** The User name for display */
  name: Scalars['String'];
  /** The DAO updated at. */
  updatedAt?: Maybe<Scalars['DateTime']>;
  /** The User username */
  username: Scalars['String'];
};

export type AddUser_TestMutationVariables = Exact<{
  input: AddUserInput;
}>;


export type AddUser_TestMutation = { __typename?: 'Mutation', addUser: { __typename?: 'AddUserOutput', password: string, user: { __typename?: 'User', createdAt?: any | null, deletedAt?: any | null, id: string, name: string, updatedAt?: any | null, username: string } } };

export type SignIn_TestMutationVariables = Exact<{
  input: SignInInput;
}>;


export type SignIn_TestMutation = { __typename?: 'Mutation', signIn: { __typename?: 'SignInOutput', cyToken: string, user: { __typename?: 'User', id: string, username: string } } };

export type Me_TestQueryVariables = Exact<{
  token?: InputMaybe<Scalars['String']>;
}>;


export type Me_TestQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, username: string } | null };

export type SignOut_TestMutationVariables = Exact<{ [key: string]: never; }>;


export type SignOut_TestMutation = { __typename?: 'Mutation', signOut?: any | null };


export const AddUser_TestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addUser_test"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"password"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]} as unknown as DocumentNode<AddUser_TestMutation, AddUser_TestMutationVariables>;
export const SignIn_TestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"signIn_test"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SignInInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cyToken"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]} as unknown as DocumentNode<SignIn_TestMutation, SignIn_TestMutationVariables>;
export const Me_TestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"me_test"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]} as unknown as DocumentNode<Me_TestQuery, Me_TestQueryVariables>;
export const SignOut_TestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"signOut_test"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signOut"}}]}}]} as unknown as DocumentNode<SignOut_TestMutation, SignOut_TestMutationVariables>;