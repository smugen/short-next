import type { ShortLink, ShortLinkMeta } from '@/models';
import ShortLinkService from '@/services/ShortLinkService';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import Script from 'next/script';
import { useId } from 'react';
import Container from 'typedi';

/** seconds */
const WAIT = 0;

interface Props {
  shortLink: Pick<ShortLink, 'slug' | 'fullLink'> & {
    metaList?: Array<
      Pick<
        ShortLinkMeta,
        'id' | 'tagName' | 'rawText' | 'property' | 'name' | 'content'
      >
    >;
  };
}

export const getServerSideProps: GetServerSideProps<Props> =
  async function getServerSideProps({ query }) {
    const shortLinkService = Container.get(ShortLinkService);
    const { shortLinkSlug } = query;

    let shortLink: ShortLink | null = null;
    if (
      typeof shortLinkSlug !== 'string' ||
      !(shortLink = await shortLinkService.getShortLinkBySlug(shortLinkSlug))
    ) {
      return { notFound: true };
    }

    shortLinkService.recordViewOfShortLink(shortLink);

    const { slug, fullLink } = shortLink;
    const metaList = shortLink.metaList?.map(meta => meta.toJSON());

    return {
      props: {
        shortLink: { slug, fullLink, metaList },
      },
    };
  };

export default function ShortLinkPage({
  shortLink: { fullLink, metaList },
}: Props) {
  const scriptId = useId();

  return (
    <>
      <Head>
        <link rel="canonical" href={fullLink} />

        {metaList?.map(({ id, tagName, rawText, property, name, content }) => {
          if (tagName === 'TITLE' && rawText) {
            return <title key={id}>{rawText}</title>;
          }

          if (tagName === 'META' && content) {
            if (property) {
              return <meta key={id} property={property} content={content} />;
            }

            if (name) {
              return <meta key={id} name={name} content={content} />;
            }
          }
        })}

        <noscript>
          <meta httpEquiv="refresh" content={`${WAIT}; url=${fullLink}`} />
        </noscript>
      </Head>
      <Script id={scriptId}>{`
        console.log('Redirecting to ${fullLink} in ${WAIT} seconds.');
        setTimeout(() => window.location.replace('${fullLink}'), ${WAIT} * 1000);
      `}</Script>
    </>
  );
}
