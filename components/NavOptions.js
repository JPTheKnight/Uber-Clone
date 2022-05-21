import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React from "react";
import tw from "twrnc";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { selectOrigin, setDestination, setOrigin } from "../slices/navSlice";

const data = [
  {
    id: "123",
    title: "Get a ride",
    image: "https://links.papareact.com/3pn",
    screen: "MapScreen",
  },
  {
    id: "456",
    title: "Order food",
    image: "https://links.papareact.com/28w",
    screen: "EatsScreen",
  },
];

const NavOptions = ({ loc }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      horizontal
      renderItem={({ item }) => {
        return (
          <TouchableOpacity
            onPress={() => {
              dispatch(
                setOrigin({
                  location: { lat: loc.lat, lng: loc.lon },
                  description: loc.display_name,
                })
              );
              dispatch(setDestination(null));
              navigation.navigate(item.screen);
            }}
            style={tw`p-2 pl-6 pb-8 pt-4 bg-gray-200 m-2 w-40`}
            disabled={!loc}
          >
            <View style={tw`${!loc && "opacity-20"}`}>
              <Image
                style={{ width: 120, height: 120, resizeMode: "contain" }}
                source={{ uri: item.image }}
              />
              <Text style={tw`mt-2 text-lg font-semibold`}>{item.title}</Text>
              <Icon
                type="antdesign"
                name="arrowright"
                color="white"
                style={tw`p-2 bg-black rounded-full w-10 mt-4`}
              />
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
};

export default NavOptions;
