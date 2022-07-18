import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Grid, Link } from "@mui/material";
import ListView from "../../components/listview";

import AXIOS_CLIENT from "../../utils/api-client";

const RoomList = () => {
  const [roomList, setRoomList] = useState(null);
  useEffect(() => {
    AXIOS_CLIENT.post("api/hotel/getrooms", { path: "getrooms" })
      .then((res) => {
        if (res.status === 200) {
          setRoomList(JSON.parse(res.data.body));
        }
      })
      .catch((err) => {});
  }, []);

  const navigate = useNavigate();
  const handleRooms = () => {
    navigate("/hotel");
  };

  return (
    <div>
      <Grid Container>
        <Grid item>
          <Link onClick={handleRooms} variant="body2">
            {"Bookings"}
          </Link>
        </Grid>
      </Grid>
      {roomList && <ListView items={roomList} />}
    </div>
  );
};

export default RoomList;
