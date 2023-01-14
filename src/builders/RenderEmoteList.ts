import { EmbedBuilder } from "@discordjs/builders";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import emotePreviewEmbed from "../events/embeds/preview";

interface EmoteSelectMessage {
     embeds: EmbedBuilder[];
     selectEmoteActionRow: ActionRowBuilder<ButtonBuilder>;
}

const renderEmotesSelect = (emotes: any[], client: any): EmoteSelectMessage => {
     const selectEmoteActionRow = new ActionRowBuilder<ButtonBuilder>();
     const embeds = emotes.map((emote, index) => {
          const { host, name, owner, animated, id, tags, listed } = emote.data;
          const taskId = client.tasks.addTask({
               action: "selectEmote",
               emoteReference: id,
               animated: animated,
               name: emote.name,
               url: host.url
          });

          selectEmoteActionRow.addComponents(
               new ButtonBuilder()
                    .setCustomId(taskId)
                    .setLabel(name.slice(0, 60))
                    .setStyle(ButtonStyle.Secondary)
          );

          let previewUrl =
               "https:" + host.url + `/2x${animated ? ".gif" : ".png"}`;

          const isListed = listed ? 2742518 : 15548997;
          return emotePreviewEmbed({
               name: name,
               color: isListed,
               author: owner,
               preview: previewUrl,
               tags
          });
     });

     return {
          embeds,
          selectEmoteActionRow
     };
};

export default renderEmotesSelect;
