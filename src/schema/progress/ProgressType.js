/* @flow */

import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { globalIdField } from 'graphql-relay';

import { nodeInterface } from '../node';
import type Context from '../../Context';
import UserType from '../user/UserType';
import VideoType from '../video/VideoType';

export default new GraphQLObjectType({
  name: 'Progress',
  interfaces: [nodeInterface],

  fields: {
    id: globalIdField(),

    user: {
      type: new GraphQLNonNull(UserType),
      resolve(parent, args, ctx: Context) {
        return ctx.userById.load(parent.user_id);
      },
    },

    video: {
      type: new GraphQLNonNull(VideoType),
      resolve(parent, args, ctx: Context) {
        return ctx.videoById.load(parent.video_id);
      },
    },


  },
});
