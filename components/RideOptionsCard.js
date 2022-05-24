import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import tw from "twrnc";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { Image } from "react-native-elements";
import { useSelector } from "react-redux";
import { selectTravelTimeInformation } from "../slices/navSlice";
import "intl";
import "intl/locale-data/jsonp/en";

const data = [
  {
    id: "Uber-X-123",
    title: "UberX",
    multiplier: 1,
    image: "https://links.papareact.com/3pn",
  },
  {
    id: "Uber-XL-456",
    title: "UberXL",
    multiplier: 1.5,
    image: "https://links.papareact.com/5w8",
  },
  {
    id: "Uber-LUX-789",
    title: "UberLUX",
    multiplier: 1.75,
    image: "https://links.papareact.com/7pf",
  },
];

const RideOptionsCard = () => {
  const [selected, setSelected] = useState(null);
  const travelTimeInformation = useSelector(selectTravelTimeInformation);

  return (
    <SafeAreaView style={tw`bg-white flex-grow`}>
      <View>
        <Text style={tw`text-center py-5 text-xl`}>Select a Ride</Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => setSelected(item)}
              style={tw`flex-row justify-between items-center px-10 ${
                item.id === selected?.id && "bg-gray-200"
              }`}
            >
              <Image
                style={{ width: 100, height: 100, resizeMode: "contain" }}
                source={{ uri: item.image }}
              />
              <View style={tw`-ml-6`}>
                <Text style={tw`text-xl font-semibold`}>{item.title}</Text>
                <Text>{`${Math.floor(
                  travelTimeInformation?.duration / 3600
                )}h ${Math.floor(
                  (travelTimeInformation?.duration / 3600 -
                    Math.floor(travelTimeInformation?.duration / 3600)) *
                    60
                )}m ${Math.floor(
                  ((travelTimeInformation?.duration / 3600 -
                    Math.floor(travelTimeInformation?.duration / 3600)) *
                    60 -
                    Math.floor(
                      (travelTimeInformation?.duration / 3600 -
                        Math.floor(travelTimeInformation?.duration / 3600)) *
                        60
                    )) *
                    60
                )}s`}</Text>
              </View>
              <Text style={tw`text-xl`}>
                {new Intl.NumberFormat("en-us", {
                  style: "currency",
                  currency: "USD",
                }).format(
                  (travelTimeInformation?.duration * 1.5 * item.multiplier) /
                    100
                )}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
      <View>
        <TouchableOpacity
          disabled={!selected}
          style={tw`bg-black py-1 m-3 ${!selected && "bg-gray-300"}`}
        >
          <Text style={tw`text-center text-white text-xl`}>
            Choose {selected?.title}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RideOptionsCard;

const styles = StyleSheet.create({});
