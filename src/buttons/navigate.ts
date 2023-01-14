import { ButtonInteraction } from "discord.js";
import { FeedbackManager } from "../events/modules/FeedbackManager";
import renderEmotesSelect from "../test/RenderEmoteList";
import getNavigatorRow from "../test/GetNavigatorRow";
import { EmoteListManager } from "../manager/EmoteListManager";
import { CustomClient } from "../main";

const navigatorPage = {
  data: { name: "navigatePage" },
  async execute(interaction: ButtonInteraction, client: CustomClient) {
    const feedback = new FeedbackManager(interaction);

    await feedback.removeButtons();
    await feedback.gotRequest();

    try {
      const interationArguments = interaction.customId.split(":");
      const [taskId, action] = interationArguments;

      const taskDetails = client.tasks.getTask(taskId)!;
      const { currentPage, totalPages, storeId } = taskDetails;

      let pageDirection: number;
      action === "previous"
        ? (pageDirection = -1)
        : (pageDirection = 1);
      const newPage = currentPage + pageDirection;

      client.tasks.updateCurrentPage(taskId, newPage);

      let nextDisabled = false;
      let previousDisabled = false;

      if (newPage >= totalPages!) {
        nextDisabled = true;
      }

      if (newPage <= 1) {
        previousDisabled = true;
      }

      const emotePage = EmoteListManager.getEmotesInPages(
        storeId,
        newPage
      )!;

      const emotesEmbedsPreview = renderEmotesSelect(
        emotePage,
        client
      );
      const navigatorRow = getNavigatorRow(taskId, client, {
        nextDisabled,
        previousDisabled
      });

      await feedback.sendMessage({
        embeds: emotesEmbedsPreview.embeds,
        components: [
          emotesEmbedsPreview.selectEmoteActionRow,
          navigatorRow
        ]
      });
    } catch (error) {
      feedback.error(String(error));
    }
  }
};

export default navigatorPage;
