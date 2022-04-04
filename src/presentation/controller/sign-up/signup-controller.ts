import { IHttpRequest, IHttpResponse } from '../../protocols/http';
import { MissingParamError } from '../../errors/missing-param-error';
import { badRequest } from '../../helpers/http-helper';
import { IController } from '../../protocols/controller';
import { IEmailValidator } from '../../protocols/email-validator';
import { InvalidParamError } from '../../errors/invalid-param-error';

export class SignUpController implements IController {
  constructor(private readonly emailValidator: IEmailValidator) {}

  handle(httpRequest: IHttpRequest): IHttpResponse {
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
  }
}
