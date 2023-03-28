import { Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';

@Resolver()
@Service()
export default class SampleResolver {
  @Query(() => String)
  async hello() {
    return 'Hello World!';
  }
}
