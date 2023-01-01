import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import { token, client_id } from "../config.json";
import { loadCommands } from "./events/modules/Commands";

import { login } from "./events/Login";
import { messages } from "./events/Message";
import { Connect } from "./database/postgres";

import { LogLevel, Logger } from "./utility/Logger";
import { ConfigSchema } from "./validators/ConfigSchema";

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
});

(async () => {
     login(token);
     messages();
     Connect();
     const commandsMapped = loadCommands();
     const commands = [...commandsMapped.commands.values()];

     const rest = new REST({ version: "10" }).setToken(token);
     try {
          Logger.log(
               LogLevel.DEBUG,
               "Started refreshing application (/) commands."
          );

          await rest.put(Routes.applicationCommands(client_id), {
               body: commands
          });

          Logger.log(
               LogLevel.INFO,
               "Successfully reloaded application (/) commands."
          );
     } catch (error) {
          Logger.log(
               LogLevel.ERROR,
               `Error while reloading application (/) commands: ${error}`
          );
     }
})();
