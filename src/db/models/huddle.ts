import { Schema, model } from 'mongoose';
import { HuddleDocument } from '../../lib';

const huddleSchema = new Schema<HuddleDocument>({
  call_id: {
    type: String,
    required: true,
    unique: true,
  },
  members: {
    type: [String],
    default: null,
  },
  notificationSent: {
    type: Boolean,
    required: true,
    default: false,
  },
});

export const Huddle = model<HuddleDocument>('Huddle', huddleSchema);
