const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// --- IN-MEMORY DATA STORES ---

// 1. Registered Students Data
let registeredStudentsList = [
    {
        id: 'BSA-2026-001',
        firstName: 'Abebe',
        fatherName: 'Kebede',
        grandfatherName: 'Alemu',
        fullName: 'Abebe Kebede Alemu',
        email: 'abebe.k@gmail.com',
        phone: '+251 911 223344',
        guardianName: 'Kebede Alemu',
        guardianPhone: '+251 911 000000',
        address: 'Addis Ababa, Bole Sub-City',
        password: 'password123',
        registeredAt: '2026-09-05'
    }
];

// 2. Contact Form Messages Data
let messagesList = [
    {
        id: 1,
        sender: 'Sample Parent',
        email: 'parent@example.com',
        subject: 'Inquiry about Grade 9 Admissions',
        body: 'Hello, I would like to know when the entrance exams for Grade 9 will be held.',
        date: '2026-09-04'
    }
];


// Default Route
app.get('/', (req, res) => {
    res.send('Beteseb Academy API Server is running.');
});

// --- STUDENT REGISTRATION ENDPOINTS ---

// GET: Retrieve all registered students for Admin Panel
app.get('/api/register-student', (req, res) => {
    res.json(registeredStudentsList);
});

// POST: Register a new student from frontend registration modal
app.post('/api/register-student', (req, res) => {
    const { 
        firstName, 
        fatherName, 
        grandfatherName, 
        studentId, 
        email, 
        phone, 
        guardianName, 
        guardianPhone, 
        address, 
        password 
    } = req.body;

    // Basic Validation for Required Fields
    if (!firstName || !fatherName || !studentId || !email || !password) {
        return res.status(400).json({ error: 'Please fill in required fields.' });
    }

    // Combine Full Name
    const fullName = `${firstName} ${fatherName} ${grandfatherName || ''}`.trim();

    // Create New Student Object
    const newStudent = {
        id: studentId,
        firstName,
        fatherName,
        grandfatherName,
        fullName,
        email,
        phone,
        guardianName,
        guardianPhone,
        address,
        password,
        registeredAt: new Date().toISOString().split('T')[0]
    };

    // Store in Array (at top of list)
    registeredStudentsList.unshift(newStudent);

    // Send Success Response
    res.status(201).json({ 
        message: 'Student registered successfully', 
        data: newStudent 
    });
});


// --- MESSAGES ENDPOINTS (Contact Form) ---

// GET: Retrieve all messages for Admin Panel
app.get('/api/messages', (req, res) => {
    res.json(messagesList);
});

// POST: Receive new message from frontend contact form
app.post('/api/messages', (req, res) => {
    const { sender, email, subject, body } = req.body;
    
    if (!sender || !email || !body) {
         return res.status(400).json({ error: 'Sender, email, and message body are required.' });
    }

    const newMessage = {
        id: Date.now(),
        sender,
        email,
        subject: subject || 'No Subject',
        body,
        date: new Date().toISOString().split('T')[0]
    };

    // Store in Array (at top of list)
    messagesList.unshift(newMessage);

    res.status(201).json({ 
        message: 'Message sent successfully to admin dashboard', 
        data: newMessage 
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
