import { ApplicationCommandOptionType as ACOT } from "discord.js";
import {
     GetDiscordConnection,
     SevenTVSubscriptions
} from "../services/seventv";
import { pool } from "../database/postgres";

export = {
     name: "stv",
     description: "7TV Profile & Basic Information",
     cooldown: 5000,
     permissions: [],
     options: [
          {
               name: "user",
               type: ACOT.User,
               description: "The User you want to get the 7TV Profile of",
               required: false
          }
     ],
     execute: async (client: any, msg: any) => {
          let fields: any = [];

          const userInput = msg.data.options._hoistedOptions.find(
               (option: any) => option.name === "user"
          );
          const { success, data, message } = await GetDiscordConnection(
               userInput?.value ?? msg.data.user.id
          );

          if (!success && !data) {
               return {
                    ephemeral: true,
                    text: message
               };
          }

          const { rows } = await pool.query(
               `SELECT stv_role FROM stv_roles WHERE stv_role_id = '${data.user.roles[0]}'`
          );

          fields.push(
               {
                    name: "Account Age",
                    value: data.user.created_at.split("T")[0],
                    inline: false
               },
               {
                    name: "SevenTV Role",
                    value: `${rows[0].stv_role}`,
                    inline: false
               },
               {
                    name: "Editor of",
                    value: `${data.user.editor_of?.length} Channels`,
                    inline: true
               },
               {
                    name: "Channel Editors",
                    value: `${data.user.editors?.length} Editors`,
                    inline: true
               }
          );

          const {
               success: subSuccess,
               gifter,
               status,
               date,
               age,
               response
          } = await SevenTVSubscriptions(data.user.id);
          const subResponse =
               gifter === null
                    ? `Sub ${status} in ${date} [${age} Months]`
                    : `${gifter} ${status} in ${date} [${age} Months]`;
          const subPayload = subSuccess ? subResponse : response;
          if (subPayload !== null) {
               fields.push({
                    name: "Subscriptions",
                    value: `${subPayload}`,
                    inline: false
               });
          }

          const findEmoteSet = data.user.emote_sets.find(
               (x: any) => x.id === data.user.connections[0].emote_set_id
          );

          if (findEmoteSet) {
               fields.push({
                    name: `Emote Set ${findEmoteSet?.name ?? "𝗨𝗡𝗞𝗡𝗢𝗪𝗡"}`,
                    value: `Emotes/Capacity: ${
                         ` ${findEmoteSet?.emotes.length}/${findEmoteSet?.capacity}` ??
                         "𝗨𝗡𝗞𝗡𝗢𝗪𝗡"
                    }`,
                    inline: false
               });
          }

          data.user.connections.forEach((x: any) => {
               fields.push({
                    name: x.platform,
                    value: x.id,
                    inline: true
               });
          });

          return {
               ephemeral: false,
               embed: {
                    color: 2742518,
                    title: data.user.username,
                    url: `https://7tv.app/users/${data.user.id}`,
                    thumbnail: {
                         url:
                              `https:` +
                              data.user?.avatar_url.replace(
                                   "/3x.webp",
                                   "/3x.gif"
                              )
                    },
                    fields: fields,
                    timestamp: new Date(),
                    footer: {
                         text: "7TV Profile",
                         icon_url:
                              "https://cdn.7tv.app/emote/619de73c70bd99598795ee2f/4x.png"
                    }
               }
          };
     }
};
