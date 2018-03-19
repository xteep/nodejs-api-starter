import { GraphQLNonNull, GraphQLInt } from 'graphql';
import {
  connectionDefinitions,
  forwardConnectionArgs,
  connectionFromArraySlice,
  cursorToOffset,
} from 'graphql-relay';

import db from '../../db';
import PlaylistType from './PlaylistType';
import type Context from '../../Context';

const playlists = {
  type: connectionDefinitions({
    name: 'Playlist',
    nodeType: PlaylistType,
    connectionFields: {
      totalCount: { type: new GraphQLNonNull(GraphQLInt) },
    },
  }).connectionType,
  args: forwardConnectionArgs,
  async resolve(root: any, args: any, ctx: Context) {
    const limit = typeof args.first === 'undefined' ? '10' : args.first;
    const offset = args.after ? cursorToOffset(args.after) + 1 : 0;

    const [data, totalCount] = await Promise.all([
      db
        .table('playlists')
        .orderBy('created_at', 'desc')
        .limit(limit)
        .offset(offset)
        .then(rows => {
          rows.forEach(x => ctx.playlistById.prime(x.id, x));
          return rows;
        }),
      db
        .table('playlists')
        .count()
        .then(x => x[0].count),
    ]);

    return {
      ...connectionFromArraySlice(data, args, {
        sliceStart: offset,
        arrayLength: totalCount,
      }),
      totalCount,
    };
  },
};

export default {
  playlists,
};
