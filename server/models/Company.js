import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide the company name'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide a company description']
    },
    jobDescription: {
      type: String,
      required: [true, 'Please provide the job description']
    },
    role: {
      type: String,
      required: [true, 'Please provide the placement role'],
      trim: true
    },
    packageLpa: {
      type: String, // e.g. "22 LPA" or "8 LPA"
      required: [true, 'Please provide the compensation package']
    },
    location: {
      type: String,
      required: [true, 'Please provide the job location'],
      trim: true
    },
    visitDate: {
      type: Date,
      required: [true, 'Please provide the visit date']
    },
    cgpa: {
      type: Number, // Minimum CGPA requirement
      required: [true, 'Please provide the minimum CGPA cutoff'],
      default: 0
    },
    skills: {
      type: [String], // Required skills, e.g. ['React', 'Python']
      default: []
    },
    courses: {
      type: [String], // Eligible courses, e.g. ['BTech', 'BCA', 'MCA']
      default: []
    },
    rounds: [
      {
        id: { type: Number },
        name: { type: String }
      }
    ], // Selection Rounds, e.g. [{id: 1, name: 'Aptitude'}, {id: 2, name: 'Technical'}]
    lastDateToApply: {
      type: Date
    },
    minClass10Percentage: {
      type: Number,
      default: 0
    },
    minClass12Percentage: {
      type: Number,
      default: 0
    },
    logo: {
      type: String, // Path to company logo file
      default: ''
    },
    status: {
      type: String,
      enum: ['Active', 'Closed'],
      default: 'Active'
    },
    category: {
      type: String,
      enum: ['Tech', 'Sales', 'Other'],
      default: 'Tech'
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

const Company = mongoose.model('Company', companySchema);
export default Company;
