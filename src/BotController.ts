import { RequestHandler, Router } from "express";
import Controller from "./Controller";
import fs from "fs";
import Telegraf from "telegraf";
import UsersRepository from "./UsersRepository";
import fileUpload from 'express-fileupload';
import { v4 as uuidv4 } from 'uuid';

export default class BotController extends Controller {
  public constructor(
    private bot: Telegraf<any>,
    private usersRepository: UsersRepository
  ) {
    super("/");

    this.initializeRoutes();
    this.bot = bot;
  }

  private initializeRoutes = () => {
    this.router.get("/", this.hi);
    this.router.get("/database", this.database);
    this.router.get("/hi", this.pidar);
    this.router.post("/tl", this.handleBotWebhook);
    this.router.post('/image', this.uploadImage);
  };

  

  private uploadImage: RequestHandler<
  { id: number },
  {},
  {}
  > = async (req, res) => {
    try {
      const { params } = req;
      const files = req.files!.images as fileUpload.UploadedFile[];


      if (!fs.existsSync('/storage/uploads')) fs.mkdirSync('/storage/uploads');
      if (!fs.existsSync('/storage/uploads/offers')) fs.mkdirSync('/storage/uploads/offers');

      const paths: string[] = [];
      files.forEach((file) => {
        const fileName = `${uuidv4()}.${file.name.split('.').pop()}`;
        const destination = `/storage/uploads/offers/${fileName}`;
        file.mv(destination);
        paths.push(fileName);
      });
await this.usersRepository.addUser({ paths })
      return res.status(200).json('file uploaded');
    } catch (e) {
      return res.status(401).json(e.message);
    }
  };

  private database: RequestHandler = async (req, res) => {
    const users = await this.usersRepository.getAll();
    return res.status(200).json(users);
  };

  private hi: RequestHandler<{}, {}> = async (req, res) => {
    return res.status(200).sendFile("/storage/test.txt");
  };

  private pidar: RequestHandler<{}, {}> = async (req, res) => {
    return res.status(200).json("hello from webdock");
  };

  private handleBotWebhook: RequestHandler<{}, {}> = async (req, res) => {
    if (!req.body.message) return res.sendStatus(200);
    const telegramId = req.body.message.from.id;

    const userName = req.body.message.from.username;
    const text = req.body.message.text;
    const user = {
      userName,
    };
    await this.usersRepository.addUser(user);
    try {
      fs.appendFileSync("/storage/test.txt", `    ${userName}: ${text}\n`);
    } catch (e) {
      this.bot.telegram.sendMessage(telegramId, e.message);
    }
    this.bot.telegram.sendMessage(telegramId, text);
    return res.sendStatus(200);
  };
}
