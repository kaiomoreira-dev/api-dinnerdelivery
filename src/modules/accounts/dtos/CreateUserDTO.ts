export interface ICreateUserDTO {
  id?: string;
  name: string;
  email: string;
  password: string;
  address: string;
  admin?: boolean;
}
