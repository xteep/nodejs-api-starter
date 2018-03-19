/**
 * Copyright © 2016-present Kriasoft.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

import DataLoader from 'dataloader';
import type { request as Request } from 'express';
import type { t as Translator } from 'i18next';

import db from './db';
import { mapTo, mapToMany, mapToValues } from './utils';
import { UnauthorizedError } from './errors';

class Context {
  request: Request;
  user: any;
  t: Translator;

  constructor(request: Request) {
    this.request = request;
    this.t = request.t;
  }

  get user(): any {
    return this.request.user;
  }

  /*
   * Data loaders to be used with GraphQL resolve() functions. For example:
   *
   *   resolve(post: any, args: any, { userById }: Context) {
   *     return userById.load(post.author_id);
   *   }
   *
   * For more information visit https://github.com/facebook/dataloader
   */

  videoById = new DataLoader(keys =>
    db
      .table('videos')
      .whereIn('id', keys)
      .select()
      .then(mapTo(keys, x => x.id)),
  );

  videosByPlaylistId = new DataLoader(keys =>
    db
      .table('videos')
      .whereIn('playlist', keys)
      .select()
      .then(mapToMany(keys, x => x.playlist)),
  );

  playlistById = new DataLoader(keys =>
    db
      .table('playlists')
      .whereIn('id', keys)
      .select()
      .then(mapTo(keys, x => x.id)),
  );

  progressByUserIdAndVideoId = {
    load: (userId, videoId) =>
      db
        .table('progresses')
        .where({
          user_id: userId,
          video_id: videoId,
        })
        .select()
        .then(rows => (rows[0] ? rows[0].progress : 0)),
  };

  userById = new DataLoader(keys =>
    db
      .table('users')
      .whereIn('id', keys)
      .select()
      .then(mapTo(keys, x => x.id)),
  );

  /*
   * Authenticatinon and permissions.
   */

  ensureIsAuthenticated() {
    if (!this.user) throw new UnauthorizedError();
  }
}

export default Context;
