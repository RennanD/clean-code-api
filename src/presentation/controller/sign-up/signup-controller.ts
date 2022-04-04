import { IHttpRequest, IHttpResponse } from '../../protocols/http';
import { MissingParamError } from '../../errors/MissingParamError';
import { badRequest } from '../../helpers/http-helper';

export class SignUpController {
  handle(httpRequest: IHttpRequest): IHttpResponse {
    const requiredFields = ['name', 'email'];

    for (const field of requiredFields) {
      if (httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }

    return {
      statusCode: 200,
      body: {},
    };
  }
}
