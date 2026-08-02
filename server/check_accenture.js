import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
  if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
  }
} catch (dnsErr) {
}

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB.');

    // Define temporary schemas
    const UserSchema = new mongoose.Schema({}, { strict: false });
    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    const CompanySchema = new mongoose.Schema({}, { strict: false });
    const Company = mongoose.models.Company || mongoose.model('Company', CompanySchema);

    // Fetch the added Accenture company
    console.log('\nFetching Accenture companies...');
    const accentures = await Company.find({ name: /Accenture/i });
    if (accentures.length === 0) {
      console.log('No Accenture company found!');
      process.exit(0);
    }

    const company = accentures[accentures.length - 1]; // Get latest one
    console.log('Found Accenture details:', {
      name: company.name,
      cgpa: company.cgpa,
      minClass10: company.minClass10Percentage,
      minClass12: company.minClass12Percentage,
      courses: company.courses,
      createdAt: company.createdAt
    });

    const cutoffCgpa = parseFloat(company.cgpa) || 0;
    const cutoff10th = parseFloat(company.minClass10Percentage) || 0;
    const cutoff12th = parseFloat(company.minClass12Percentage) || 0;
    const coursesArray = company.courses || [];

    const allVerifiedStudents = await User.find({ role: 'student', isVerified: true });
    console.log(`\nTotal verified students: ${allVerifiedStudents.length}`);

    const eligibleStudents = allVerifiedStudents.filter((student) => {
      const studentCgpa = parseFloat(student.cgpa) || 0;
      const class10Pct = parseFloat(student.educationalDetails?.class10?.percentage) || 0;
      const class12Pct = parseFloat(student.educationalDetails?.class12?.percentage) || 0;

      console.log(`Checking student: ${student.name} (${student.email})`);
      console.log(`  CGPA: ${studentCgpa} >= ${cutoffCgpa} -> ${studentCgpa >= cutoffCgpa}`);
      console.log(`  10th%: ${class10Pct} >= ${cutoff10th} -> ${class10Pct >= cutoff10th}`);
      console.log(`  12th%: ${class12Pct} >= ${cutoff12th} -> ${class12Pct >= cutoff12th}`);
      if (coursesArray.length > 0) {
        console.log(`  Course: ${student.course} in ${JSON.stringify(coursesArray)} -> ${coursesArray.includes(student.course)}`);
      }

      if (studentCgpa < cutoffCgpa) return false;
      if (class10Pct < cutoff10th) return false;
      if (class12Pct < cutoff12th) return false;
      if (coursesArray.length > 0) {
        if (!student.course || !coursesArray.includes(student.course)) return false;
      }
      return true;
    });

    console.log(`\nEligible students count: ${eligibleStudents.length}`);
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
};

run();
