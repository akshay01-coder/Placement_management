import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: [true, 'Please provide a verification identifier (email or phone)'],
      trim: true,
      lowercase: true
    },
    otp: {
      type: String,
      required: [true, 'Please provide the OTP code']
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300 // Automatically deletes the document 5 minutes (300 seconds) after createdAt
    }
  }
);

const OTP = mongoose.models.OTP || mongoose.model('OTP', otpSchema);
export default OTP;
