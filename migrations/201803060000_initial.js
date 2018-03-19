/**
 * Copyright © 2016-present Kriasoft.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

// Create database schema for storing user accounts, logins and authentication claims/tokens
// Source https://github.com/membership/membership.db
// prettier-ignore
module.exports.up = async db => {
  // User accounts
  await db.schema.createTable('users', table => {
    // UUID v1mc reduces the negative side effect of using random primary keys
    // with respect to keyspace fragmentation on disk for the tables because it's time based
    // https://www.postgresql.org/docs/current/static/uuid-ossp.html
    table.uuid('id').notNullable().defaultTo(db.raw('uuid_generate_v1mc()')).primary();
    table.string('display_name', 100);
    table.string('photo', 200);
    table.timestamps(false, true);
  });

  // External logins with security tokens (e.g. Google, Facebook, Twitter)
  await db.schema.createTable('logins', table => {
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
    table.string('provider', 16).notNullable();
    table.string('id', 36).notNullable();
    table.string('username', 100);
    table.jsonb('tokens').notNullable();
    table.jsonb('profile').notNullable();
    table.timestamps(false, true);
    table.primary(['provider', 'id']);
  });

  await db.schema.createTable('playlists', table => {
    table.uuid('id').notNullable().defaultTo(db.raw('uuid_generate_v1mc()')).primary();
    table.string('title', 200).notNullable();
    table.string('thumbnail', 200).notNullable();
    table.string('description', 200).notNullable();
    table.timestamps(false, true);
  });

  await db.schema.createTable('videos', table => {
    table.uuid('id').notNullable().defaultTo(db.raw('uuid_generate_v1mc()')).primary();
    table.string('title', 200).notNullable();
    table.string('url', 200).notNullable();
    table.string('thumbnail', 200).notNullable();
    table.string('description', 200).notNullable();
    table.uuid('playlist').references('id').inTable('playlists').onDelete('CASCADE').onUpdate('CASCADE');
    table.timestamps(false, true);
  });

  await db.schema.createTable('progresses', table => {
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
    table.uuid('video_id').notNullable().references('id').inTable('videos').onDelete('CASCADE').onUpdate('CASCADE');
    table.integer('progress').defaultTo(0).notNullable();
    table.timestamps(false, true);
    table.primary(['user_id', 'video_id']);
  });
};

module.exports.down = async db => {
  await db.schema.dropTableIfExists('logins');
  await db.schema.dropTableIfExists('users');
  await db.schema.dropTableIfExists('playlists');
  await db.schema.dropTableIfExists('videos');
  await db.schema.dropTableIfExists('progresses');
};

module.exports.configuration = { transaction: true };
