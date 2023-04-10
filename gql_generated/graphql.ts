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

export type AddShortLinkInput = {
  /** Specify full link for the ShortLink. */
  fullLink: Scalars['String'];
};

export type AddShortLinkOutput = {
  __typename?: 'AddShortLinkOutput';
  /** The ShortLink. */
  shortLink: ShortLink;
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
  /** Add a new ShortLink. */
  addShortLink?: Maybe<AddShortLinkOutput>;
  /** Add a new User. */
  addUser: AddUserOutput;
  /** Remove ShortLinks. */
  removeShortLinks?: Maybe<RemoveShortLinksOutput>;
  /** User sign-in. */
  signIn: SignInOutput;
  /** User sign-out. */
  signOut?: Maybe<Scalars['Void']>;
};


export type MutationAddShortLinkArgs = {
  input: AddShortLinkInput;
};


export type MutationAddUserArgs = {
  input: AddUserInput;
};


export type MutationRemoveShortLinksArgs = {
  input: RemoveShortLinksInput;
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

export type RemoveShortLinksInput = {
  /** Specify ID list of ShortLinks to be remove. */
  shortLinkIdList: Array<Scalars['ID']>;
};

export type RemoveShortLinksOutput = {
  __typename?: 'RemoveShortLinksOutput';
  /** The number of objects that been removed. */
  removedCount: Scalars['Int'];
};

export type ShortLink = DaoNode & Node & {
  __typename?: 'ShortLink';
  /** The DAO created at. */
  createdAt?: Maybe<Scalars['DateTime']>;
  /** The DAO deleted at. */
  deletedAt?: Maybe<Scalars['DateTime']>;
  /** The ShortLink full link */
  fullLink: Scalars['String'];
  id: Scalars['ID'];
  /** The ShortLink meta list */
  metaList: Array<ShortLinkMeta>;
  /** The ShortLink slug */
  slug: Scalars['String'];
  /** The DAO updated at. */
  updatedAt?: Maybe<Scalars['DateTime']>;
  /** The ShortLink user */
  user: User;
  /** The ShortLink user id */
  userId: Scalars['ID'];
  /** The ShortLink view count */
  viewCount: Scalars['Float'];
};

export type ShortLinkMeta = DaoNode & Node & {
  __typename?: 'ShortLinkMeta';
  /** The ShortLinkMeta content */
  content?: Maybe<Scalars['String']>;
  /** The DAO created at. */
  createdAt?: Maybe<Scalars['DateTime']>;
  /** The DAO deleted at. */
  deletedAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  /** The ShortLinkMeta name */
  name?: Maybe<Scalars['String']>;
  /** The ShortLinkMeta property */
  property?: Maybe<Scalars['String']>;
  /** The ShortLinkMeta raw text */
  rawText?: Maybe<Scalars['String']>;
  /** The ShortLinkMeta shortLink */
  shortLink: ShortLink;
  /** The ShortLinkMeta shortLink id */
  shortLinkId: Scalars['ID'];
  /** The ShortLinkMeta tag name */
  tagName: Scalars['String'];
  /** The DAO updated at. */
  updatedAt?: Maybe<Scalars['DateTime']>;
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
  /** The User shortLinks */
  shortLinks: Array<ShortLink>;
  /** The DAO updated at. */
  updatedAt?: Maybe<Scalars['DateTime']>;
  /** The User username */
  username: Scalars['String'];
};

export type AddShortLink_TestMutationVariables = Exact<{
  input: AddShortLinkInput;
}>;


export type AddShortLink_TestMutation = { __typename?: 'Mutation', addShortLink?: { __typename?: 'AddShortLinkOutput', shortLink: { __typename?: 'ShortLink', id: string, slug: string, fullLink: string, user: { __typename?: 'User', username: string } } } | null };

export type MyShortLinks_TestQueryVariables = Exact<{ [key: string]: never; }>;


export type MyShortLinks_TestQuery = { __typename?: 'Query', me?: { __typename?: 'User', shortLinks: Array<{ __typename?: 'ShortLink', id: string, viewCount: number, metaList: Array<{ __typename?: 'ShortLinkMeta', id: string, shortLink: { __typename?: 'ShortLink', id: string } }> }> } | null };

export type RemoveShortLinks_TestMutationVariables = Exact<{
  input: RemoveShortLinksInput;
}>;


export type RemoveShortLinks_TestMutation = { __typename?: 'Mutation', removeShortLinks?: { __typename?: 'RemoveShortLinksOutput', removedCount: number } | null };

export type Me_TestQueryVariables = Exact<{ [key: string]: never; }>;


export type Me_TestQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, username: string } | null };

export type SignOut_TestMutationVariables = Exact<{ [key: string]: never; }>;


export type SignOut_TestMutation = { __typename?: 'Mutation', signOut?: any | null };

export type AddUser_TestMutationVariables = Exact<{
  input: AddUserInput;
}>;


export type AddUser_TestMutation = { __typename?: 'Mutation', addUser: { __typename?: 'AddUserOutput', password: string, user: { __typename?: 'User', createdAt?: any | null, deletedAt?: any | null, id: string, name: string, updatedAt?: any | null, username: string } } };

export type SignIn_TestMutationVariables = Exact<{
  input: SignInInput;
}>;


export type SignIn_TestMutation = { __typename?: 'Mutation', signIn: { __typename?: 'SignInOutput', cyToken: string, user: { __typename?: 'User', id: string, username: string } } };

export type AddUserMutationVariables = Exact<{
  input: AddUserInput;
}>;


export type AddUserMutation = { __typename?: 'Mutation', addUser: { __typename?: 'AddUserOutput', password: string, user: { __typename?: 'User', username: string } } };

export type SignInMutationVariables = Exact<{
  input: SignInInput;
}>;


export type SignInMutation = { __typename?: 'Mutation', signIn: { __typename?: 'SignInOutput', user: { __typename?: 'User', id: string, name: string, username: string, createdAt?: any | null, updatedAt?: any | null } } };

export type SignOutMutationVariables = Exact<{ [key: string]: never; }>;


export type SignOutMutation = { __typename?: 'Mutation', signOut?: any | null };

export type MyShortLinksQueryVariables = Exact<{ [key: string]: never; }>;


export type MyShortLinksQuery = { __typename?: 'Query', me?: { __typename?: 'User', shortLinks: Array<{ __typename?: 'ShortLink', id: string, slug: string, fullLink: string, viewCount: number, createdAt?: any | null }> } | null };

export type AddShortLinkMutationVariables = Exact<{
  input: AddShortLinkInput;
}>;


export type AddShortLinkMutation = { __typename?: 'Mutation', addShortLink?: { __typename?: 'AddShortLinkOutput', shortLink: { __typename?: 'ShortLink', id: string, slug: string, fullLink: string, viewCount: number, createdAt?: any | null } } | null };


export const AddShortLink_TestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addShortLink_test"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddShortLinkInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addShortLink"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shortLink"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"fullLink"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AddShortLink_TestMutation, AddShortLink_TestMutationVariables>;
export const MyShortLinks_TestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"myShortLinks_test"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shortLinks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"viewCount"}},{"kind":"Field","name":{"kind":"Name","value":"metaList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"shortLink"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<MyShortLinks_TestQuery, MyShortLinks_TestQueryVariables>;
export const RemoveShortLinks_TestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"removeShortLinks_test"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RemoveShortLinksInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeShortLinks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removedCount"}}]}}]}}]} as unknown as DocumentNode<RemoveShortLinks_TestMutation, RemoveShortLinks_TestMutationVariables>;
export const Me_TestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"me_test"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]} as unknown as DocumentNode<Me_TestQuery, Me_TestQueryVariables>;
export const SignOut_TestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"signOut_test"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signOut"}}]}}]} as unknown as DocumentNode<SignOut_TestMutation, SignOut_TestMutationVariables>;
export const AddUser_TestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addUser_test"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"password"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]} as unknown as DocumentNode<AddUser_TestMutation, AddUser_TestMutationVariables>;
export const SignIn_TestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"signIn_test"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SignInInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cyToken"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]} as unknown as DocumentNode<SignIn_TestMutation, SignIn_TestMutationVariables>;
export const AddUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"password"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]} as unknown as DocumentNode<AddUserMutation, AddUserMutationVariables>;
export const SignInDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"signIn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SignInInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<SignInMutation, SignInMutationVariables>;
export const SignOutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"signOut"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signOut"}}]}}]} as unknown as DocumentNode<SignOutMutation, SignOutMutationVariables>;
export const MyShortLinksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"myShortLinks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shortLinks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"fullLink"}},{"kind":"Field","name":{"kind":"Name","value":"viewCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<MyShortLinksQuery, MyShortLinksQueryVariables>;
export const AddShortLinkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addShortLink"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddShortLinkInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addShortLink"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shortLink"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"fullLink"}},{"kind":"Field","name":{"kind":"Name","value":"viewCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<AddShortLinkMutation, AddShortLinkMutationVariables>;