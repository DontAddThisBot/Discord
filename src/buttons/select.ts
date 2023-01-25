import { ButtonInteraction } from "discord.js";

import { FeedbackManager } from "../events/modules/FeedbackManager";
import { interactionEmbed } from "../events/embeds/interaction";
import { CustomClient } from "../main";
import getSubmitEmoteRow from "../builders/GetSubmitRow";
import { Optimizer } from "../manager/Optimizer";

const selectEmote = {
     data: { name: "selectEmote" },
     async execute(interaction: ButtonInteraction, client: CustomClient) {
          const feedback = new FeedbackManager(interaction);

          const taskId = interaction.customId;

          const taskDetails = client.tasks.getTask(taskId);
          const { emoteReference, url, animated, name } = taskDetails;

          await feedback.removeButtons();
          await feedback.gotRequest();

          let Buffered = await Optimizer(url, animated, feedback);

          const Embed = interactionEmbed(
               "Editing Your Emote..",
               "Now you can edit your emote, you can use the following buttons to edit your emote",
               "attachment://preview.gif"
          );

          const createSubmitButtons = client.tasks.addTask({
               action: "postProcess",
               emoteReference,
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

export default selectEmote;
