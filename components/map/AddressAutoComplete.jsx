import React, { useState } from "react";
import {
    View,
    TextInput,
    FlatList,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import axios from "axios";
import { useResponsive } from "@/hooks/use-responsiveness";

const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;

export default function AddressAutocompleteInput({
    placeholder,
    onSelectLocation,
}) {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const { scale, spacing, fontSize, isTablet } = useResponsive();


    const searchLocation = async (text) => {
        setQuery(text);

        if (text.length < 3) {
            setSuggestions([]);
            return;
        }

        try {
            const response = await axios.get(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                    text
                )}.json`,
                {
                    params: {
                        access_token: MAPBOX_TOKEN,
                        autocomplete: true,
                        limit: 5,
                    },
                }
            );

            setSuggestions(response.data.features);
        } catch (error) {
            console.error("Geocoding error:", error);
        }
    };

    const handleSelect = (place) => {
        const [lng, lat] = place.center;

        const location = {
            address: place.place_name,
            lat,
            lng,
        };

        setQuery(place.place_name);
        setSuggestions([]);

        onSelectLocation(location);
    };

    return (
        <View style={styles.container}>
            <TextInput
                value={query}
                onChangeText={searchLocation}
                placeholder={placeholder}
                style={[styles.input, { fontSize: fontSize.md }]}
            />

            {suggestions.length > 0 && (
                <FlatList
                    data={suggestions}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    nestedScrollEnabled={true}
                    style={styles.list}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.item}
                            onPress={() => handleSelect(item)}
                        >
                            <Text>{item.place_name}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        marginTop: 24,
        position: 'relative'
    },

    input: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderColor: "#E0E0E0",
        backgroundColor: "#fff",
        color: '#000',
        fontFamily: 'Sora-Regular',
        minHeight: 56,
    },

    list: {
        position: "absolute",
        top: 55,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        zIndex: 1000,
        elevation: 5,
    },

    item: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
});