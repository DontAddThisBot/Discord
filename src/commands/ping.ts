import {
     SlashCommandBuilder,
     ActionRowBuilder,
     ButtonBuilder,
     ButtonStyle,
     CommandInteraction
} from "discord.js";
// import { Collector } from "../Collector";
import { GetChannelEmotes } from "../services/seventv";
import { FeedbackManager } from "../events/modules/FeedbackManager";
import { getRow } from "../manager/RowBuilder";
import { EmoteListManager } from "../manager/EmoteListManager";
import { returnEmbeds } from "../manager/EmbedBuilder";
import { ButtonSelectBuilder } from "../manager/ButtonSelectBuilder";
import renderEmotesSelect from "../test/RenderEmoteList";
import getNavigatorRow from "../test/GetNavigatorRow";
import { CustomClient } from "../main";

const here = {
     data: new SlashCommandBuilder()
          .setName("here")
          .setDescription("Test Command")
          .addStringOption((option) =>
               option
                    .setName("name")
                    .setDescription("Input Channel Name to get emotes from")
                    .setRequired(true)
          ),
     async execute(interaction: CommandInteraction, client: CustomClient) {
          const feedback = new FeedbackManager(interaction);
          await feedback.gotRequest();

          const channelName = interaction.options.get("name")?.value as string;
          const getChannelEmotes = await GetChannelEmotes(channelName);
          if (!getChannelEmotes) {
               return feedback.error(`${channelName} is not a valid channel!`);
          }

          // const Row = new ActionRowBuilder();
          // Row.addComponents(
          //      new ButtonBuilder()
          //           .setCustomId(`cancelAction`)
          //           .setLabel("Cancel")
          //           .setStyle(ButtonStyle.Danger)
          // );

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

          // const ID = EmoteListManager.storeEmotes(
          //      channelName,
          //      getChannelEmotes.emote_set.emotes
          // );

          // const BuildButtons = ButtonSelectBuilder(ID, 1);
          // const BuildBottomRows = getRow(1, getChannelEmotes.emote_set.emotes);
          // await feedback.sendMessage({
          //      embeds: returnEmbeds(ID, 1),
          //      components: [BuildButtons, BuildBottomRows]
          // });

          // Collector(interaction, client, ID, getChannelEmotes.emote_set.emotes);
     }
};

export default here;
