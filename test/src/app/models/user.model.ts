import { AuthModel } from './auth.model';

export class UserModel extends AuthModel {
  id: string | undefined;
  name: string | undefined;
  email: string | undefined;
  email_verified_at?: string;
  created_at?: string;
  updated_at: string | undefined;


  setUser(_user: unknown) {
    const user = _user as UserModel;
    this.id = user.id || '';
    this.name = user.name || '';
    this.email_verified_at = user.email_verified_at || '';
    this.email = user.email || '';
  }
}
