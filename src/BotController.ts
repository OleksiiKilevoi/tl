import { RequestHandler, Router } from 'express';
import Controller from './Controller';
import fs from 'fs';


export default class BotController extends Controller {

  public constructor(
  ) {

    super('/');

    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.post('/tl', this.handleBotWebhook);
  };

  private handleBotWebhook: RequestHandler<
  {},
  {}
  > = async (req, res) => {
    if (!req.body.message) return res.sendStatus(200);
    const telegramId = req.body.message.from.id;
   
      const userName = req.body.message.from.username;
      const text = req.body.message.text;
      
      fs.appendFileSync("    storage/test", `${userName}: ${text}\n`); 

    return res.sendStatus(200);
}
};