import { EmbedBuilder } from "@discordjs/builders";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
// import emotePreviewEmbed from "../embedMessages/emotePreviewEmbed";
import emotePreviewEmbed from "../events/embeds/preview";

interface EmoteSelectMessage {
     embeds: EmbedBuilder[];
     selectEmoteActionRow: ActionRowBuilder<ButtonBuilder>;
}

const emojiNumbers = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];

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
     //  const embeds = emotes.map((emote, index) => {
     //       const { host, name, owner, animated, id } = emote;
     //       const number = emojiNumbers[index];

     //       let previewUrl = host.preview;
     //       // animated ? (previewUrl += ".gif") : (previewUrl += ".webp");

     //       // const taskId = client.tasks.addTask<TaskTypes.EmotePicker>({
     //       //   action: "selectEmote",
     //       //   emoteReference: id,
     //       //   origin: emote.origin,
     //       //   animated: emote.animated,
     //       //   name: emote.name,
     //       //   preview: emote.host.preview,
     //       //   url: emote.host.url,
     //       // });

     //       // selectEmoteActionRow.addComponents(
     //       //   new ButtonBuilder()
     //       //     .setCustomId(taskId)
     //       //     .setEmoji(number)
     //       //     .setLabel("Select")
     //       //     .setStyle(ButtonStyle.Secondary)
     //       // );

     //       return emotePreviewEmbed({
     //            number,
     //            name,
     //            author: owner?.display_name,
     //            preview: previewUrl
     //       });
     //  });

     //  return {
     //       embeds,
     //       components: selectEmoteActionRow
     //  };
};

export default renderEmotesSelect;
