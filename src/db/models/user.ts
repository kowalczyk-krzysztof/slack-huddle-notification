import { Schema, model } from 'mongoose'
import { UserDocument } from '../../lib/types'

const userSchema = new Schema<UserDocument>({
  user_id: {
    type: String,
    required: true,
    unique: true,
  },
  isSubscribing: {
    type: Boolean,
    required: true,
    default: false,
  },
})

export const User = model<UserDocument>('User', userSchema)
