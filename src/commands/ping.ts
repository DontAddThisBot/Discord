import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { CustomClient } from "../main";

const test = {
     data: new SlashCommandBuilder()
          .setName("ping")
          .setDescription("Bot response command"),
     async execute(interaction: CommandInteraction, client: CustomClient) {
          await interaction.reply("Pong!");
     }
};

export default test;
