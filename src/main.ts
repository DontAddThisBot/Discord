import {
     ButtonInteraction,
     Client,
     Collection,
     CommandInteraction,
     GatewayIntentBits,
     REST,
     Routes
} from "discord.js";
import { token, client_id } from "../config.json";
import importInteractions from "./import-interactions";

import { login } from "./events/Login";
import { messages } from "./events/Message";
import { Connect } from "./database/postgres";

import { LogLevel, Logger } from "./utility/Logger";
import { ConfigSchema } from "./validators/ConfigSchema";
import TaskManager from "./manager/TaskManager";

const result = ConfigSchema.validate(require("../config.json"));

interface CustomButtonInteraction extends ButtonInteraction {
     execute: (
          interaction: CommandInteraction | ButtonInteraction,
          client: CustomClient
     ) => Promise<void>;
}

export interface CustomClient extends Client {
     commands: Collection<string, CommandInteraction>;
     tasks: TaskManager;
     buttons: Collection<string, CustomButtonInteraction>;
}

const buildClient = (): CustomClient => {
     const client = new Client({
          intents: [
               GatewayIntentBits.Guilds,
               GatewayIntentBits.GuildVoiceStates,
               GatewayIntentBits.GuildMessages,
               GatewayIntentBits.MessageContent
          ]
     }) as CustomClient;

     client.tasks = new TaskManager();
     client.buttons = new Collection();
     client.commands = new Collection();

     return client;
};

if (result.error) {
     Logger.log(
          LogLevel.ERROR,
          `Config validation error: ${result.error.message}`
     );
     process.exit(1);
}

export const client = buildClient();

(async () => {
     login(token);
     messages();
     Connect();
     importInteractions(client);
})();
