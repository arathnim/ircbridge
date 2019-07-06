exports.down = knex =>
  Promise.all([
    knex.schema.dropTableIfExists('accessKeys'),
    knex.schema.dropTableIfExists('users_in_channels'),
    knex.schema.dropTableIfExists('messages'),
    knex.schema.dropTableIfExists('channels'),
    knex.schema.dropTableIfExists('servers'),
    knex.schema.dropTableIfExists('accounts'),
  ])

exports.up = knex =>
  Promise.all([
    knex.schema
      .createTable('accounts', table => {
        table.increments('accountID').primary()
        table.string('username')
        table.string('email')
        table.string('passwordHash', 1024)
        table.string('nonce')
    }),
    knex.schema
      .createTable('accessKeys', table => {
        table.string('value').primary()
        table.integer('accountID')
        table.foreign('accountID').references('accountID').inTable('accounts')
    }),
    knex.schema
      .createTable('servers', table => {
        table.increments('serverID').primary()
        table.string('name')
        table.string('url')
        table.boolean('ssl')
    }),
    knex.schema
      .createTable('channels', table => {
        table.increments('channelID').primary()
        table.string('name')
        table.string('topic', 500)
        table.integer('serverID')
        table.foreign('serverID').references('serverID').inTable('servers')
    }),
    knex.schema
      .createTable('users_in_channels', table => {
        table.integer('channelID')
        table.foreign('channelID').references('channelID').inTable('channels')
        table.integer('accountID')
        table.foreign('accountID').references('accountID').inTable('accounts')
    }),
    knex.schema
      .createTable('messages', table => {
        table.integer('messageID')
        table.string('author', 128)
        table.text('value')
        table.integer('channelID')
        table.foreign('channelID').references('channelID').inTable('channels')
    }),
  ])
