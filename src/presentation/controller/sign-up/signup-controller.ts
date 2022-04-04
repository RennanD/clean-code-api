import { badRequest, serverError } from '../../helpers/http-helper';

import { IController } from '../../protocols/controller';
import { IHttpRequest, IHttpResponse } from '../../protocols/http';
import { IEmailValidator } from '../../protocols/email-validator';

import { MissingParamError, InvalidParamError } from '../../errors';

export class SignUpController implements IController {
  constructor(private readonly emailValidator: IEmailValidator) {}

  handle(httpRequest: IHttpRequest): IHttpResponse {
    try {
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation',
      ];

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const emailIsValid = this.emailValidator.isValid(httpRequest.body.email);

      if (!emailIsValid) {
        return badRequest(new InvalidParamError('email'));
      }

      return {
        statusCode: 200,
        body: {},
      };
    } catch (error) {
      return serverError();
    }
  }
}
