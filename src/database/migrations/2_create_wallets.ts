import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('wallets', table => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable().unique();
        table.decimal('balance', 15, 2).notNullable().defaultTo(0);
        table.timestamps(true, true);

        table.foreign('user_id').references('id').inTable('users');
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('wallets');
}