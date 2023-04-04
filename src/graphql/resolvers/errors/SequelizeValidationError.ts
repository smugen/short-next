import { GraphQLError } from 'graphql';
import { ValidationError } from 'sequelize';

export default class SequelizeValidationError extends GraphQLError {
  constructor(error: ValidationError) {
    super(error.errors[0]?.message || error.message);
  }
}
