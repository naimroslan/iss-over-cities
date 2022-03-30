import React, { useState, useEffect } from "react";
import "./App.css";
import Geocode from "react-geocode";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

function App() {
  //datetimepicker
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [issData, setIssData] = useState("");
  const [locationName, setLocationName] = useState("");
  const [formattedDate, setFormattedDate] = useState("");

  //iss url api

  useEffect(() => {
    fetchIssData();
  }, []);

  //fetch latitude and longitude from API
  const fetchIssData = async () => {
    const issUrl = "https://api.wheretheiss.at/v1/satellites/25544";
    const response = await fetch(issUrl);

    const data = await response.json();
    setIssData(data);
    getAddress(data.latitude, data.longitude);
  };

  const fetchIssDataInterval = async () => {
    const issUrl = `https://api.wheretheiss.at/v1/satellites/25544/positions?timestamps=${formattedDate}`;
    const response = await fetch(issUrl);

    const data = await response.json();
    setIssData(data[0]);
    getAddress(issData.latitude,issData.longitude);
  };

  const onChangeDateHandler = (date) => {
    setSelectedDate(date);
    setFormattedDate(parseInt(new Date(date).getTime() / 1000) + "&units=miles");
    fetchIssDataInterval();
  };

  const getAddress = (lat, long) => {
    // Google Maps Geocoding API
    Geocode.setApiKey("YOUR_API_KEY");

    // set response language. Defaults to english.
    Geocode.setLanguage("en");

    // Get address from latitude & longitude.
    Geocode.fromLatLng(lat, long).then(
      (response) => {
        const address = response.results[0].formatted_address;
        let city, state, country;
        for (let i = 0; i < response.results[0].address_components.length; i++) {
          for (let j = 0; j < response.results[0].address_components[i].types.length; j++) {
            switch (response.results[0].address_components[i].types[j]) {
              case "locality":
                city = response.results[0].address_components[i].long_name;
                break;
              case "administrative_area_level_1":
                state = response.results[0].address_components[i].long_name;
                break;
              case "country":
                country = response.results[0].address_components[i].long_name;
                break;
            }
          }
        }
        setLocationName(country);
        console.log(city, state, country);
      },
      (error) => {
        console.error(error);
      }
    );
  };

  return (
    <div class="App">
      <div class="absolute box-content h-max w-max">
        <div class="m-10 shadow-2xl rounded-lg p-10">
          <DatePicker
            dateFormat="dd.MM.yyyy hh:mm aa"
            selected={selectedDate}
            onChange={(date) => onChangeDateHandler(date)}
            maxDate={new Date()}
            showPopperArrow={false}
            placeholderText="Select date and time"
            showTimeSelect
            isClearable
            disabledKeyboardNavigation
          />
        </div>
      </div>

      <div class="flex h-screen">
        <div class="m-auto">
          <ul class="overflow-x-auto overscroll-none ml-auto">
            <li id="pastDates" class="inline-block mx-10"></li>
          </ul>

          <p class="font-sans text-base my-5 text-left">
            The International Space Station is over:{" "}
          </p>
          <div>
            <h5 id="state" class="font-serif text-5xl">
              {locationName ? locationName : "the Ocean"}
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
