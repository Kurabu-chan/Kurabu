import { Knex } from "knex";

/** Design URI: https://github.com/Kurabu-chan/Kurabu/issues/138 */
export function up(knex: Knex): Knex.SchemaBuilder {
    return knex.schema
        .alterTable("User", (table: Knex.TableBuilder) => {
            table.boolean("verificationCompleted").defaultTo(false);
            table.string("verificationCode").nullable();
        });
}

export async function down(knex: Knex): Promise<Knex.SchemaBuilder> {
    // Backup
    await knex.schema.renameTable("User", "00002_down__User");
    await knex.schema.createTable("User", (table: Knex.TableBuilder) => {
        table
            .uuid("userId")
            .primary()
            .unique()
            .defaultTo(knex.raw("(uuid_generate_v4())"));
        table
            .string("email")
            .unique();
        table
            .string("hash");
        table
            .dateTime("createDate")
            .defaultTo(knex.fn.now());
    });

    const data = await knex("00002_down__User").select("userId", "email", "hash", "createDate");
    await knex("User").insert(data);
}
