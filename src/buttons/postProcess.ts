import { ButtonInteraction, Guild } from "discord.js";
import { CustomClient } from "../main";
import { FeedbackManager } from "../events/modules/FeedbackManager";
import addEmoteToGuild from "../builders/AddEmoteToGuild";

const cancelAction = {
     data: { name: "postProcess" },
     async execute(interaction: ButtonInteraction, client: CustomClient) {
          const feedback = new FeedbackManager(interaction);

          const [taskId, type] = interaction.customId.split(":");
          const getTaskInfo = client.tasks.getTask(taskId);
          if (type === "submit") {
               try {
                    await addEmoteToGuild(
                         getTaskInfo,
                         interaction.guild!,
                         feedback
                    );
               } catch (err) {
                    await feedback.error(String(err));
               }
          }
     }
};

export default cancelAction;
