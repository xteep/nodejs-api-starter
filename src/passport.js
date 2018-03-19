/**
 * Copyright © 2016-present Kriasoft.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */
/* eslint-disable no-param-reassign, no-underscore-dangle, max-len */

import db from './db';

const loginCallback = async (request, sess) => {
  const { userInfo } = sess;
  const user = await db
    .table('logins')
    .where({
      id: userInfo.unionId || userInfo.openId,
      provider: 'wechat_miniapp',
    })
    .select('user_id')
    .then(rows => {
      if (!rows || rows.length === 0) {
        return db
          .table('users')
          .insert({
            display_name: userInfo.nickName,
            photo: userInfo.avatarUrl,
          })
          .returning('id')
          .then(id =>
            db
              .table('logins')
              .insert({
                id: userInfo.unionId || userInfo.openId,
                user_id: id,
                provider: 'wechat_miniapp',
                display_name: userInfo.nickName,
                photo: userInfo.avatarUrl,
              })
              .select('user_id'),
          );
      }
      return rows[0].user_id;
    })
    .then(id =>
      db
        .table('users')
        .where({ id })
        .select()
        .then(rows => rows[0]),
    );
  request.user = user;
};

const session = (req, res, next) => {
  if (!req.user && req.session && !req.session.user && req.session.userInfo) {
    const user = db
      .table('logins')
      .where({
        id: req.session.userInfo.unionId || req.session.userInfo.openId,
        provider: 'wechat_miniapp',
      })
      .select('user_id')
      .then(rows => {
        const id = rows[0].user_id;
        return db
          .table('users')
          .where({
            id,
          })
          .select();
      })
      .then(rows => rows[0]);
    req.user = user;
  }
  next();
};

export default {
  loginCallback,
  session,
};
