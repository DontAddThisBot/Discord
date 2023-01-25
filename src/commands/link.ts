import { CustomClient } from "../main";
import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { FeedbackManager } from "../events/modules/FeedbackManager";
import { GetEmote } from "../services/seventv";
import { Optimizer } from "../manager/Optimizer";
import { interactionEmbed } from "../events/embeds/interaction";
import getSubmitEmoteRow from "../builders/GetSubmitRow";

const link = {
     permissions: ["ManageEmojisAndStickers"],
     data: new SlashCommandBuilder()
          .setName("link")
          .setDescription("Emote Link to add emote to the server")
          .addStringOption((option) =>
               option
                    .setName("link")
                    .setDescription("7TV Emote Link")
                    .setRequired(true)
          ),
     async execute(interaction: CommandInteraction, client: CustomClient) {
          const feedback = new FeedbackManager(interaction);
          await feedback.gotRequest();

          const emoteLink = (
               interaction.options.get("link")?.value as string
          ).toLowerCase();

          const regex = /https:\/\/(next\.)?7tv\.app\/emotes\/\w{24}/g;
          if (!regex.test(emoteLink)) {
               return feedback.error("Invalid 7TV Emote Link!");
          }

          const parser = /https:\/\/(next\.)?7tv\.app\/emotes\/(\w{24})/;
          const emoteID = parser.exec(emoteLink) as RegExpExecArray;

          const emote = await GetEmote(emoteID[2]);
          if (!emote.success) {
               return feedback.error(emote.message);
          }

          const { animated, host, id, name } = emote.data.emote;
          let Buffered = await Optimizer(host.url, animated, feedback);

          const Embed = interactionEmbed(
               "Editing Your Emote..",
               "Now you can edit your emote, you can use the following buttons to edit your emote",
               "attachment://preview.gif"
          );

          const createSubmitButtons = client.tasks.addTask({
               action: "postProcess",
               emoteReference: id,
               Buffered,
               animated,
               name
          });

          const GetSubmit = getSubmitEmoteRow(createSubmitButtons, name);
          await feedback.sendMessage({
               embeds: [Embed],
               components: [GetSubmit],
               files: [{ attachment: Buffered, name: "preview.gif" }]
          });
     }
};

export default link;
