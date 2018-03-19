/**
 * Copyright © 2016-present Kriasoft.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

import { GraphQLSchema, GraphQLObjectType } from 'graphql';

import playlistQueries from './playlist/queries';
import videoQueries from './video/queries';
import progressMutations from './progress/mutations';
import { nodeField, nodesField } from './node';

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      node: nodeField,
      nodes: nodesField,
      ...playlistQueries,
      ...videoQueries,
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      ...progressMutations,
    },
  }),
});
