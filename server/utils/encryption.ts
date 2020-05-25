import bcrypt from 'bcrypt';


export const encrypt = (data: string) =>
  bcrypt.hash(data, 10);

export const compare = (data: string, hash: string) =>
  bcrypt.compare(data, hash);
