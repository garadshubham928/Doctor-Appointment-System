const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const nodemailer = require('nodemailer'); // Add this package

const PORT = 4000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Database connection
const db = mysql.createConnection({
   host: 'sql12.freesqldatabase.com',
    user: 'sql12800076',
    password: 'zUkXmvZLR7',
    database: 'sql12800076',
});

db.connect(err => {
  if (err) throw err;
  console.log('MYSQL Connected...');
});

// ✅ Use promise wrapper for async/await
const dbPromise = db.promise();

// Email configuration (Gmail example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'garadshubham928@gmail.com', // Replace with your email
    pass: 'cxiu udny jrcw asrz'     // Replace with your app password
  }
});

// Function to send email
async function sendAppointmentEmail(patientEmail, doctorEmail, appointmentDetails) {
  const patientMailOptions = {
    from: 'garadshubham928@gmail.com',
    to: patientEmail,
    subject: 'Appointment Confirmation - Zeromedixine Health',
    html: `
      <h2>Appointment Confirmed!</h2>
      <p>Dear ${appointmentDetails.patientName},</p>
      <p>Your appointment has been successfully booked with <strong>Dr. ${appointmentDetails.doctorName}</strong></p>
      <p><strong>Details:</strong></p>
      <ul>
        <li>Date: ${appointmentDetails.date}</li>
        <li>Time: ${appointmentDetails.time}</li>
        <li>Reason: ${appointmentDetails.reason}</li>
        <li>Hospital: ${appointmentDetails.hospital}</li>
      </ul>
      <p>Thank you for choosing HealthCare!</p>
    `
  };

  const doctorMailOptions = {
    from: 'garadshubham928@gmail.com',
    to: doctorEmail || 'doctor@healthcare.com ', // Fallback email
    subject: 'New Appointment Booking - Zeromedixine Health',
    html: `
      <h2>New Appointment Booked</h2>
      <p>Dear Dr. ${appointmentDetails.doctorName},</p>
      <p>A new appointment has been booked with you.</p>
      <p><strong>Patient Details:</strong></p>
      <ul>
        <li>Name: ${appointmentDetails.patientName}</li>
        <li>Email: ${appointmentDetails.email}</li>
        <li>Phone: ${appointmentDetails.phone}</li>
        <li>Date: ${appointmentDetails.date}</li>
        <li>Time: ${appointmentDetails.time}</li>
        <li>Reason: ${appointmentDetails.reason}</li>
      </ul>
    `
  };

  try {
    await transporter.sendMail(patientMailOptions);
    await transporter.sendMail(doctorMailOptions);
    console.log('✅ Emails sent successfully');
  } catch (error) {
    console.error('❌ Email sending failed:', error);
  }
}

// Fetch all models (doctors)
app.get('/api/models', async (req, res) => {
  try {
    const [results] = await dbPromise.query('SELECT * FROM models');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add model (doctor)
app.post('/api/models', async (req, res) => {
  const { model_name, rating, price, category, photo, model_experience, model_hospital } = req.body;
  const sql = "INSERT INTO models (model_name, rating, price, category, photo, model_experience, model_hospital) VALUES (?, ?, ?, ?, ?, ?, ?)";
  try {
    const [result] = await dbPromise.query(sql, [model_name, rating, price, category, photo, model_experience, model_hospital]);
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update model (doctor)
app.put('/api/models/:id', async (req, res) => {
  const { model_name, rating, price, category, photo, model_experience, model_hospital } = req.body;
  const { id } = req.params;
  const sql = `
    UPDATE models 
    SET model_name=?, rating=?, price=?, category=?, photo=?, model_experience=?, model_hospital=? 
    WHERE id=?`;
  try {
    await dbPromise.query(sql, [model_name, rating, price, category, photo, model_experience, model_hospital, id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete model (doctor)
app.delete('/api/models/:id', async (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM models WHERE id=?";
  try {
    await dbPromise.query(sql, [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Create appointment with conflict detection
app.post("/api/appointments", async (req, res) => {
  const { doctorId, patientName, email, phone, reason, date, time } = req.body;
  
  if (!doctorId || !patientName || !email || !phone || !date || !time) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // 🔍 Check if doctor already has an appointment at the same date and time
    const conflictCheckSql = "SELECT * FROM appointments WHERE doctor_id = ? AND date = ? AND time = ?";
    const [existingAppointments] = await dbPromise.query(conflictCheckSql, [doctorId, date, time]);
    
    if (existingAppointments.length > 0) {
      return res.status(409).json({ 
        error: "Doctor is already booked at this time. Please select a different time slot.",
        conflict: true 
      });
    }

    // ✅ No conflict, proceed with booking
    const insertSql = "INSERT INTO appointments (doctor_id, patient_name, email, phone, reason, date, time) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const [result] = await dbPromise.query(insertSql, [doctorId, patientName, email, phone, reason || '', date, time]);
    
    // 📧 Get doctor details for email
    const doctorSql = "SELECT * FROM models WHERE id = ?";
    const [doctorResults] = await dbPromise.query(doctorSql, [doctorId]);
    const doctor = doctorResults[0];

    // 📧 Send confirmation emails
    if (doctor) {
      const appointmentDetails = {
        patientName,
        email,
        phone,
        reason,
        date,
        time,
        doctorName: doctor.model_name,
        hospital: doctor.model_hospital
      };
      
      // Send emails (non-blocking)
      sendAppointmentEmail(email, doctor.email || null, appointmentDetails);
    }

    res.json({ 
      success: true, 
      id: result.insertId, 
      message: "Appointment booked successfully! Confirmation emails have been sent." 
    });
    
  } catch (err) {
    console.error("Error creating appointment:", err);
    res.status(500).json({ error: "Database error: " + err.message });
  }
});

// ✅ Get all appointments with doctor details (FIXED VERSION)
app.get("/api/appointments", (req, res) => {
  const appointmentQuery = "SELECT * FROM appointments ORDER BY date DESC, time DESC";
  
  db.query(appointmentQuery, (err, appointmentResults) => {
    if (err) {
      console.error("❌ Error fetching appointments:", err);
      return res.status(500).json({ error: err.message });
    }
    
    console.log(`✅ Found ${appointmentResults.length} appointments`);
    
    if (appointmentResults.length === 0) {
      return res.json([]);
    }
    
    const doctorIds = [...new Set(appointmentResults.map(a => a.doctor_id).filter(id => id))];
    
    if (doctorIds.length === 0) {
      const appointmentsWithoutDoctors = appointmentResults.map(apt => ({
        id: apt.id,
        patientName: apt.patient_name,
        email: apt.email,
        phone: apt.phone,
        reason: apt.reason,
        date: apt.date,
        time: apt.time,
        doctor_id: apt.doctor_id,
        doctor: null
      }));
      return res.json(appointmentsWithoutDoctors);
    }
    
    const doctorQuery = `SELECT * FROM models WHERE id IN (${doctorIds.map(() => '?').join(',')})`;
    
    db.query(doctorQuery, doctorIds, (doctorErr, doctorResults) => {
      if (doctorErr) {
        console.error("❌ Error fetching doctors:", doctorErr);
        const appointmentsWithoutDoctors = appointmentResults.map(apt => ({
          id: apt.id,
          patientName: apt.patient_name,
          email: apt.email,
          phone: apt.phone,
          reason: apt.reason,
          date: apt.date,
          time: apt.time,
          doctor_id: apt.doctor_id,
          doctor: null
        }));
        return res.json(appointmentsWithoutDoctors);
      }
      
      const doctorsMap = {};
      doctorResults.forEach(doctor => {
        doctorsMap[doctor.id] = doctor;
      });
      
      const finalAppointments = appointmentResults.map(appointment => ({
        id: appointment.id,
        patientName: appointment.patient_name,
        email: appointment.email,
        phone: appointment.phone,
        reason: appointment.reason,
        date: appointment.date,
        time: appointment.time,
        doctor_id: appointment.doctor_id,
        doctor: doctorsMap[appointment.doctor_id] || null
      }));
      
      console.log(`📤 Sending ${finalAppointments.length} appointments with doctor details`);
      res.json(finalAppointments);
    });
  });
});

// ✅ Update appointment (Reschedule)
app.put("/api/appointments/:id", async (req, res) => {
  const { id } = req.params;
  const { date, time } = req.body;

  try {
    const [result] = await dbPromise.query(
      "UPDATE appointments SET date=?, time=? WHERE id=?",
      [date, time, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error rescheduling appointment:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete appointment (Cancel)
app.delete("/api/appointments/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await dbPromise.query("DELETE FROM appointments WHERE id=?", [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error canceling appointment:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Registration backend route
app.post("/api/userinfo/insert", (req, res) => {
  const { Email, PassWord } = req.body;

  if (!Email || !PassWord) {
    return res.status(400).json({ error: "Email and Password are required" });
  }

  const query = `
    INSERT INTO userinfo (Email, PassWord)
    VALUES (?, ?)
  `;

  db.query(query, [Email, PassWord], (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "✅ User Registered Successfully", id: result.insertId });
  });
});

// NEW USER LOGIN
app.post('/api/userinfo/login', (req, res) => {
  const { Email, PassWord } = req.body;

  const query = `SELECT * FROM userinfo WHERE Email = ? AND PassWord = ?`;
  db.query(query, [Email, PassWord], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    
    if (results.length > 0) {
      res.json({ success: true, user: results[0] });
    } else {
      res.status(401).json({ success: false, message: 'Wrong credentials' });
    }
  });
});

// DEPARTMENT LOGIN SECTION 
app.post('/api/doctors/login', (req, res) => {
  const { Email, PassWord } = req.body;

  const query = `SELECT * FROM doctor WHERE Email = ? AND PassWord = ?`;
  db.query(query, [Email, PassWord], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    
    if (results.length > 0) {
      res.json({ success: true, user: results[0] });
    } else {
      res.status(401).json({ success: false, message: 'Wrong credentials' });
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});