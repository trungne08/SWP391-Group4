const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // React app URL
    credentials: true
}));

// Database configuration
const config = {
    user: 'sa', // Thay đổi username
    password: '12345', // Thay đổi password thật
    server: 'localhost', // Hoặc IP address của SQL Server
    database: 'PregnancyTracking',
    options: {
        trustServerCertificate: true,
        enableArithAbort: true,
        encrypt: false // Thêm option này
    }
};

// Connect to database
sql.connect(config)
    .then(() => {
        console.log('Connected to database successfully');
    })
    .catch((err) => {
        console.error('Database connection failed:', err);
    });
// Add root route handler
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Baby Care API' });
});
// Test endpoint
app.get('/test', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM dbo.Users`;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// ... existing code ...

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Add logging to debug request data
        console.log('Login attempt:', { email });

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const result = await sql.query`
            SELECT * FROM dbo.Users 
            WHERE email = ${email} AND password = ${password}
        `;
        
        // Add logging to debug database result
        console.log('Query result length:', result.recordset.length);

        if (result.recordset.length > 0) {
            const user = result.recordset[0];
            res.json({
                success: true,
                user: {
                    id: user.user_id,
                    email: user.email,
                    username: user.username,
                    role: user.role
                }
            });
        } else {
            res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// ... existing code ...

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});