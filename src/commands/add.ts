import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { GetChannelEmotes } from "../services/seventv";
import { getUsername } from "../services/twitch";
import { FeedbackManager } from "../events/modules/FeedbackManager";
import { EmoteListManager } from "../manager/EmoteListManager";
import renderEmotesSelect from "../builders/RenderEmoteList";
import getNavigatorRow from "../builders/GetNavigatorRow";
import { CustomClient } from "../main";

const here = {
     data: new SlashCommandBuilder()
          .setName("add")
          .setDescription("Add emotes from a channel")
          .addStringOption((option) =>
               option
                    .setName("name")
                    .setDescription("Input Channel Name to get emotes from")
                    .setRequired(true)
          ),
     async execute(interaction: CommandInteraction, client: CustomClient) {
          const feedback = new FeedbackManager(interaction);
          await feedback.gotRequest();

          const channelName = (
               interaction.options.get("name")?.value as string
          ).toLowerCase();
          const channelID = await getUsername(channelName);
          if (!channelID) {
               return feedback.error(`${channelName} is not a valid channel!`);
          }

          const getChannelEmotes = await GetChannelEmotes(channelID[0].id);
          if (!getChannelEmotes) {
               return feedback.error(`${channelName} never registered to 7TV!`);
          }

          if (!getChannelEmotes.emote_set.emotes) {
               return feedback.error(
                    `${channelName} doesn't have any emotes registered!`
               );
          }

          const storeId = EmoteListManager.storeEmotes(
               channelName,
               getChannelEmotes.emote_set.emotes
          )!;
          const pageOfEmotes = EmoteListManager.getEmotesInPages(storeId, 1)!;
          const storeInfo = EmoteListManager.getStoredInfo(storeId)!;

          const emotesEmbedPreview = renderEmotesSelect(pageOfEmotes, client);

          const navigatorTask = client.tasks.addTask({
               action: "navigatePage",
               feedback: feedback,
               interaction: interaction,
               currentPage: 1,
               totalPages: storeInfo.pages,
               storeId
          });

          const navigatorRow = getNavigatorRow(navigatorTask, client, {
               nextDisabled: storeInfo.pages === 1,
               previousDisabled: true
          });

          await feedback.sendMessage({
               embeds: emotesEmbedPreview.embeds,
               components: [
                    emotesEmbedPreview.selectEmoteActionRow,
                    navigatorRow
               ]
          });
     }
};

export default here;
