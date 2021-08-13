import 'dotenv/config';
import 'express-async-errors';
import Telegraf from 'telegraf';
import { MongoClient } from 'mongodb';

import BotController from './BotController';
const mongoUrl = 'mongodb+srv://lunaxodd:alexei1997@cluster0.uyr6t.gcp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

import App from './App';
import UsersRepository from './UsersRepository';

const main = async () => {
  const connect = async () => MongoClient.connect(mongoUrl);

  const client = await connect();
  const usersRepository = new UsersRepository(client);
  
const bot = new Telegraf('1470529336:AAE-rGVOG-xbuuOo-48jY_exyq5IILKUNt8');
  bot.telegram.setWebhook('https://lambda-team.club/tl');
  const botController = new BotController(bot, usersRepository);
  
  const controllers = [  botController ]
  const port = 5000;
  const app = new App(controllers, port);
  app.listen();

  return app;
};

main();

export default main;
