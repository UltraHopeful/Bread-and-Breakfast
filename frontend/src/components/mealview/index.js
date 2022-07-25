//Author: Manan Amin (B00897712)

/* eslint-disable object-curly-newline */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { Container, Grid } from '@mui/material';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import './styles.css';
import { Card, CardBody, CardTitle, CardFooter } from 'reactstrap';

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

function ItemView({ item: { mealName, mealPrice, imageUrl, meal_id } }) {
  return (
    <div className="grid-item">
      <Card>
        <CardBody>
          <CardTitle>
            <b>{mealName}</b>
          </CardTitle>
          <img className="img-thumbnail" src={imageUrl} alt={mealName} />
          <br />
          <p>
            <b>Price: {mealPrice}$ </b>
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
            <strong>{'Breakfast Menu'}</strong>
          </Typography>
        </ThemeProvider>
      </div>
      <br />

      <Container>
        <Grid container spacing={7}>
          {items.map((element) => (
            <Grid key={element.meal_id} item>
              <ItemView key={element.meal_id} item={element} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}
