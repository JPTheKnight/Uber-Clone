import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import tw from "twrnc";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import {
  selectOrigin,
  setDestination,
  setOrigin,
  setTravelTimeInformation,
} from "../slices/navSlice";
import { useNavigation } from "@react-navigation/native";
import NavFavorites from "./NavFavorites";
import { Icon } from "react-native-elements";

const NavigateCard = () => {
  const [loc, setLoc] = useState([]);
  const [input, setInput] = useState("");

  const origin = useSelector(selectOrigin);

  var params = {
    q: "",
    format: "json",
    addressdetails: 1,
    polygon_geojson: 0,
  };

  const API_LINK = "https://nominatim.openstreetmap.org/search?";
  const API_DURATION_LINK = "http://router.project-osrm.org/table/v1/driving/";

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
          {loc.map((item, index) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setLoc([]);
                  setInput(item.display_name);
                  setTimeout(() => {
                    dispatch(
                      setDestination({
                        location: {
                          lat: item.lat,
                          lng: item.lon,
                        },
                        description: item.display_name,
                      })
                    );
                  }, 1000);
                  fetch(
                    `${API_DURATION_LINK}${
                      origin.location.lat + "," + origin.location.lng
                    };${item.lat + "," + item.lon}?sources=0`,
                    {
                      method: "GET",
                      redirect: "follow",
                    }
                  )
                    .then((response) => response.text())
                    .then((result) => {
                      result = JSON.parse(result);
                      console.log(result);
                      dispatch(
                        setTravelTimeInformation({
                          duration: result.durations[0][1],
                        })
                      );
                    });
                  navigation.navigate("RideOptions");
                }}
                key={index}
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
        </View>
        <NavFavorites />
      </View>
      <View
        style={tw`flex-row bg-white justify-evenly py-2 mt-auto border-t border-gray-300`}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("RideOptions")}
          style={tw`flex flex-row bg-black justify-between w-24 px-4 py-3 rounded-full`}
        >
          <Icon name="car" type="font-awesome" color="white" size={16} />
          <Text style={tw`text-white text-center`}>Rides</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`flex flex-row justify-between w-24 px-4 py-3 rounded-full`}
        >
          <Icon
            name="fast-food-outline"
            type="ionicon"
            color="black"
            size={16}
          />
          <Text style={tw`text-center`}>Eats</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default NavigateCard;

const styles = StyleSheet.create({
  input: {
    height: 40,
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
