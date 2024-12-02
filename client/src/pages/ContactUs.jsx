import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import { useParams } from "react-router-dom";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitStatus, setSubmitStatus] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const AUTO_HIDE_DURATION = 6000; // Snackbar auto-hide duration
  const { id } = useParams();

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/ContactUs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          to: "parkingpirates1990@gmail.com" , 
        }),
      });

      if (response.ok) {
        setSubmitStatus({
          open: true,
          message: "Message sent successfully!",
          severity: "success",
        });
        // Reset form after successful submission
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Failed to send message");
      }
    } catch (error) {
      setSubmitStatus({
        open: true,
        message: "Failed to send message. Please try again.",
        severity: "error",
      });
      console.error("Submission error:", error);
    }
  };

  // Handles input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Closes the Snackbar
  const handleCloseSnackbar = () => {
    setSubmitStatus((prev) => ({ ...prev, open: false }));
  };

  return (
    <Container sx={{ mb: 6, p: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Page Title */}
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Contact Us
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          Ahoy! Have questions about parking? We arrr here to help!
        </Typography>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Name Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>

            {/* Email Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>

            {/* Subject Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>

            {/* Message Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                multiline
                rows={4}
                variant="outlined"
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  minWidth: 200,
                  mt: 2,
                  backgroundColor: "#ffc900",
                  "&:hover": {
                    backgroundColor: "#dfaf02",
                    boxShadow: "0 6px 14px rgba(0, 0, 0, 0.3)",
                  },
                }}
              >
                Send Message
              </Button>
            </Grid>
          </Grid>
        </form>

        {/* Snackbar for Feedback */}
        <Snackbar
          open={submitStatus.open}
          autoHideDuration={AUTO_HIDE_DURATION}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={submitStatus.severity}
            sx={{ width: "100%" }}
          >
            {submitStatus.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default ContactUs;
