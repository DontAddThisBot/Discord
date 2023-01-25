import {
     REST,
     RESTPostAPIChatInputApplicationCommandsJSONBody,
     Routes
} from "discord.js";
import { token, client_id } from "../config.json";
import { LogLevel, Logger } from "./utility/Logger";

import fs from "node:fs";
import path from "path";

const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
     .readdirSync(commandsPath)
     .filter((file) => file.endsWith(".ts"))
     .filter((file) => {
          if (file.startsWith("__")) return false;
          return true;
     });

for (const file of commandFiles) {
     const filePath = path.join(commandsPath, file);
     const command = require(filePath);
     if (command.default) {
          const parsed = command.default.data.toJSON();
          commands.push(parsed);
     }
}

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
     try {
          Logger.log(
               LogLevel.DEBUG,
               `Started refreshing ${commands.length} applications commands`
          );

          const data = await rest.put(Routes.applicationCommands(client_id), {
               body: commands
          });

          //@ts-ignore
          Logger.log(LogLevel.INFO, `Successfully reloaded ${data} commands`);
     } catch (error) {
          console.error(error);
     }
})();
