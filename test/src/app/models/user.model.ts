import { AuthModel } from './auth.model';

export class UserModel extends AuthModel {
  id: string | undefined;
  name: string | undefined;
  password: string | undefined;
  passwordNew?: string;
  passwordNewRepeat?: string;
  email: string | undefined;


  setUser(_user: unknown) {
    const user = _user as UserModel;
    this.id = user.id || '';
    this.name = user.name || '';
    this.password = user.password || '';
    this.email = user.email || '';
  }
}
