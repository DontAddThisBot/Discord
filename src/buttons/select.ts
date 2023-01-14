import { ButtonInteraction } from "discord.js";

// import emote7tv from "../emotes/emote7tv";
import { FeedbackManager } from "../events/modules/FeedbackManager";
// import * as TaskTypes from "../types/TaskTypes";
// import editEmoteByUser from "../emotes/editEmoteByUser";
// import getRawEmote from "../api/discord/getRawEmote";
import fetch from "node-fetch";
import { SharpEmote } from "../utility/SharpEmote";
import { interactionEmbed } from "../events/embeds/interaction";
import sizeOf from "buffer-image-size";
import prettyBytes from "pretty-bytes";
import sharp from "sharp";
import { CustomClient } from "../main";
import getSubmitEmoteRow from "../builders/GetSubmitRow";

const maxEmoteSize = 262144;
const selectEmote = {
     data: { name: "selectEmote" },
     async execute(interaction: ButtonInteraction, client: CustomClient) {
          const feedback = new FeedbackManager(interaction);

          const taskId = interaction.customId;

          const taskDetails = client.tasks.getTask(taskId);
          const { emoteReference, url, animated, name } = taskDetails;

          await feedback.removeButtons();
          await feedback.gotRequest();

          const thumbnail = "https:" + url + `/2x.${animated ? "gif" : "png"}`;
          const link = await fetch(thumbnail).then((res) => res.arrayBuffer());
          let Buffered = Buffer.from(link);

          //   const sharped = await SharpEmote(Buffer.from(link), animated);

          const imageData = sizeOf(Buffered);
          let dimensions: [number, number] = [
               imageData.width,
               imageData.height
          ];
          const sharpOptions = { animated: animated };

          if (Buffered.byteLength > maxEmoteSize) {
               while (Buffered.byteLength > maxEmoteSize) {
                    const CurrentSize = prettyBytes(Buffered.byteLength);
                    const maxSize = prettyBytes(maxEmoteSize);
                    await feedback.warning(
                         `Optimizing Emote.... \n ${CurrentSize} / ${maxSize}, `
                    );

                    const dmns = await sharp(Buffered).metadata();
                    const dimensionsNew = [dmns.width!, dmns.height!];

                    dimensions = dimensionsNew.map((dimension) =>
                         Math.floor((dimension *= 0.9))
                    ) as [number, number];

                    const [x, y] = dimensions;

                    const resizeOptions: sharp.ResizeOptions = {
                         width: x,
                         height: y
                    };

                    animated
                         ? (Buffered = await sharp(Buffered, sharpOptions)
                                .gif()
                                .resize(resizeOptions)
                                .toBuffer())
                         : (Buffered = await sharp(Buffered, sharpOptions)
                                .jpeg()
                                .resize(resizeOptions)
                                .toBuffer());
               }
          }

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

          // try {
          //   let emote: any;
          //   if (origin === "7tv") {
          //     emote = await emote7tv(emoteReference, feedback);
          //   }
          // //   if (origin === "twitch") {
          // //     const rawEmote = await getRawEmote(taskDetails.url!);
          // //     const emoteFile = Buffer.from(rawEmote!);
          // //     emote = {
          // //       animated: taskDetails.animated!,
          // //       data: emoteFile,
          // //       finalData: emoteFile,
          // //       name: taskDetails.name!,
          // //       origin: "twitch",
          // //       preview: taskDetails.preview!,
          // //     };
          // //   }
          // //   await editEmoteByUser(emote!, interaction.guild!, {
          // //     client,
          // //     feedback,
          // //     interaction,
          // //   });
          // } catch (error) {
          //   feedback.error(String(error));
          // }
     }
};

export default selectEmote;
