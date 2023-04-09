import { ShortLink } from '@/models';
import { createContext, useCallback } from 'react';
import { useMutation, useQuery } from 'urql';

import { graphql } from '../../gql_generated';

export type ShortLinkItem = Pick<
  ShortLink,
  'id' | 'slug' | 'fullLink' | 'viewCount' | 'createdAt'
>;

export const ShortLinkListContext = createContext<ShortLinkItem[]>([]);

ShortLinkListContext.displayName = 'ShortLinkListContext';

const myShortLinks = graphql(/* GraphQL */ `
  query myShortLinks {
    me {
      shortLinks {
        id
        slug
        fullLink
        viewCount
        createdAt
      }
    }
  }
`);

export function useMyShortLinks() {
  const [result, doQuery] = useQuery({ query: myShortLinks });
  return [
    {
      ...result,
      shortLinks: result.data?.me?.shortLinks.map(s => ({
        ...s,
        createdAt: new Date(s.createdAt),
      })),
    },
    doQuery,
  ] as const;
}

const addShortLinkMutation = graphql(/* GraphQL */ `
  mutation addShortLink($input: AddShortLinkInput!) {
    addShortLink(input: $input) {
      shortLink {
        id
        slug
        fullLink
        viewCount
        createdAt
      }
    }
  }
`);

export function useAddShortLink() {
  const [addShortLinkResult, doAddShortLink] =
    useMutation(addShortLinkMutation);

  const shortLinkFromAddShortLinkResult = useCallback(
    function shortLinkFromAddShortLinkResult(
      result: Omit<typeof addShortLinkResult, 'fetching'>,
    ) {
      const { shortLink } = result.data?.addShortLink ?? {};
      return {
        ...addShortLinkResult,
        shortLink: shortLink && {
          ...shortLink,
          createdAt: new Date(shortLink.createdAt),
        },
      };
    },
    [addShortLinkResult],
  );

  const addShortLink = useCallback(
    async function addShortLink(
      input: Parameters<typeof doAddShortLink>[0]['input'],
    ) {
      const result = await doAddShortLink(
        { input },
        { requestPolicy: 'network-only' },
      );
      return shortLinkFromAddShortLinkResult(result);
    },
    [shortLinkFromAddShortLinkResult, doAddShortLink],
  );

  return [
    addShortLink,
    shortLinkFromAddShortLinkResult(addShortLinkResult),
  ] as const;
}
