import { SignUpController } from './signup-controller';

describe('SignUp Controller', () => {
  it('Should return 400 if no name is provided', () => {
    const sut = new SignUpController();

    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_name',
        passwordConfimation: 'any_name',
      },
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
  });
});
