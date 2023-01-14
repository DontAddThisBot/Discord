// import dotenv from "dotenv";
// dotenv.config();
// let env = process.env.env;
import {
     ButtonInteraction,
     Collection,
     CommandInteraction,
     SelectMenuInteraction,
     SlashCommandBuilder
} from "discord.js";
import path from "path";
import fs from "fs";
import { type } from "../config.json";

const importInteractions = (client: any) => {
     client.commands = new Collection();
     importCommands(client.commands);

     client.buttons = new Collection();
     importButtonInteractions(client.buttons);

     // client.selectMenu = new Collection();
     // importSelectMenu(client.selectMenu);
};
const isProd = type === "prod" ? ".js" : ".ts";

const importCommands = (
     clientCommands: Collection<string, CommandInteraction>
) => {
     const commandsPath = path.join(__dirname, "commands");
     const commandFiles = fs
          .readdirSync(commandsPath)
          .filter((file) => file.endsWith(isProd));

     for (const file of commandFiles) {
          const filePath = path.join(commandsPath, file);
          let pull = require(filePath);
          if (pull.default) {
               const commandData = pull.default.data as SlashCommandBuilder;

               // if (type === "development" || type === "dev") {
               //      commandData.setName(`dev${commandData.name}`);
               // }

               clientCommands.set(commandData.name, pull.default);
          }
     }
};

const importButtonInteractions = (
     clientButtons: Collection<string, ButtonInteraction>
) => {
     const buttonInteractionsPath = path.join(__dirname, "buttons");
     const buttonInteractionsFiles = fs
          .readdirSync(buttonInteractionsPath)
          .filter((file) => file.endsWith(isProd));

     for (const file of buttonInteractionsFiles) {
          const filePath = path.join(buttonInteractionsPath, file);
          let pull = require(filePath);
          if (pull) {
               clientButtons.set(pull.default.data.name, pull.default);
          }
     }
};

const importSelectMenu = (
     clientCommands: Collection<string, SelectMenuInteraction>
) => {
     const selectMenuPath = path.join(__dirname, "selectMenu");
     const selectMenuFiles = fs
          .readdirSync(selectMenuPath)
          .filter((file) => file.endsWith(".ts"));

     for (const file of selectMenuFiles) {
          const filePath = path.join(selectMenuPath, file);
          let pull = require(filePath);
          if (pull.default) {
               clientCommands.set(pull.default.data.name, pull.default);
          }
     }
};

export default importInteractions;
