/* @flow */

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt,
} from 'graphql';
import { globalIdField } from 'graphql-relay';

import { nodeInterface } from '../node';
import type Context from '../../Context';

export default new GraphQLObjectType({
  name: 'Video',
  interfaces: [nodeInterface],

  fields: {
    id: globalIdField(),

    title: {
      type: new GraphQLNonNull(GraphQLString),
    },

    url: {
      type: new GraphQLNonNull(GraphQLString),
    },

    thumbnail: {
      type: new GraphQLNonNull(GraphQLString),
    },

    description: {
      type: new GraphQLNonNull(GraphQLString),
    },

    progress: {
      type: GraphQLInt,
      resolve(parent, args, ctx: Context) {
        if (!ctx.user) {
          return 0;
        }
        return ctx.progressByUserIdAndVideoId.load(ctx.user.id, parent.id);
      },
    },
  },
});
