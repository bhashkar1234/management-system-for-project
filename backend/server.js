require('dotenv').config({ path: './.env' });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

// Create default admin if not exists
const createDefaultAdmin = async () => {
  const admin = await Admin.findOne({ username: 'admin' });
  if (!admin) {
    const admin = new Admin({
      username: 'admin',
      password: 'admin123',
      role: 'admin'
    });
    await admin.save();
    console.log('Default admin created successfully');
    await admin.save();
  }
};

createDefaultAdmin();
const userRoutes = require('./routes/userRoutes');
const communicationMethodRoutes = require('./routes/communicationMethodRoutes');
const companyRoutes = require('./routes/companyRoutes'); // Import company routes
const communicationRoutes = require('./routes/communicationRoutes');


const app = express();

const url= process.env.MONGODB_URL;



app.use(cors());
app.use(express.json());

app.use('/api/companies',  companyRoutes); 
app.use('/api', userRoutes);
app.use('/api/communication-methods', communicationMethodRoutes);
app.use('/api/communications', communicationRoutes);

// Admin routes
const adminRouter = require('./routes/adminRoutes');
app.use('/admin', adminRouter);


const PORT = process.env.PORT || 5000;

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch((error) => {
    console.error('Database connection error:', error);
});

