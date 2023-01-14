import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";
import { ButtonStyle } from "discord.js";

const getNavigatorRow = (
     navigatorTaskId: string,
     client: any,
     options?: {
          nextDisabled: boolean;
          previousDisabled: boolean;
     }
): ActionRowBuilder<ButtonBuilder> => {
     const taskDetails = client.tasks.getTask(navigatorTaskId);
     const { currentPage, totalPages } = taskDetails;

     const navigatorRow = new ActionRowBuilder<ButtonBuilder>();

     let nextDisabled = false;
     let previousDisabled = false;

     if (options) {
          nextDisabled = options.nextDisabled;
          previousDisabled = options.previousDisabled;
     }

     navigatorRow.addComponents(
          new ButtonBuilder()
               .setLabel(`Page ${currentPage}/${totalPages}`)
               .setDisabled(true)
               .setStyle(ButtonStyle.Secondary)
               .setCustomId(navigatorTaskId)
     );

     navigatorRow.addComponents(
          new ButtonBuilder()
               .setLabel("Previous")
               .setEmoji({ name: "⬅️" })
               .setStyle(ButtonStyle.Primary)
               .setCustomId(`${navigatorTaskId}:previous`)
               .setDisabled(previousDisabled)
     );

     navigatorRow.addComponents(
          new ButtonBuilder()
               .setLabel("Next")
               .setEmoji({ name: "➡️" })
               .setStyle(ButtonStyle.Primary)
               .setCustomId(`${navigatorTaskId}:next`)
               .setDisabled(nextDisabled)
     );

     navigatorRow.addComponents(
          new ButtonBuilder()
               .setLabel("Cancel")
               .setStyle(ButtonStyle.Danger)
               .setCustomId(`cancelAction`)
     );

     return navigatorRow;
};

export default getNavigatorRow;
