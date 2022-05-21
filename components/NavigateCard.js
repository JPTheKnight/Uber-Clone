import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import tw from "twrnc";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { useDispatch } from "react-redux";
import { setDestination, setOrigin } from "../slices/navSlice";
import { useNavigation } from "@react-navigation/native";

const NavigateCard = () => {
  const [loc, setLoc] = useState([]);
  const [input, setInput] = useState("");
  const [chosenLoc, setChosenLoc] = useState({});

  var params = {
    q: "",
    format: "json",
    addressdetails: 1,
    polygon_geojson: 0,
  };

  const API_LINK = "https://nominatim.openstreetmap.org/search?";

  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      params.q = input;
      const query = new URLSearchParams(params).toString();
      fetch(`${API_LINK}${query}`, {
        method: "GET",
        redirect: "follow",
      })
        .then((response) => response.text())
        .then((result) => {
          setLoc(JSON.parse(result));
        })
        .catch((error) => setLoc([{ display_name: "ERROR" }]));
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [input]);

  return (
    <SafeAreaView style={tw`bg-white flex-1`}>
      <Text style={tw`text-center py-5 text-xl`}>Good Morning, JayPeeee!</Text>
      <View style={tw`border-t border-gray-200 flex-shrink`}>
        <View style={tw`p-5`}>
          <TextInput
            style={styles.input}
            onChangeText={(value) => {
              setInput(value);
            }}
            value={input}
            placeholder="Where to?"
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
          <TouchableOpacity
            onPress={() => {
              dispatch(
                setDestination({
                  location: { lat: chosenLoc.lat, lng: chosenLoc.lon },
                  description: loc.display_name,
                })
              );
              navigation.navigate("RideOptions");
            }}
            style={{
              borderWidth: 2,
              width: 200,
              borderRadius: 20,
              height: 50,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: 20,
            }}
            disabled={!loc}
          >
            <Text style={{ fontSize: 20 }}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NavigateCard;

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    padding: 10,
    backgroundColor: "lightgray",
    borderColor: "transparent",
    borderRadius: 10,
    color: "black",
  },
  label: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
