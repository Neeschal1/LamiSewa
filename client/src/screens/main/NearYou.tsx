import { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function NearYou() {
  const [location, setLocation] = useState<any>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") return;

      let current = await Location.getCurrentPositionAsync({});
      setLocation(current);
    })();
  }, []);

  if (!location) {
    return <View  style={styles.container} >
        <Text>Fetching your details and position!!!</Text>
    </View>;
  }

  const { latitude, longitude } = location.coords;

  return (
    <View style={styles.container}>
      <MapView
      className="flex flex-1 justify-end"
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
      >
        <Marker
          coordinate={{
            latitude,
            longitude,
          }}
          title="You are here"
          description="Current location"
        />
      <View className="flex flex-1 justify-end bg-background w-full items-center">
        <Text>Nischal Pokharel</Text>
      </View>
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
   },
  map: { width: "100%", height: "100%" },
});