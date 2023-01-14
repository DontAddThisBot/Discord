// import { ButtonInteraction, InteractionCollector } from "discord.js";
// import { FeedbackManager } from "./events/modules/FeedbackManager";
// import { returnEmbeds } from "./manager/EmbedBuilder";
// import { getRow } from "./manager/RowBuilder";
// import cancelAction from "./buttons/cancel";
// import { ButtonSelectBuilder } from "./manager/ButtonSelectBuilder";
// import { GetEmote } from "./services/seventv";
// import { SelectedEmoteEmbed } from "./manager/SelectedEmoteEmbed";
// import { interactionEmbed } from "./events/embeds/interaction";
// import { AddOrCancel } from "./manager/AddOrCancel";
// import { TaskManager } from "./manager/TaskManager";
// import { errorEmbed } from "./events/embeds/error";

// export const Collector = (
//      interaction: ButtonInteraction,
//      client: any,
//      taskId?: any,
//      emotes?: any[]
// ) => {
//      const collector = new InteractionCollector(client, {
//           time: 1000 * 60 * 10,
//           filter: (i) => i.user.id === interaction.user.id
//      });
//      const feedback = new FeedbackManager(interaction);

//      collector.on("collect", async (i: any) => {
//           if (!i.isButton()) return;
//           i.deferUpdate();
//           let [page, type] = i.customId.split(":");
//           switch (type as string) {
//                case "next": {
//                     page = Number(page) + 1;
//                     const BuildButtons = ButtonSelectBuilder(taskId, page);
//                     const RowBuilder = getRow(page, emotes);
//                     const embds = returnEmbeds(taskId, page);

//                     await feedback.sendMessage({
//                          embeds: embds,
//                          components: [BuildButtons, RowBuilder]
//                     });
//                     break;
//                }
//                case "previous": {
//                     page = Number(page) - 1;
//                     const BuildButtons = ButtonSelectBuilder(taskId, page);
//                     const RowBuilder = getRow(page, emotes);
//                     const embds = returnEmbeds(taskId, page);

//                     await feedback.sendMessage({
//                          embeds: embds,
//                          components: [BuildButtons, RowBuilder]
//                     });
//                     break;
//                }
//                case "cancel": {
//                     await feedback.deleteMessage();
//                     collector.stop();
//                     break;
//                }
//                case "emote": {
//                     await feedback.removeButtons();
//                     await feedback.gotRequest();

//                     const emote = page;
//                     const { success, data } = await GetEmote(emote);
//                     if (!success) {
//                          await feedback.removeButtons();
//                          await feedback.error("Something went wrong!");
//                          return;
//                     }

//                     const Emote = await SelectedEmoteEmbed(data);
//                     const indentifyID = TaskManager.addTask(
//                          data,
//                          Emote.sharped
//                     );
//                     const Buttons = AddOrCancel(indentifyID);
//                     const embed = interactionEmbed(
//                          "Editing Your Emote..",
//                          "Now you can edit your emote, you can use the following buttons to edit your emote",
//                          "attachment://preview.gif"
//                     );

//                     await feedback.sendMessage({
//                          embeds: [embed],
//                          components: [Buttons],
//                          files: [
//                               { attachment: Emote.sharped, name: "preview.gif" }
//                          ]
//                     });
//                     break;
//                }
//                case "submit": {
//                     const { sharped, emote } = TaskManager.getTask(page);
//                     await feedback.removeButtons();
//                     try {
//                          await i.guild.emojis.create({
//                               attachment: sharped,
//                               name: emote.name,
//                               animated: emote.animated
//                          });
//                     } catch (error) {
//                          return await feedback.error(String(error));
//                     }

//                     await i.update({
//                          content: "Your emote has been added to the server!"
//                     });
//                     break;
//                }
//                default: {
//                     await feedback.error("Not supported Button");
//                     break;
//                }
//           }
//      });
// };
