import humanize from "humanize-duration";

export const humanizeDuration = (ms: number, largest?: number) => {
     const options = {
          language: "shortEn",
          languages: {
               shortEn: {
                    y: () => "y",
                    mo: () => "mo",
                    w: () => "w",
                    d: () => "d",
                    h: () => "h",
                    m: () => "m",
                    s: () => "s",
                    ms: () => "ms"
               }
          },
          Unit: ["y", "mo", "d", "h", "m", "s"],
          largest: largest ?? 4,
          round: true,
          conjunction: " and ",
          spacer: ""
     };

     return humanize(ms, options);
};
