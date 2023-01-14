import { Logger, LogLevel } from "../../utility/Logger";
import { Interaction } from "discord.js";
import { FeedbackManager } from "./FeedbackManager";

import { errorEmbed } from "../embeds/error";
import { CustomClient } from "../../main";

export const handler = async (
     interaction: Interaction,
     client: CustomClient
) => {
     if (interaction.isCommand()) {
          console.log(
               `New command: user: ${interaction.user.username}, guild: ${interaction.guild?.name}, command: ${interaction.commandName}`
          );

          const command = client.commands.get(interaction.commandName) as any;
          if (!command) return;

          try {
               await command.execute(interaction, client);
          } catch (error) {
               Logger.log(
                    LogLevel.ERROR,
                    `Error while executing command: ${error}`
               );
               await interaction.reply({
                    content: `An error occurred while executing this command! \`${error}\``,
                    ephemeral: true
               });
          }
     }

     const isButtonInteraction = interaction.isButton();
     const isSelectMenuInteraction = interaction.isSelectMenu();
     if (isButtonInteraction || isSelectMenuInteraction) {
          const feedback = new FeedbackManager(interaction);
          if (
               !(
                    interaction.user.id ===
                    interaction.message.interaction!.user.id
               )
          ) {
               const error = errorEmbed(
                    "You are not allowed **YET** to use another users interactions!"
               );
               interaction.reply({
                    embeds: [error],
                    ephemeral: true,
                    files: []
               });
               return;
          }

          const interactionTaskId = interaction.customId.split(":")[0];
          let taskDetails;

          if (interactionTaskId === "cancelAction") {
               taskDetails = {
                    action: "cancelAction"
               };
          } else {
               taskDetails = client.tasks.getTask(interactionTaskId);
          }

          if (!taskDetails) {
               await feedback.removeButtons();
               return;
          }

          if (isButtonInteraction) {
               const buttonInteraction = client.buttons.get(taskDetails.action);
               if (!buttonInteraction) return;

               try {
                    await buttonInteraction.execute(interaction, client);
               } catch (error) {
                    Logger.log(
                         LogLevel.ERROR,
                         `Error while executing button: ${error}`
                    );
               }
          }
     }
     // if (interaction) {
     //      const command = client.commands.get(interaction.commandName) as any;
     //      if (!command) return;
     //      console.log(
     //           `New interaction: user: ${interaction.user.username}, guild: ${interaction.guild?.name}, command: ${interaction.commandName}`
     //      );
     //      console.log(interaction);
     //      if (command) {
     //           try {
     //                if (command?.permission) {
     //                     if (
     //                          !interaction.memberPermissions.has(
     //                               command.permission
     //                          )
     //                     ) {
     //                          return await interaction.reply({
     //                               content: `You don't have the permission to use this command! Missing permission: \`${command.permission}\``,
     //                               ephemeral: true
     //                          });
     //                     }
     //                }
     //                await command.execute(interaction, client);
     //                // if (response) {
     //                //      await interaction.reply(response);
     //                // }
     //           } catch (error) {
     //                Logger.log(
     //                     LogLevel.ERROR,
     //                     `Error while executing command: ${error}`
     //                );
     //                await interaction.reply({
     //                     content: `An error occurred while executing this command! \`${error}\``,
     //                     ephemeral: true
     //                });
     //           }
     //      }
     // }
};
