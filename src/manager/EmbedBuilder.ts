import { EmbedBuilder } from "discord.js";
import { EmoteListManager } from "./EmoteListManager";

export const returnEmbeds = (ID: string, page: number) => {
     const findStoredEmotes = EmoteListManager.getEmotesInPages(ID, page);
     if (!findStoredEmotes) return;

     const embeds = [];
     for (const emote of findStoredEmotes) {
          const { name, data, id } = emote;
          const formatImage = data.animated ? "gif" : "png";
          const isListed = data.listed ? 2742518 : 15548997;

          const embed = new EmbedBuilder();
          embed.setTitle(name);
          embed.setColor(isListed);
          embed.setThumbnail("https:" + data.host.url + `/2x.${formatImage}`);
          embed.setDescription(`Made by ${data.owner.display_name}`);

          embeds.push(embed);
     }

     return embeds;
};
