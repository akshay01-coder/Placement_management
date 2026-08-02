import mongoose from 'mongoose';
import User from '../models/User.js';
import dns from 'dns';

// Configure DNS to bypass local router DNS resolution failures
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
  if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
  }
} catch (dnsErr) {
  console.warn('DNS override warning:', dnsErr.message);
}

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin111@gmail.com' });
    if (!adminExists) {
      await User.create({
        name: 'Placement Officer',
        email: 'admin111@gmail.com',
        password: 'password123',
        role: 'admin',
        isVerified: true
      });
      console.log('Seeded default Admin account successfully (admin111@gmail.com / password123)');
    }

    const studentExists = await User.findOne({ email: 'akshaypatidar244@gmail.com' });
    if (!studentExists) {
      await User.create({
        name: 'Akshay Patidar',
        email: 'akshaypatidar244@gmail.com',
        password: 'password123',
        role: 'student',
        course: 'BTech',
        department: 'CSE',
        cgpa: 8.5,
        skills: ['React', 'Node.js', 'CSS', 'JavaScript'],
        resume: '/uploads/sample_resume.pdf',
        isVerified: true
      });
      console.log('Seeded default Student account successfully (akshaypatidar244@gmail.com / password123)');
    }
  } catch (error) {
    console.error(`Failed to seed default database users: ${error.message}`);
  }
};

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected Successfully (Atlas Host: ${conn.connection.host})`);
    await seedAdmin();
  } catch (error) {
    console.error(`\n❌ [DATABASE CONNECTION ERROR] Failed to connect to MongoDB Atlas!`);
    console.error(`Error detail: ${error.message}`);
    console.error(`\n⚠️  Please perform the following checklist:`);
    console.error(`1. Network Access (IP Whitelist): Log in to MongoDB Atlas -> Network Access -> Add your current IP address (or set to 0.0.0.0/0 to allow connections from anywhere).`);
    console.error(`2. Database User Credentials: Ensure the username and password in MONGODB_URI inside server/.env are correct and the user has readWrite permissions.`);
    console.error(`3. Firewall / Port Restriction: Make sure your local internet network doesn't block outgoing connections to port 27017.`);
    console.error(`\nThe application process will now exit because a valid MongoDB Atlas connection is mandatory.\n`);
    process.exit(1);
  }
};

export default connectDB;
