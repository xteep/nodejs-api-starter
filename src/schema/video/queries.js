import { GraphQLID, GraphQLNonNull } from 'graphql';
import { fromGlobalId } from 'graphql-relay';
import VideoType from './VideoType';
import type Context from '../../Context';

const video = {
  type: VideoType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve(root: any, args: any, ctx: Context) {
    return ctx.videoById.load(fromGlobalId(args.id).id);
  },
};

export default {
  video,
};
