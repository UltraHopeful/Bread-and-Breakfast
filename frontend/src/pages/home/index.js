import React from "react";
import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, Typography } from "@mui/material";

function ExpandMoreIcon() {
  return null;
}

const main = () => {
  return (
      <>
          <Box className="homeHeader" textAlign="center">
              <Typography variant="h2" gutterBottom color="white" component="div" style={{paddingTop: '30vh'}}>
               <strong>Welcome to Bed &amp; Breakfast</strong>
              </Typography>
              <Typography variant="h4" gutterBottom color="white" component="div">
                  Here you can book your accomodation and <br/> order your meal at one place with tour package.
              </Typography>

          </Box>
          <Grid container justifyContent="center">
              <Grid item xl={6} lg={6} md={6} sm={12} xs={12} className="sideBox" alignItems="center">
                  <Typography variant="h4" color="white" align="center">
                      Hotel Room Booking
                  </Typography>
                  <hr className="hr-fancy1"/>
                  <Typography variant="h5" gutterBottom color="white" align="center">
                      In this service user can book up to 10 rooms for maximum of 14 days.<br/>\
                      We are trying to provides seamless booking experience through user interface. <br/>
                      We also provide Assistant support system to book rooms.
                  </Typography>
              </Grid>
              <Grid item xl={6} lg={6} md={6} sm={12} xs={12} className="bg-lighter img-box">
                  <Box className = "imgBox">
                      <img src="roomBooking.jpg" alt="hotel room" className="img-responsive"/>
                  </Box>
              </Grid>
              <Grid item xl={6} lg={6} md={6} sm={12} xs={12} className="bg-lighter img-box">
                  <Box className = "imgBox">
                      <img src="meal.jpg" alt="meal" className="img-responsive"/>
                  </Box>
              </Grid>
              <Grid item xl={6} lg={6} md={6} sm={12} xs={12} className="sideBox" alignItems="center">
                  <Typography variant="h4" color="white" align="center">
                      Hotel Meal Order
                  </Typography>
                  <hr className="hr-fancy1"/>
                  <Typography variant="h5" gutterBottom color="white" align="center">
                      We are providing awesome breakfast and meal through the day.
                      <br/>Here you can order your favorite meal at anytime through user interface which is connected to your booking to follow.
                      <br/>We also provide assitant support system to order meal.
                  </Typography>
              </Grid>

              <Grid item xl={6} lg={6} md={6} sm={12} xs={12} className="sideBox" alignItems="center">
                  <Typography variant="h4" color="white" align="center">
                      Tour recommendation &amp;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      Booking
                  </Typography>
                  <hr className="hr-fancy1"/>
                  <Typography variant="h5" gutterBottom color="white" align="center">
                    This service provides the best possible tour package which is specially tailored for you.
                    <br/>Here we take input from user and provide best places to stay, to visit nearby places.
                  </Typography>
              </Grid>
              <Grid item xl={6} lg={6} md={6} sm={12} xs={12} className="bg-lighter img-box">
                  <Box  className = "imgBox">
                      <img src="tour.jpg" alt="tour booking" className="img-responsive"/>
                  </Box>
              </Grid>
          </Grid>
      </>
  );
};
export default main;
