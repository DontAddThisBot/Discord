import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export const getRow = (CurrentPage?: number, emotes?: any) => {
     const Row = new ActionRowBuilder();
     if (!emotes) emotes = [];
     const emotesPerPage = 5;
     const pages = Math.ceil(emotes.length / emotesPerPage);

     Row.addComponents(
          new ButtonBuilder()
               .setCustomId(`page`)
               .setStyle(ButtonStyle.Secondary)
               .setDisabled(true)
               .setLabel(`Page ${CurrentPage}/${pages}`)
     );

     Row.addComponents(
          new ButtonBuilder()
               .setCustomId(`${CurrentPage}:previous`)
               .setStyle(ButtonStyle.Primary)
               .setLabel("Previous")
               .setDisabled(CurrentPage === 1)
     );

     Row.addComponents(
          new ButtonBuilder()
               .setCustomId(`${CurrentPage}:next`)
               .setStyle(ButtonStyle.Primary)
               .setLabel("Next")
               .setDisabled(CurrentPage === pages)
     );

     Row.addComponents(
          new ButtonBuilder()
               .setCustomId("asd:cancel")
               .setStyle(ButtonStyle.Danger)
               .setLabel("Cancel")
     );

     return Row;
};
