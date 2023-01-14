import { EmbedBuilder } from "@discordjs/builders";

const warningEmbed = (description: string): EmbedBuilder => {
     const embed = new EmbedBuilder()
          .setTitle("⚠️ Warning!")
          .setColor(0xf7e139)
          .setDescription(description)
          .setThumbnail(
               "https://cdn.7tv.app/emote/60ae3f21aee2aa553831073a/4x.gif"
          );
     return embed;
};

export default warningEmbed;
