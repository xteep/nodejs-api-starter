/* @flow */

import { GraphQLID, GraphQLInt } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';

import db from '../../db';
import validate from './validate';
import ProgressType from './ProgressType';
import { ValidationError } from '../../errors';
import type Context from '../../Context';

const inputFields = {
  videoId: {
    type: GraphQLID,
  },
  progress: {
    type: GraphQLInt,
  },
};

const outputFields = {
  progress: {
    type: ProgressType,
  },
};

const createOrUpdateProgress = mutationWithClientMutationId({
  name: 'CreateOrUpdateProgress',
  inputFields,
  outputFields,
  async mutateAndGetPayload(input: any, ctx: Context) {
    ctx.ensureIsAuthenticated();
    const { data, errors } = validate(input, ctx);
    if (errors.length) {
      throw new ValidationError(errors);
    }
    await db.raw(
      'INSERT INTO progresses (user_id, video_id, progress) values (?, ?, ?) ON DUPLICATE KEY UPDATE progress=?',
      [ctx.user.id, data.videoId, data.progress, data.progress],
    )
    return ctx.progressByUserIdAndVideoId.load(ctx.user.id, data.videoId);
  },
});

export default {
  createOrUpdateProgress,
};
