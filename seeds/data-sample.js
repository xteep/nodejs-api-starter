/**
 * Copyright © 2016-present Kriasoft.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable no-restricted-syntax, no-await-in-loop */

const faker = require('faker');

module.exports.seed = async db => {
  // Create 10 random website users (as an example)
  const users = Array.from({ length: 10 }).map(() => ({
    display_name: faker.name.findName(),
    photo: faker.internet.avatar(),
  }));

  await Promise.all(
    users.map(user =>
      db
        .table('users')
        .insert(user)
        .returning('id')
        .then(rows =>
          db
            .table('users')
            .where('id', '=', rows[0])
            .first()
            .then(u =>
              db
                .table('logins')
                .insert({
                  user_id: u.id,
                  provider: 'test',
                  id: faker.random.uuid(),
                  username: faker.name.findName(),
                  tokens: {
                    access_token: faker.random.uuid(),
                    refresh_token: faker.random.uuid(),
                  },
                  profile: {
                    desc: faker.random.words(),
                  },
                })
                .then(() => u),
            ),
        )
        .then(row => Object.assign(user, row)),
    ),
  );

  const playlists = Array.from({ length: 5 }).map(() => ({
    title: faker.lorem.word(),
    thumbnail: faker.internet.avatar(),
    description: faker.lorem.sentence(),
  }));

  await Promise.all(
    playlists.map(playlist =>
      db
        .table('playlists')
        .insert(playlist)
        .returning('id')
        .then(rows =>
          db
            .table('playlists')
            .where('id', '=', rows[0])
            .first()
            .then(u => {
              Promise.all(
                Array.from({ length: 10 }).map(() =>
                  db.table('videos').insert({
                    title: faker.random.words(),
                    url: faker.internet.url(),
                    thumbnail: faker.image.imageUrl(),
                    description: faker.random.words(),
                    playlist: u.id,
                  }),
                ),
              );
            }),
        ),
    ),
  );
};
