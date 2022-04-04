import { IHttpRequest, IHttpResponse } from '../../protocols/http';
import { MissingParamError } from '../../errors/MissingParamError';
import { badRequest } from '../../helpers/http-helper';

export class SignUpController {
  handle(httpRequest: IHttpRequest): IHttpResponse {
    if (!httpRequest.body.name) {
      return badRequest(new MissingParamError('name'));
    }

    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError('email'));
    }

    return {
      statusCode: 200,
      body: {},
    };
  }
}
