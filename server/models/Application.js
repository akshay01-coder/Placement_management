import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student reference is required']
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company reference is required']
    },
    appliedDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Pending', 'Shortlisted', 'Rejected', 'Selected'],
      default: 'Pending'
    },
    currentRoundIndex: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Ensure a student can only apply to a specific company once
applicationSchema.index({ studentId: 1, companyId: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);
export default Application;
