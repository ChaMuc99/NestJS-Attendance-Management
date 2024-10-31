import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = [];

  getAllUsers() {
    return this.users;
  }

  getUserById(id: string) {
    return this.users.find(user => user.id === id);
  }

  createUser(user: any) {
    this.users.push(user);
    return user;
  }

  updateUser(id: string, updatedUser: any) {
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      this.users[index] = updatedUser;
      return updatedUser;
    }
  }

  deleteUser(id: string) {
    this.users = this.users.filter(user => user.id !== id);
    return { deleted: true };
  }
}
