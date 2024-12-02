import express from 'express';
import { connectDb, UnifiedParking } from './db.js'; // Ensure models are imported correctly
import nodemailer from 'nodemailer';
import dotenv from 'dotenv'; // Import dotenv for environment variables
import rateLimit from 'express-rate-limit'; // Import rateLimit for rate limiting

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// Connect to MongoDB when the server starts
connectDb();

// Rate limiting to prevent abuse
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { message: 'Too many requests, please try again later.' },
});
app.use('/api/ContactUs', limiter);

// Route for parking rates with optional filtering
app.get('/api/parkingrates', async (req, res) => {
    try {
        const { maxDistance, lat, lng, sortOrder, showFreeOnly } = req.query;
        let query = {}; // Initialize query as an empty object

        // If lat, lng, and maxDistance are provided, apply the geo filter
        if (lat && lng && maxDistance) {
            const userCoords = { latitude: parseFloat(lat), longitude: parseFloat(lng) };

            // Convert maxDistance (meters) to radians
            const maxDistanceInRadians = parseFloat(maxDistance) / 6371; // Radius of Earth in kilometers

            query.coordinates = {
                $geoWithin: {
                    $centerSphere: [
                        [userCoords.longitude, userCoords.latitude],
                        maxDistanceInRadians, // Use maxDistance in radians for $centerSphere
                    ],
                },
            };
        }

        // If showFreeOnly is true, add condition to only show free parking
        if (showFreeOnly === 'true') {
            query.dailyRate = 'Free';
        }

        // Set sort order (only ascending for now)
        const sortOption = {};
        if (sortOrder === 'asc') {
            sortOption.dailyRate = 1; // Ascending
        }

        // Query the database with the built query object and sort the results
        const allParkingRatesData = await UnifiedParking.find(query).sort(sortOption);
        res.json(allParkingRatesData);
    } catch (error) {
        console.error('Error fetching parking rates:', error);
        res.status(500).json({ error: error.message });
    }
});

// Email functionality
app.post('/api/ContactUs', async (req, res) => {
    const { name, email, subject, message, to } = req.body;

    // Input validation
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to, // Destination email
        subject: `New Contact Form Submission: ${subject}`,
        html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        `,
    };

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Email sending error:', error);
        res.status(500).json({
            message: 'Failed to send email',
            error: error.message, // Include error message for debugging
        });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
