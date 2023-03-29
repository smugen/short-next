/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n      mutation addUser_test($input: AddUserInput!) {\n        addUser(input: $input) {\n          password\n          user {\n            createdAt\n            deletedAt\n            id\n            name\n            updatedAt\n            username\n          }\n        }\n      }\n    ": types.AddUser_TestDocument,
    "\n      mutation signIn_test($input: SignInInput!) {\n        signIn(input: $input) {\n          cyToken\n          user {\n            id\n            username\n          }\n        }\n      }\n    ": types.SignIn_TestDocument,
    "\n      query me_test($token: String) {\n        me(token: $token) {\n          id\n          username\n        }\n      }\n    ": types.Me_TestDocument,
    "\n      mutation signOut_test {\n        signOut\n      }\n    ": types.SignOut_TestDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation addUser_test($input: AddUserInput!) {\n        addUser(input: $input) {\n          password\n          user {\n            createdAt\n            deletedAt\n            id\n            name\n            updatedAt\n            username\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation addUser_test($input: AddUserInput!) {\n        addUser(input: $input) {\n          password\n          user {\n            createdAt\n            deletedAt\n            id\n            name\n            updatedAt\n            username\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation signIn_test($input: SignInInput!) {\n        signIn(input: $input) {\n          cyToken\n          user {\n            id\n            username\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation signIn_test($input: SignInInput!) {\n        signIn(input: $input) {\n          cyToken\n          user {\n            id\n            username\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query me_test($token: String) {\n        me(token: $token) {\n          id\n          username\n        }\n      }\n    "): (typeof documents)["\n      query me_test($token: String) {\n        me(token: $token) {\n          id\n          username\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation signOut_test {\n        signOut\n      }\n    "): (typeof documents)["\n      mutation signOut_test {\n        signOut\n      }\n    "];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;