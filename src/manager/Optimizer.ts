import { FeedbackManager } from "../events/modules/FeedbackManager";
import fetch from "node-fetch";
import sizeOf from "buffer-image-size";
import prettyBytes from "pretty-bytes";
import sharp from "sharp";

const maxEmoteSize = 262144;
export const Optimizer = async (
     url: string,
     animated: boolean,
     feedback: FeedbackManager
) => {
     const thumbnail = "https:" + url + `/2x.${animated ? "gif" : "png"}`;
     const link = await fetch(thumbnail).then((res) => res.arrayBuffer());
     let Buffered = Buffer.from(link);

     //   const sharped = await SharpEmote(Buffer.from(link), animated);

     const imageData = sizeOf(Buffered);
     let dimensions: [number, number] = [imageData.width, imageData.height];
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

     return Buffered;
};
