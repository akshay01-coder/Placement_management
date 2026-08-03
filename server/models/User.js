import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true
    },
    email: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      match: [/^(\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+)?$/, 'Please provide a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false // Exclude password from query results by default
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student'
    },
    course: {
      type: String,
      default: ''
    },
    department: {
      type: String,
      default: ''
    },
    cgpa: {
      type: Number,
      default: 0
    },
    skills: {
      type: [String],
      default: []
    },
    resume: {
      type: String, // Path to resume PDF
      default: ''
    },
    profilePhoto: {
      type: String, // Path to profile image
      default: ''
    },
    phone: {
      type: String,
      trim: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    educationalDetails: {
      class10: {
        schoolName: { type: String, default: '' },
        board: { type: String, default: '' },
        percentage: { type: Number, default: 0 },
        location: { type: String, default: '' },
        marksheet: { type: String, default: '' }
      },
      class12: {
        schoolName: { type: String, default: '' },
        board: { type: String, default: '' },
        percentage: { type: Number, default: 0 },
        location: { type: String, default: '' },
        marksheet: { type: String, default: '' }
      },
      college: {
        semesters: [
          {
            semesterNumber: { type: Number },
            sgpa: { type: Number, default: 0 },
            marksheet: { type: String, default: '' }
          }
        ],
        totalBacklogs: { type: Number, default: 0 },
        ongoingBacklogs: { type: Number, default: 0 }
      }
    }
  },
  {
    timestamps: true // Automatically creates createdAt and updatedAt fields
  }
);

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
