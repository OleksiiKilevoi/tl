import { Collection, MongoClient, ObjectId } from 'mongodb';



class UsersRepository {
  private users: Collection;

  public constructor(mongoClient: MongoClient) {
    this.users = mongoClient.db().collection('test-users');
  }

  public getAll = () => this.users.find({ deleted: false }).toArray()

  public addUser = (user: object) => this.users.insertOne(user);

}

export default UsersRepository;
