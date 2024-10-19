import { Request } from '@adonisjs/core/http';

import User from '#models/user';

declare module '@adonisjs/core/http' {
  export interface Request {
    user: User;
  }
}

// eslint-disable-next-line no-unused-vars
Request.getter('user', function (this: Request) {
  return this.user;
});

declare module '@japa/runner/core' {
  interface TestContext {
    sleep(milliseconds: number): Promise<void>;
  }
}
