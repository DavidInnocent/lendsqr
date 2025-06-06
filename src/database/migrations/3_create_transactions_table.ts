import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('transactions', (table) => {
        table.increments('id').primary();
        table
            .integer('walletId')
            .notNullable()
            .references('id')
            .inTable('wallets')
            .onDelete('CASCADE');

        table.decimal('amount', 14, 2).notNullable().checkPositive('amount');
        table
            .enum('type', ['fund', 'transfer', 'withdraw'], {
                useNative: true,
                enumName: 'transaction_type_enum'
            })
            .notNullable();

        table.string('reference', 50).notNullable().unique();
        table
            .enum('status', ['pending', 'completed', 'failed'], {
                useNative: true,
                enumName: 'transaction_status_enum'
            })
            .defaultTo('completed');

        table.jsonb('metadata').nullable();
        table.timestamps(true, true);

        // Indexes for performance
        table.index(['walletId'], 'transactions_walletId_index');
        table.index(['reference'], 'transactions_reference_index');
        table.index(['created_at'], 'transactions_createdAt_index');
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('transactions')
        .raw('DROP TYPE IF EXISTS transaction_type_enum')
        .raw('DROP TYPE IF EXISTS transaction_status_enum');
}
