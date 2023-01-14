import { Guild } from "discord.js";
import { FeedbackManager } from "../events/modules/FeedbackManager";

const addEmoteToGuild = async (
     emote: any,
     guild: Guild,
     feedback: FeedbackManager
) => {
     try {
          await feedback.removeButtons();
          const addedEmote = await guild.emojis.create({
               attachment: emote.Buffered,
               name: emote.name
          });
          await feedback.successedAddedEmote(addedEmote);
     } catch (error) {
          throw new Error(String(error));
     }
};

export default addEmoteToGuild;
