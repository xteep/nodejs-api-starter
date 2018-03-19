/* @flow */

import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { globalIdField } from 'graphql-relay';

import VideoType from '../video/VideoType';
import { nodeInterface } from '../node';
import type Context from '../../Context';

export default new GraphQLObjectType({
  name: 'Playlist',
  interfaces: [nodeInterface],

  fields: {
    id: globalIdField(),

    title: {
      type: new GraphQLNonNull(GraphQLString),
    },

    thumbnail: {
      type: new GraphQLNonNull(GraphQLString),
    },

    description: {
      type: new GraphQLNonNull(GraphQLString),
    },

    videos: {
      type: new GraphQLList(VideoType),
      resolve(parent, args, ctx: Context) {
        return ctx.videosByPlaylistId.load(parent.id);
      },
    },
  },
});
