import fetch from "node-fetch";

export const getUsername = async (id: string) => {
     const Ivr = await fetch(`https://api.ivr.fi/v2/twitch/user?login=${id}`, {
          method: "GET",
          headers: {
               "Content-Type": "application/json",
               "User-Agent": "IF YOU SEE THIS VI VON ZULUL"
          }
     }).then((res) => res.json());
     if (!Ivr[0]?.id) return;
     return Ivr;
};
