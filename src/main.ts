import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import { token, client_id } from "../config.json";
import importInteractions from "./import-interactions";

import { login } from "./events/Login";
import { messages } from "./events/Message";
import { Connect } from "./database/postgres";

import { LogLevel, Logger } from "./utility/Logger";
import { ConfigSchema } from "./validators/ConfigSchema";
import TaskManager from "./manager/TaskManager";

const result = ConfigSchema.validate(require("../config.json"));
if (result.error) {
     Logger.log(
          LogLevel.ERROR,
          `Config validation error: ${result.error.message}`
     );
     process.exit(1);
}

export const client = new Client({
     intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildVoiceStates,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.MessageContent
     ]
}) as any;

(async () => {
     login(token);
     messages();
     Connect();
     importInteractions(client);
     client.tasks = new TaskManager();
})();
