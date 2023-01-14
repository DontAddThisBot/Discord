import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { EmoteListManager } from "./EmoteListManager";

export const ButtonSelectBuilder = (
     ID: string,
     CurrentPage: number,
     emotes?: any
) => {
     const findStoredEmotes = EmoteListManager.getEmotesInPages(
          ID,
          CurrentPage
     );
     if (!findStoredEmotes) return;
     const Row = new ActionRowBuilder();

     const Buttons = [];
     for (const emote of findStoredEmotes) {
          const { name, data, id } = emote;
          const buildButton = new ButtonBuilder();
          buildButton.setCustomId(`${id}:emote`);
          buildButton.setStyle(ButtonStyle.Primary);
          buildButton.setLabel(name.slice(0, 60));

          Buttons.push(buildButton);
     }

     Row.addComponents(Buttons);
     return Row;
};
