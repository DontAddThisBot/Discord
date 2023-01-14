import { SlashCommandBuilder } from "discord.js";

const test = {
     data: new SlashCommandBuilder().setName("test").setDescription("test"),
     async execute(interaction: any, client: any) {
          console.log("test");
     }
};

export default test;
