import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import tw from "twrnc";
import NavOptions from "../components/NavOptions";
import { Button } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";

const HomeScreen = () => {
  const [loc, setLoc] = useState([]);
  const [input, setInput] = useState("");
  const [chosenLoc, setChosenLoc] = useState({});

  var params = { q: "", format: "json", addressdetails: 1, polygon_geojson: 0 };

  const API_LINK = "https://nominatim.openstreetmap.org/search?";

  return (
    <SafeAreaView style={tw`h-full`}>
      <View style={tw`p-5`}>
        <Image
          style={{
            width: 100,
            height: 100,
            resizeMode: "contain",
          }}
          source={{
            uri: "https://links.papareact.com/gzs",
          }}
        />
        <TextInput
          style={styles.input}
          onChangeText={(value) => {
            setInput(value);
            params.q = value;
            const query = new URLSearchParams(params).toString();
            fetch(`${API_LINK}${query}`, {
              method: "GET",
              redirect: "follow",
            })
              .then((response) => response.text())
              .then((result) => {
                console.log(JSON.parse(result));
                setLoc(JSON.parse(result));
              })
              .catch((error) => setLoc([{ display_name: "ERROR" }]));
          }}
          value={input}
          placeholder="Where from?"
        />
        {loc.map((item) => {
          return (
            <TouchableOpacity
              onPress={() => {
                setLoc([]);
                setInput(item.display_name);
                setChosenLoc(item);
              }}
            >
              <View
                style={{
                  margin: 1,
                  marginLeft: 10,
                  marginRight: 10,
                  backgroundColor: "white",
                  height: 50,
                  borderRadius: 3,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Text style={{ paddingLeft: 15 }}>{item.display_name}</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {/*
        <Text style={{ fontSize: 25 }}>Where From?</Text>
        <View style={styles.label}>
          <Text>Latitude</Text>
          <TextInput
            style={styles.input}
            onChangeText={(value) => {
              setLat(value);
            }}
            value={lat.toString()}
          />
        </View>
        <View style={styles.label}>
          <Text>Longitude</Text>
          <TextInput
            style={styles.input}
            onChangeText={(value) => {
              setLng(value);
            }}
            value={lng.toString()}
          />
          </View>*/}

        {/*<GooglePlacesAutocomplete
          placeholder="Where From?"
          styles={{ container: { flex: 0 }, textInput: { fontSize: 18 } }}
          onPress={(data, details = null) => {
            dispatch(
              setOrigin({
                location: details.geometry.location,
                description: data.description,
              })
            );
            dispatch(setDestination(null));
          }}
          fetchDetails={true}
          returnKeyType={"search"}
          enablePoweredByContainer={false}
          minLength={2}
          query={{ key: GOOGLE_MAPS_APIKEY, language: "en" }}
          nearbyPlacesAPI="GooglePlacesSearch"
          debounce={400}
        />*/}

        <NavOptions loc={chosenLoc} />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    padding: 10,
    backgroundColor: "white",
    borderColor: "transparent",
    borderRadius: 10,
  },
});
