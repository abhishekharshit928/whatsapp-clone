import React from "react";

import { useEffect } from "react";
import axios from "axios";

function Home() {
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/test")
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <h1>WhatsApp Clone</h1>
      <p>Welcome to the Home Page</p>
    </div>
  );
}

export default Home;