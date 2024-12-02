import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  Divider,
  List,
  ListItem
} from '@mui/material';

const AboutUs = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, py: 8 }}>
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          About Us
        </Typography>
        <Divider sx={{ 
          width: 100, 
          height: 4, 
          backgroundColor: '#ffc900',
          mx: 'auto',
          mb: 4 
        }} />
      </Box>

      {/* Team Section */}
      <Paper elevation={3} sx={{ mb: 6, p: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Our Team
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Box sx={{ mb: 4 }}>
              {/* Team Content Container */}
              <Grid container spacing={3}>
                {/* Team Image - 40% width on desktop, full width on mobile */}
                <Grid item xs={12} md={5} sx={{ mb: { xs: 3, md: 0 } }}>
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      minHeight: { xs: '300px', md: '100%' },
                      borderRadius: 1,
                      overflow: 'hidden'
                    }}
                  >
                    <img
                      src="./src/assets/TeamPicture.jpeg"
                      alt="Parking Pirates Team"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </Box>
                </Grid>

                {/* Team Description - 60% width on desktop, full width on mobile */}
                <Grid item xs={12} md={7}>
                  <Typography variant="body1" paragraph>
                    At Parking Pirates, we are a passionate team of innovators and problem-solvers united by our mission to revolutionize parking management through technology. Combining diverse expertise, we bring together a unique blend of skills to create intuitive, high-performance desktop applications tailored to your needs.
                  </Typography>
                  
                  <List sx={{ mt: 3 }}>
                    <ListItem sx={{ display: 'block', mb: 2 }}>
                      <Typography variant="body1">
                        <Box component="span" sx={{ fontWeight: 'bold' }}>Tarik</Box>, a tech-savvy professional driven by a pursuit of excellence, brings his expertise in business strategy and full-stack development to ensure our app is both functional and market-ready.
                      </Typography>
                    </ListItem>
                    
                    <ListItem sx={{ display: 'block', mb: 2 }}>
                      <Typography variant="body1">
                        <Box component="span" sx={{ fontWeight: 'bold' }}>Petra</Box> excels in product and marketing management and brand strategy. Her skills in graphic design, HTML, CSS, and UX/UI design ensure a user experience that is seamless and visually captivating.
                      </Typography>
                    </ListItem>
                    
                    <ListItem sx={{ display: 'block', mb: 2 }}>
                      <Typography variant="body1">
                        <Box component="span" sx={{ fontWeight: 'bold' }}>Helen</Box> is our coding powerhouse, with a deep understanding of both frontend and backend development and extensive industry knowledge to guide robust app architecture.
                      </Typography>
                    </ListItem>
                    
                    <ListItem sx={{ display: 'block', mb: 2 }}>
                      <Typography variant="body1">
                        <Box component="span" sx={{ fontWeight: 'bold' }}>Dakota</Box> brings leadership and mentorship to the table, combining business management expertise with technical skills in HTML, CSS, and JavaScript.
                      </Typography>
                    </ListItem>
                    
                    <ListItem sx={{ display: 'block', mb: 2 }}>
                      <Typography variant="body1">
                        <Box component="span" sx={{ fontWeight: 'bold' }}>Roger</Box> ensures our projects are executed flawlessly, utilizing his experience in project management, R&D, and hardware/software development to innovate and problem-solve at every step.
                      </Typography>
                    </ListItem>
                  </List>
                  
                  <Typography variant="body1" sx={{ mt: 3 }}>
                    Together, we are Parking Pirates, blending creativity, strategy, and technical excellence to deliver solutions that make parking simpler, smarter, and stress-free.
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Project Section */}
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Our Project
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Box
              sx={{
                width: '100%',
                height: 500,
                bgcolor: 'grey.200',
                mb: 3,
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              <img
                src="./src/assets/pp-map-screenshot1.png"
                alt="Project"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </Box>
            <Typography variant="body1" color="text.secondary">
              Ahoy, mateys! Introducing Parking Pirates—our crew has built a 
              slick MERN full-stack app using the City of Calgary's open-source 
              data to help ye find parking treasures in the heart of downtown Calgary. 
              With the power of MongoDB, Express.js, React, and Node.js, this app 
              navigates the seas of street parking, parking lots, and parkades. Ye can 
              filter by distance and doubloons (price), and get all the details ye need 
              about parking rates. No more swashbuckling for a spot—your perfect parking 
              bounty awaits with just a click! Arrr!
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AboutUs;