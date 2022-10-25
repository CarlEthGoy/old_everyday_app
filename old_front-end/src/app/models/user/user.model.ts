export class User {
  id: number;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;

  constructor(data){
    this.id = data.id;
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
  }

}