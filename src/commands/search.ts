import { CustomClient } from "../main";
import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { FeedbackManager } from "../events/modules/FeedbackManager";
import { SearchEmotes } from "../services/seventv";
import { EmoteListManager } from "../manager/EmoteListManager";
import renderEmotesSelect from "../builders/RenderEmoteList";
import getNavigatorRow from "../builders/GetNavigatorRow";

interface EmoteObject {
     name: string;
     id: string;
     tags: string[];
     listed: boolean;
     animated: boolean;
     owner: {
          id: string;
          username: string;
          display_name: string;
     };
     host: {
          url: string;
          files: {
               [key: string]: string;
          };
     };
}

const search = {
     permissions: ["ManageEmojisAndStickers"],
     data: new SlashCommandBuilder()
          .setName("search")
          .setDescription("Search An 7TV Emote and add it!")
          .addStringOption((option) =>
               option
                    .setName("emote")
                    .setDescription("Emote To Search")
                    .setRequired(true)
          ),
     async execute(interaction: CommandInteraction, client: CustomClient) {
          const feedback = new FeedbackManager(interaction);
          await feedback.gotRequest();

          const emoteName = (
               interaction.options.get("emote")?.value as string
          ).toLowerCase();

          const searchEmotes = await SearchEmotes(emoteName);
          if (!searchEmotes.success) {
               return feedback.error(searchEmotes.message);
          }

          const emoteObjectMapped = searchEmotes.data.map(
               (emote: EmoteObject) => {
                    emote.name = emote.name.slice(0, 32);
                    return {
                         name: emote.name,
                         id: emote.id,
                         data: {
                              id: emote.id,
                              name: emote.name,
                              tags: emote.tags,
                              listed: emote.listed,
                              animated: emote.animated,
                              owner: emote.owner,
                              host: emote.host
                         }
                    };
               }
          ) as EmoteObject[];

          const storeId = EmoteListManager.storeEmotes(
               emoteName,
               emoteObjectMapped
          );
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

export default search;
