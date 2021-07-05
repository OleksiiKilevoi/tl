import 'dotenv/config';
import 'express-async-errors';
import Telegraf from 'telegraf';

import BotController from './BotController';


import App from './App';

const main = async () => {

const bot = new Telegraf('1470529336:AAE-rGVOG-xbuuOo-48jY_exyq5IILKUNt8');
  bot.telegram.setWebhook('https://d3ce0ef363cd.ngrok.io/tl');
 
  const botController = new BotController();

  const controllers = [  botController ]
  const port = 5000;
  const app = new App(controllers, port);
  app.listen();

  return app;
};

main();

export default main;
