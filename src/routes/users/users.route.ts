import { Router } from 'express';
import UsersController from '../../controllers/users.controller';
import Route from '../../types/routes.interface';

class UsersRoute implements Route {
  public path = '/users';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.usersController.getUsers);
  }
}

export default UsersRoute;