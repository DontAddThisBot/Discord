import fetch from "node-fetch";
import { humanizeDuration } from "../utility/humanizeDuration";

interface Query {
     operationName: string;
     query: string;
     variables?: {
          id?: string;
          emote_id?: string;
          list?: string[];
     };
}

const makeRequest = async (url: Query): Promise<any> => {
     const response = await fetch(`https://7tv.io/v3/gql`, {
          method: "POST",
          headers: {
               "Content-Type": "application/json"
          },
          body: JSON.stringify(url)
     });

     const json = await response.json();
     return json;
};

export const GetEmote = async (id?: string): Promise<any> => {
     const query = {
          operationName: "Emote",
          query: `query Emote($id: ObjectID!) {
		emote(id: $id) {
			id
			created_at
			name
			lifecycle
			tags
            animated
			host {
				...HostFragment
			}
		}
	}

	fragment HostFragment on ImageHost {
		url
		files {
			name
			format
			width
			height
			size
		}
	}`,
          variables: {
               id: id
          }
     };

     const response = await makeRequest(query);
     if (response?.errors) {
          return {
               success: false,
               data: null,
               message: response.errors[0].message
          };
     }

     return {
          success: true,
          data: response.data
     };
};

export const GetDiscordConnection = async (id?: string): Promise<any> => {
     const StvRest = await fetch(`https://7tv.io/v3/users/discord/${id}`, {
          method: "GET"
     }).then((res) => res.json());

     if (StvRest?.error) {
          return {
               success: false,
               data: null,
               message: StvRest.error
          };
     }

     const query = {
          operationName: "GetUser",
          query: `query GetUser($id: ObjectID!) {
               user(id: $id) {
                    id
                    username
                    display_name
                    created_at
                    avatar_url
                    roles
                    editor_of {
                         user {
                              id
                              username
                         }
                    }
                    style {
                         color
                         paint_id
                    }
                    editors {
                         id
                         permissions
                         user {
                              id
                              username
                         }
                    }
                    emote_sets {
                         id
                         name
                         capacity
                         emotes {
                              id
                              name
                         }
                    }
                    connections {
                         platform
                         emote_set_id
                         id
                    }
               }
          }`,
          variables: {
               id: StvRest.user.id
          }
     };

     const response = await makeRequest(query);
     if (response?.errors) {
          return {
               success: false,
               data: null,
               message: response.errors[0].message
          };
     }

     return {
          success: true,
          data: response.data
     };
};

export const UserCosmetics = async (id?: string[]): Promise<any> => {
     const query = {
          operationName: "CosmeticsLUL",
          query: `query CosmeticsLUL($list: [ObjectID!]) {
               cosmetics(list: $list) {
                    paints {
                         id
                         kind
                         name
                         function
                         color
                         angle
                         shape
                         image_url
                         repeat
                         stops {
                              at
                              color
                         }
                         shadows {
                              x_offset
                              y_offset
                              radius
                              color
                         }
                    }
                    badges {
                         id
                         kind
                         name
                         tooltip
                         tag
                    }
               }
          }`,
          variables: {
               list: id
          }
     };

     const response = await makeRequest(query);
     return response;
};

export const GlobalRoles = async (): Promise<any> => {
     const query = {
          operationName: "AppState",
          query: `query AppState {
			roles: roles {
				id
				name
				allowed
				color
			}
		}`
     };

     const response = await makeRequest(query);
     return response;
};

export const SevenTVSubscriptions = async (id?: string): Promise<any> => {
     if (!id) return null;
     const egVault = await fetch(
          `https://egvault.7tv.io/v1/subscriptions/${encodeURIComponent(id)}`,
          {
               method: "GET"
          }
     ).then((res) => res.json());

     const { active, end_at, renew, subscription, age } = egVault;
     if (active) {
          const { customer_id, subscriber_id } = subscription;
          const ms = new Date().getTime() - Date.parse(end_at);
          const subDate = humanizeDuration(ms);
          const isRenew = renew == true ? "renew" : "ending";
          const username = await GetUserBySevenTVId(customer_id);
          const gifter =
               customer_id !== subscriber_id
                    ? `gifted by ${username.display_name}`
                    : null;
          const subAge = age / 30;
          return {
               success: true,
               gifter: gifter,
               status: isRenew,
               date: subDate,
               age: subAge.toFixed(1)
          };
     } else {
          return {
               success: false,
               response: null
          };
     }
};

export const GetUserBySevenTVId = async (id?: string): Promise<any> => {
     if (!id) return null;

     const User = await fetch(
          `https://7tv.io/v3/users/${encodeURIComponent(id)}`,
          {
               method: "GET"
          }
     ).then((res) => res.json());

     return User;
};
