import { EmbedBuilder } from "@discordjs/builders";

const emotePreviewEmbed = (options: {
     name: string;
     author?: any;
     preview: string;
     color: number;
     tags?: string[];
}): EmbedBuilder => {
     const Fields = [];
     const { name, author, preview, color, tags } = options;

     const { display_name } = author;
     const authorValue = display_name ? `by ${display_name}` : `-`;
     const authorField = {
          name: `**${name}**`,
          value: authorValue
     };
     Fields.push(authorField);

     if (tags && tags.length > 0) {
          const joinTagsEveryTwoLength = (arr: string[]) => {
               const newArr = [];
               for (let i = 0; i < arr.length; i += 2) {
                    newArr.push(arr.slice(i, i + 2));
               }
               return newArr;
          };

          const tagsValue = joinTagsEveryTwoLength(tags)
               .map((tag) => {
                    return tag.join(", ");
               })
               .join("\n");

          const tagsField = {
               name: "Tags",
               value: "```" + tagsValue + "```"
          };
          Fields.push(tagsField);
     }

     const embed = new EmbedBuilder()
          .setFields(Fields)
          .setThumbnail(preview)
          .setColor(color);
     return embed;
};

export default emotePreviewEmbed;
