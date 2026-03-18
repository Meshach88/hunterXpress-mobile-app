import React from "react";
import { View, StyleSheet } from "react-native";
import Mapbox from "../../services/mapbox"

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Mapbox.MapView style={styles.map}>
        <Mapbox.Camera
          zoomLevel={12}
          centerCoordinate={[3.3792, 6.5244]} // Lagos
        />
      </Mapbox.MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 1
  }
});