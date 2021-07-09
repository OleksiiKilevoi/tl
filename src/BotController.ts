import { RequestHandler, Router } from 'express';
import Controller from './Controller';
import fs from 'fs';
import Telegraf from 'telegraf';


export default class BotController extends Controller {

  public constructor(
    private bot: Telegraf<any>,
  ) {

    super('/');

    this.initializeRoutes();
    this.bot  = bot;
  }

  private initializeRoutes = () => {
    this.router.get('/', this.hi);
    this.router.post('/tl', this.handleBotWebhook);
  };

  private hi:RequestHandler<
  {},
  {}
  >  = async (req, res) => {
    console.log(req)
    return res.status(200).json('Hi from container');
  };

  private handleBotWebhook: RequestHandler<
  {},
  {}
  > = async (req, res) => {
    if (!req.body.message) return res.sendStatus(200);
    const telegramId = req.body.message.from.id;
   
      const userName = req.body.message.from.username;
      const text = req.body.message.text;
      fs.appendFileSync("/storage/test.txt", `    ${userName}: ${text}\n`); 
    this.bot.telegram.sendMessage(telegramId, text)
    return res.sendStatus(200);
}
};