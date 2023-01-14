import { client } from "../main";
import { handler } from "./modules/Handler";
import { Logger, LogLevel } from "../utility/Logger";
import { client_id } from "../../config.json";
import { Events } from "discord.js";

export const messages = () => {
     client.on(Events.InteractionCreate, async (msg: any) => {
          const permissions = msg.guild.members.me.permissions;
          const permissionNames = permissions.toArray();

          const AuthLink = `https://discord.com/oauth2/authorize?client_id=${client_id}&scope=applications.commands%20bot&permissions=8`;
          const discordEmbed = {
               title: "I don't have the required permissions!",
               description: `Please give me the following permissions: \`Administrator\` or [Click Here](${AuthLink}) to add me to your server with the required permissions.`,
               ephemeral: true
          };

          if (!permissionNames.includes("Administrator")) {
               msg.reply({
                    embeds: [discordEmbed]
               });
               return;
          }

          if (!msg.inGuild() && msg.isRepliable()) {
               msg.reply("Not supported yet.");
          }

          const isCommand = msg.isCommand();
          const isButton = msg.isButton();
          const isSelectMenu = msg.isSelectMenu();

          const supportedInteraction = isCommand || isButton || isSelectMenu;
          if (supportedInteraction) {
               return handler(msg, client);
          }
     });
};
