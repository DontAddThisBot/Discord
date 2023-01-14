import {
     ButtonInteraction,
     CommandInteraction,
     InteractionReplyOptions,
     InteractionUpdateOptions,
     SelectMenuInteraction,
     GuildEmoji,
     AttachmentPayload,
     TextChannel
} from "discord.js";
import {
     ActionRowBuilder,
     EmbedBuilder,
     ButtonBuilder,
     SelectMenuBuilder
} from "@discordjs/builders";

import { infoEmbed } from "../embeds/info";
import { errorEmbed } from "../embeds/error";
import { interactionEmbed } from "../embeds/interaction";
import warningEmbed from "../embeds/warning";

export class FeedbackManager {
     interaction:
          | CommandInteraction
          | ButtonInteraction
          | SelectMenuInteraction;
     client!: any;
     ephemeral: boolean;
     isReplied = false;

     constructor(
          interaction:
               | CommandInteraction
               | ButtonInteraction
               | SelectMenuInteraction,
          options?: {
               ephemeral?: boolean;
          }
     ) {
          let ephemeral = false;

          if (options?.ephemeral) ephemeral = options.ephemeral;

          this.interaction = interaction;
          this.client = interaction.client;
          this.ephemeral = ephemeral;
          this.isReplied = interaction.replied;
     }

     async sendMessage(
          options: {
               embeds?: EmbedBuilder[];
               components?: ActionRowBuilder<
                    ButtonBuilder | SelectMenuBuilder
               >[];
               files?: AttachmentPayload[];
               imageInEmbed?: string;
          },
          ephemeral: boolean = false
     ) {
          if (this.ephemeral) ephemeral = true;

          const { embeds, components, files } = options;

          if (embeds && embeds.length > 0) {
               const lastIndex = embeds.length - 1;
               let lastEmbedText = this.client.user!.username;
               // if (env === "development") {
               //   lastEmbedText += " | Development stage.";
               // }
               embeds[lastIndex].setFooter({
                    text: lastEmbedText,
                    iconURL: this.client.user!.avatarURL()!
               });
          }

          const messagePayload:
               | InteractionReplyOptions
               | InteractionUpdateOptions = {
               embeds: embeds,
               components: components,
               files,
               ephemeral
          };
          //   console.log(messagePayload.components);

          // this.isReplied = this.interaction.replied;

          if (this.isReplied) {
               console.log("editReply");
               await this.interaction.editReply(messagePayload);
          } else {
               if (!(this.interaction instanceof CommandInteraction)) {
                    console.log("no interaction");
                    await this.interaction.update({
                         embeds,
                         components,
                         files
                    });
               } else {
                    console.log("reply");
                    await this.interaction.reply(messagePayload);
               }
          }

          this.isReplied = true;
     }

     async info(title: string, message: string, thumbnail?: string) {
          const embed = infoEmbed(title, message, thumbnail);
          await this.sendMessage({ embeds: [embed] });
     }

     async gotRequest() {
          await this.info(
               "Got Request!",
               "This will take a bit...",
               "https://cdn.7tv.app/emote/60ae3f21aee2aa553831073a/4x.gif"
          );
     }

     async updateComponents(
          components: ActionRowBuilder<ButtonBuilder | SelectMenuBuilder>[]
     ) {
          await this.sendMessage({ components: components });
     }

     async error(message: string, ephemeral: boolean = false) {
          const embed = errorEmbed(message);
          await this.sendMessage({ embeds: [embed] }, ephemeral);
     }

     async removeButtons() {
          await this.sendMessage({ components: [], files: [] });
     }

     async deleteMessage() {
          await this.interaction.deleteReply();
     }

     async userInteraction(title: string, description: string, image?: string) {
          const embed = interactionEmbed(title, description, image);
          await this.sendMessage({ embeds: [embed] });
     }

     async warning(
          message: string,
          components?: ActionRowBuilder<ButtonBuilder | SelectMenuBuilder>[]
     ) {
          const embed = warningEmbed(message);
          await this.sendMessage({ embeds: [embed], components });
     }
}
