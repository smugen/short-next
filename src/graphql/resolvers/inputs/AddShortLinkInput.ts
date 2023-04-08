import { Field, InputType } from 'type-graphql';

@InputType()
export default class AddShortLinkInput {
  @Field({
    description: 'Specify full link for the ShortLink.',
  })
  fullLink!: string;
}
