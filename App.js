import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const { width: SCREEN_WIDTH } = Dimensions.get('window');
const API_KEY = "8b4400e8424eb03dac3f2ff4dc6ae6e1";
const icons = {
  Clouds: "weather-cloudy",
  Clear: "weather-sunny",
  Rain: "weather-pouring",
  Snow: "weather-snowy",
  Atmospheric: "weather-widy-variant",
  Drizzle: "weather-rainy",
  Thunderstorm: "weather-lightning-rainy",
}

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const getWeather = async () => {
    const { greanted } = await Location.requestForegroundPermissionsAsync();
    if (!greanted) {
      setOk(false)
    }
    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city)
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    setDays(json.daily)
  }
  useEffect(() => {
    getWeather();
  }, [])
  return (
    // View는 기본적으로 flex container 이다
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}>
        {days.length === 0 ? (<View style={styles.day}>
          <ActivityIndicator color="white" size="large" style={{ marginTop: 10 }} />
        </View>) : (
          days.map((day, i) => (
            <View key={i} style={styles.day}>
              <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between", marginRight: "20%", }}>
                <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
                <MaterialCommunityIcons name={icons[day.weather[0].main]} size={70} color="white" />
              </View>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          ))
        )}
      </ScrollView>
      <StatusBar style="light" />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#114A78",
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 50,
    fontWeight: "600",
    color: "#fff",
  },
  day: {
    width: SCREEN_WIDTH,
    paddingLeft: 30,
    padding: 15,
  },
  temp: {
    fontSize: 128,
    fontWeight: "500",
    color: "#fff",
  },
  description: {
    marginTop: -10,
    fontSize: 30,
    color: "#fff",
  },
  tinyText: {
    fontSize: 20,
    color: "#fff",
  }
});
