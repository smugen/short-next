import { ShortLink } from '@/models';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export default class AddShortLinkOutput {
  @Field({
    description: 'The ShortLink.',
  })
  shortLink!: ShortLink;
}
