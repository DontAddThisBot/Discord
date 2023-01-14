import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { CustomClient } from "../main";

const test = {
     data: new SlashCommandBuilder().setName("test").setDescription("test"),
     async execute(interaction: CommandInteraction, client: CustomClient) {
          console.log("test");
     }
};

export default test;
