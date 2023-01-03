import { ApplicationCommandOptionType as ACOT } from "discord.js";
import { GetEmote } from "../services/seventv";

export = {
     name: "add",
     cooldown: 5000,
     permission: ["ManageEmojisAndStickers"],
     description: "Add a 7TV Emote to the discord server",
     options: [
          {
               name: "emote",
               type: ACOT.String,
               description: "The Emote you want to add to the server",
               required: true
          }
     ],
     execute: async (client: any, msg: any) => {
          const createEmote = async (
               attachment: string,
               name: string,
               animated: Boolean
          ) => {
               return await msg.data.guild.emojis.create({
                    attachment,
                    name,
                    animated: animated ? true : false
               });
          };

          const userInput = msg.data.options._hoistedOptions.find(
               (option: any) => option.name === "emote"
          );

          const emoteId = userInput.value;
          if (/https:\/\/(next\.)?7tv\.app\/emotes\/\w{24}/g.test(emoteId)) {
               const linkEmote =
                    /https:\/\/(next\.)?7tv\.app\/emotes\/(\w{24})/.exec(
                         emoteId
                    );

               const { success, data, message } = await GetEmote(
                    linkEmote?.[2]
               );
               if (!success) {
                    return {
                         text: message,
                         ephemeral: true
                    };
               }

               const { name, animated, host } = data.emote;
               const addEmote = await createEmote(
                    animated
                         ? `https://${host.url}/1x.gif`
                         : `https://${host.url}/2x.png`,
                    name,
                    animated
               );

               if (addEmote) {
                    return {
                         text: `Successfully created emoji ${addEmote.name}!`,
                         ephemeral: false
                    };
               }
          }

          return {
               text: `Please put a Actual Emote link that starts with \`https://7tv.app/emotes/\``,
               ephemeral: true
          };
     }
};
