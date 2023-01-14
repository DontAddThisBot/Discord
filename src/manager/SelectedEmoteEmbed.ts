import { EmbedBuilder } from "discord.js";
import { SharpEmote } from "../test/SharpEmote";
import fetch from "node-fetch";

export const SelectedEmoteEmbed = async (data?: any) => {
     const { id, name, animated, host, owner } = data.emote;
     const thumbnail = "https:" + host.url + `/2x.${animated ? "gif" : "png"}`;
     const embeds = new EmbedBuilder();

     const link = await fetch(thumbnail).then((res) => res.arrayBuffer());
     const sharped = await SharpEmote(Buffer.from(link), animated);

     embeds.setTitle(name);
     embeds.setThumbnail(thumbnail);
     embeds.setDescription(`Made by ${owner.display_name}`);

     return {
          embeds,
          sharped
     };
};
