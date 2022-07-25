//Author: Manan Amin (B00897712)

/* eslint-disable object-curly-newline */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { Container, Grid } from '@mui/material';

import './styles.css';
import { Card, CardBody, CardTitle, CardFooter } from 'reactstrap';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

const themeTypography = createTheme();

themeTypography.typography.overline = {
  fontSize: '2rem',
  fontFamily: 'optima',
  '@media (min-width:300px)': {
    fontSize: '1.5rem',
  },
  [themeTypography.breakpoints.up('md')]: {
    fontSize: '2rem',
  },
};

function ItemView({
  item: { roomName, price, rating, imageurl, roomid, roomDescription },
}) {
  return (
    <div className="grid-item">
      <Card>
        <CardBody>
          <CardTitle>
            <b>{roomName}</b>
          </CardTitle>
          <img className="img-thumbnail" src={imageurl} alt={roomName} />
          <b>Description</b>
          <br />
          {roomDescription}
          <p>
            <b>Price: {price}$ per night</b>
          </p>
        </CardBody>
        <CardFooter className="text-muted"></CardFooter>
      </Card>
    </div>
  );
}

export default function ListView({ items }) {
  console.log(items);
  return (
    <div className="new_grid">
      <div className="menu-title">
        <ThemeProvider theme={themeTypography}>
          <Typography variant="overline" display="block">
            <strong>{'Room Types'}</strong>
          </Typography>
        </ThemeProvider>
      </div>
      <br />
      <Container>
        <Grid container spacing={7}>
          {items.map((element) => (
            <Grid key={element.roomid} item>
              <ItemView key={element.roomid} item={element} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}
