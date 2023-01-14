import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { EmoteListManager } from "./EmoteListManager";

export const AddOrCancel = (ID?: any) => {
     const Row = new ActionRowBuilder();
     Row.addComponents(
          new ButtonBuilder()
               .setCustomId(`${ID}:submit`)
               .setLabel("Submit")
               .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
               .setCustomId(`asd:cancel`)
               .setLabel("Cancel")
               .setStyle(ButtonStyle.Danger)
     );

     return Row;
};
