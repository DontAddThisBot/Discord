import { EmbedBuilder } from "@discordjs/builders";

export const infoEmbed = (
     title: string,
     description: string,
     thumbnail?: string
): EmbedBuilder => {
     const embed = new EmbedBuilder()
          .setTitle(title)
          .setDescription(description)
          .setThumbnail(thumbnail!);
     return embed;
};
