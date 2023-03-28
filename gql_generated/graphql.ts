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

export type Node = {
  id: Scalars['ID'];
};

export type Query = {
  __typename?: 'Query';
  hello: Scalars['String'];
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

export type HelloQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type HelloQueryQuery = { __typename?: 'Query', hello: string };


export const HelloQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"helloQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hello"}}]}}]} as unknown as DocumentNode<HelloQueryQuery, HelloQueryQueryVariables>;