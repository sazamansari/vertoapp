import mongoose from 'mongoose';

export interface IOTP extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  otp: string;
  expiresAt: Date;
  attempts: number;
  createdAt: Date;
}

const OTPSchema = new mongoose.Schema<IOTP>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: '5m' } // TTL index automatically deletes expired docs
  },
  attempts: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

export const OTP = mongoose.models.OTP || mongoose.model<IOTP>('OTP', OTPSchema);
