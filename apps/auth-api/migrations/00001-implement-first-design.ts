import { Knex } from "knex";

/** Design URI: https://github.com/Kurabu-chan/Kurabu/issues/138 */
export function up(knex: Knex): Knex.SchemaBuilder {
    return knex.schema
        .raw("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";")
        .createTable("User", (table: Knex.TableBuilder) => {
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
        })
        .createTable("Role", (table: Knex.TableBuilder) => {
            table
                .uuid("roleId")
                .primary()
                .unique()
                .defaultTo(knex.raw("(uuid_generate_v4())"));
            table
                .string("name")
                .unique();
            table
                .dateTime("createDate")
                .defaultTo(knex.fn.now());
        })
        .createTable("RoleAssignment", (table: Knex.TableBuilder) => {
            table
                .uuid("roleAssignmentId")
                .primary()
                .unique()
                .defaultTo(knex.raw("(uuid_generate_v4())"));
            table
                .uuid("roleId")
                .references("roleId")
                .inTable("Role");
            table
                .uuid("userId")
                .references("userId")
                .inTable("User");
            table
                .dateTime("createDate")
                .defaultTo(knex.fn.now());
        })
        .createTable("Scope", (table: Knex.TableBuilder) => {
            table
                .uuid("scopeId")
                .primary()
                .unique()
                .defaultTo(knex.raw("(uuid_generate_v4())"));
            table
                .uuid("roleId")
                .references("roleId")
                .inTable("Role");
            table
                .string("name")
                .unique();
            table
                .dateTime("createDate")
                .defaultTo(knex.fn.now());
        })
        .createTable("ExternalApplication", (table: Knex.TableBuilder) => {
            table
                .uuid("externalApplicationId")
                .primary()
                .unique()
                .defaultTo(knex.raw("(uuid_generate_v4())"));
            table
                .string("name")
                .unique();
            table
                .string("b64AuthenticationOptions");
            table
                .dateTime("createDate")
                .defaultTo(knex.fn.now());
        })
        .createTable("ExternalConnection", (table: Knex.TableBuilder) => {
            table
                .uuid("externalConnectionId")
                .primary()
                .unique()
                .defaultTo(knex.raw("(uuid_generate_v4())"));
            table
                .uuid("userId")
                .references("userId")
                .inTable("User");
            table
                .uuid("externalApplicationId")
                .references("externalApplicationId")
                .inTable("ExternalApplication");
            table
                .string("accessToken");
            table
                .string("refreshToken");
            table
                .dateTime("accessTokenExpiresAt");
            table
                .dateTime("refreshTokenExpiresAt");
            table
                .dateTime("createDate")
                .defaultTo(knex.fn.now());
        })
        .createTable("ExternalConnectionRequest", (table: Knex.TableBuilder) => {
            table
                .uuid("externalConnectionRequestId")
                .primary()
                .unique()
                .defaultTo(knex.raw("(uuid_generate_v4())"));
            table
                .uuid("externalApplicationId")
                .references("externalApplicationId")
                .inTable("ExternalApplication");
            table
                .string("authorizationCode");
            table
                .uuid("state");
            table
                .dateTime("createDate")
                .defaultTo(knex.fn.now());
        })
        .createTable("Client", (table: Knex.TableBuilder) => {
            table
                .uuid("clientId")
                .primary()
                .unique()
                .defaultTo(knex.raw("(uuid_generate_v4())"));
            table
                .string("name")
                .unique();
            table
                .dateTime("createDate")
                .defaultTo(knex.fn.now());
        })
        .createTable("RedirectUri", (table: Knex.TableBuilder) => {
            table
                .uuid("redirectUriId")
                .primary()
                .unique()
                .defaultTo(knex.raw("(uuid_generate_v4())"));
            table
                .uuid("clientId")
                .references("clientId")
                .inTable("Client");
            table
                .string("b64Uri");
            table
                .dateTime("createDate")
                .defaultTo(knex.fn.now());
        });
}

export async function down(knex: Knex): Promise<Knex.SchemaBuilder> {
    // Backup
    await knex.schema.renameTable("User", "00001_down__User");
    await knex.schema.renameTable("Role", "00001_down__Role");
    await knex.schema.renameTable("RoleAssignment", "00001_down__RoleAssignment");
    await knex.schema.renameTable("Scope", "00001_down__Scope");
    await knex.schema.renameTable("ExternalApplication", "00001_down__ExternalApplication");
    await knex.schema.renameTable("ExternalConnection", "00001_down__ExternalConnection");
    await knex.schema.renameTable(
        "ExternalConnectionRequest", "00001_down__ExternalConnectionRequest");
    await knex.schema.renameTable("Client", "00001_down__Client");
    await knex.schema.renameTable("RedirectUri", "00001_down__RedirectUri");

    // Actually downgrade
    return knex.schema
        .dropTableIfExists("User")
        .dropTableIfExists("Role")
        .dropTableIfExists("RoleAssignment")
        .dropTableIfExists("Scope")
        .dropTableIfExists("ExternalApplication")
        .dropTableIfExists("ExternalConnection")
        .dropTableIfExists("ExternalConnectionRequest")
        .dropTableIfExists("Client")
        .dropTableIfExists("RedirectUri");
}
