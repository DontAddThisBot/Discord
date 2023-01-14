import { EmbedBuilder } from "@discordjs/builders";

export const errorEmbed = (description: string): EmbedBuilder => {
     const embed = new EmbedBuilder()
          .setColor(0xeb3434)
          .setTitle("🔴  Something went wrong")
          .setDescription(description);
     return embed;
};
