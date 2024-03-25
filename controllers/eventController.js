import Event from '../models/eventModel.js';
import axios from 'axios';
import {config} from 'dotenv'
config();

const codeW=process.env.CODE_W;
const codeD=process.env.CODE_D;


export const addEvent = async (req, res) => {
    try {
      const { event_name, city_name, date, time, latitude, longitude } = req.body;
  
      if (!event_name || !city_name || !date || !time || !latitude || !longitude) {
        return res.status(400).send('Missing required fields.');
      }
  
      const newEvent = await Event.create({
        event_name,
        city_name,
        date,
        time,
        latitude,
        longitude
      });
  
      res.status(201).json(newEvent);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  };


export const findEvents = async (req, res) => {
  try {
    const { latitude, longitude, date } = req.query;
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 14);

    const events = await Event.find({
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 }).limit(10);

    const eventsWithWeather = await Promise.all(
      events.map(async (event) => {
        const weather = await getWeather(event.city_name, event.date);
        const distance =await calculateDistance(latitude, longitude, event.latitude, event.longitude);
        const roundedDistance = parseFloat(distance).toFixed(0);

        return {
          event_Name: event.event_name,
          city: event.city_name,
          date: event.date,
          time:event.time,
          weather: weather,
          distance: roundedDistance
        };
      })
    );

    res.json(eventsWithWeather);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

async function getWeather(city, date) {
    try {
      const encodedCity = encodeURIComponent(city);
      const formattedDate = formatDate(date);
      const url = `https://gg-backend-assignment.azurewebsites.net/api/Weather?code=${codeW}==&city=${encodedCity}&date=${formattedDate}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching weather:', error);
      return null;
    }
  }
  
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

async function calculateDistance(latitude1, longitude1, latitude2, longitude2) {
    try {
      const url = `https://gg-backend-assignment.azurewebsites.net/api/Distance?code=${codeD}==&latitude1=${latitude1}&longitude1=${longitude1}&latitude2=${latitude2}&longitude2=${longitude2}`;
      const response = await axios.get(url);
      return response.data.distance;
    } catch (error) {
      console.error('Error calculating distance:', error);
      return null;
    }
  }

