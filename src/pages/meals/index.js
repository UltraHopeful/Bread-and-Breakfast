import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Grid, Link } from '@mui/material';
import ListView from '../../components/mealview';

import AXIOS_CLIENT from '../../utils/api-client';

const MealList = () => {
  const [mealList, setMealList] = useState(null);

  useEffect(() => {
    AXIOS_CLIENT.post('api/kitchen/meals', { path: 'meals' })
      .then((res) => {
        if (res.status === 200) {
          setMealList(res.data.body);
        }
      })
      .catch((err) => {});
  }, []);

  const navigate = useNavigate();
  const handleKitchen = () => {
    navigate('/kitchen');
  };

  return (
    <div>
      <Grid item>
        <Link onClick={handleKitchen} variant="body2">
          {'Kitchen'}
        </Link>
      </Grid>
      {mealList && <ListView items={mealList} />}
    </div>
  );
};

export default MealList;
