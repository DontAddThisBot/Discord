import { Pool } from "pg";
import { postgres } from "../../config.json";
import { Logger, LogLevel } from "../utility/Logger";
import { GlobalRoles } from "../services/seventv";

export const pool = new Pool({
     ...postgres,
     database: "discord_bot"
});

export const Connect = () => {
     pool.connect(async (err: any, client: any, release) => {
          if (err) {
               return Logger.log(
                    LogLevel.ERROR,
                    `Error connecting to the database: ${err.stack}`
               );
          }

          try {
               await client.query(`CREATE TABLE IF NOT EXISTS stv_roles (
                    id SERIAL PRIMARY KEY,
                    stv_role VARCHAR(255) NOT NULL,
                    stv_role_id VARCHAR(255) NOT NULL
               )`);

               const { data } = await GlobalRoles();
               for (const { id, name } of data.roles) {
                    await client.query(
                         `INSERT INTO stv_roles (stv_role, stv_role_id) SELECT * FROM (SELECT '${name}', '${id}') AS tmp WHERE NOT EXISTS (SELECT stv_role_id FROM stv_roles WHERE stv_role_id = '${id}') LIMIT 1;`
                    );
               }
          } catch (err) {
               Logger.log(LogLevel.ERROR, `${err}`);
          }
     });
};
