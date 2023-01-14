import { randomBytes } from "crypto";
import { chunk } from "lodash";

export class EmoteListManager {
     private static _instance: EmoteListManager;
     static emotesArray: any[] = [];
     private constructor() {}

     static getEmotesInPages(id: string, page: number) {
          const foundEntry = this.emotesArray.find(
               (entries) => entries.id === id
          );

          if (!foundEntry) return;
          return foundEntry.emotes[--page];
     }

     static removeStoredEmote(id: string) {
          this.emotesArray = this.emotesArray.filter((task) => task.id !== id);
     }

     static getStoredInfo(id: string) {
          const foundEntry = this.emotesArray.find(
               (entries) => entries.id === id
          );
          if (!foundEntry) return undefined;
          return foundEntry;
     }

     static storeEmotes(query: string, emotes: any[]) {
          const emotesPerPage = 5;
          const identificator = randomBytes(8).toString("hex");
          const pages = Math.ceil(emotes.length / emotesPerPage);
          const chunkedEmotes = chunk(emotes, emotesPerPage);
          this.emotesArray.push({
               id: identificator,
               pages: pages,
               amount: emotes.length,
               query: query,
               emotes: chunkedEmotes
          });

          const timeoutTime = 1000 * 60 * 10; //10 minutes
          setTimeout(() => {
               this.removeStoredEmote(identificator);
          }, timeoutTime);
          return identificator;
     }
}
