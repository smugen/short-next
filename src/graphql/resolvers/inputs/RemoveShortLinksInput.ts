import { Field, ID, InputType } from 'type-graphql';

@InputType()
export default class RemoveShortLinksInput {
  @Field(() => [ID], {
    description: 'Specify ID list of ShortLinks to be remove.',
  })
  shortLinkIdList!: string[];
}
