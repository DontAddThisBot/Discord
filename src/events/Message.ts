import { client } from "../main";
import { handler } from "./modules/Handler";
import { shortenText } from "../misc/Utils";
import { Logger, LogLevel } from "../utility/Logger";
import { racism, slurs } from "../utility/Regex";
import { client_id } from "../../config.json";

export const messages = () => {
     client.on("interactionCreate", async (msg: any) => {
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

          if (msg.commandName) {
               const msgHadnler = {
                    data: msg,
                    send: async (response: any, ephemeral: Boolean) => {
                         if (typeof response === "object") {
                              return await msg.reply({
                                   embeds: [response],
                                   ephemeral: ephemeral
                              });
                         }

                         response = shortenText(response, 1950);

                         if (racism.test(response) || slurs.test(response)) {
                              Logger.log(
                                   LogLevel.WARN,
                                   `This message violates the Discord Terms of Service.`
                              );
                              return;
                         }

                         try {
                              await msg.reply(
                                   ephemeral
                                        ? { content: response, ephemeral: true }
                                        : response
                              );
                         } catch (error) {
                              Logger.log(
                                   LogLevel.ERROR,
                                   `Error while sending message: ${error}`
                              );
                         }
                    }
               };

               handler(msgHadnler);
          }
     });
};
