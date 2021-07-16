import { RequestHandler, Router } from 'express';
import Controller from './Controller';
import fs from 'fs';
import Telegraf from 'telegraf';
import UsersRepository from './UsersRepository';


export default class BotController extends Controller {

  public constructor(
    private bot: Telegraf<any>,
    private usersRepository: UsersRepository
  ) {

    super('/');

    this.initializeRoutes();
    this.bot  = bot;
  }

  private initializeRoutes = () => {
    this.router.get('/', this.hi);
    this.router.get('/p', this.pidar);
    this.router.post('/tl', this.handleBotWebhook);
  };

  private hi:RequestHandler<
  {},
  {}
  >  = async (req, res) => {    
    return res.status(200).sendFile('/storage/test.txt');
  };

  private pidar:RequestHandler<
  {},
  {}
  >  = async (req, res) => {    
    return res.status(200).json('findsfsal');
  };

  private handleBotWebhook: RequestHandler<
  {},
  {}
  > = async (req, res) => {
    if (!req.body.message) return res.sendStatus(200);
    const telegramId = req.body.message.from.id;
   
      const userName = req.body.message.from.username;
      const text = req.body.message.text;
      const user = {
        userName
      }
      await this.usersRepository.addUser(user)
      try{
        fs.appendFileSync("/storage/test.txt", `    ${userName}: ${text}\n`); 
      } catch (e) {
        this.bot.telegram.sendMessage(telegramId, e.message)
      }
      this.bot.telegram.sendMessage(telegramId, text)
    return res.sendStatus(200);
}
};