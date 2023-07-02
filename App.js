import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { ApolloProvider, useQuery, gql } from "@apollo/client";
import client from "./apollo";

const GET_FILM = gql`
  query GetFilm($filmID: ID!) {
    film(filmID: $filmID) {
      title
      releaseDate
      director
      openingCrawl
    }
  }
`;

export function App() {
  const [filmID, setFilmID] = useState("1");
  const { loading, error, data } = useQuery(GET_FILM, {
    variables: { filmID },
  });

  const handleFilmIDChange = (newFilmID) => {
    setFilmID(newFilmID);
  };

  const [selectedNumber, setSelectedNumber] = useState(null);

  const handlePaginationClick = (newFilmID, number) => {
    setFilmID(newFilmID);
    setSelectedNumber(number);
  };

  const renderPaginationNumbers = () => {
    const numbers = [1, 2, 3, 4, 5, 6];

    return numbers.map((number) => (
      <TouchableOpacity
        key={number}
        style={[
          styles.paginationNumber,
          selectedNumber === number && styles.selectedPaginationNumber,
        ]}
        onPress={() => handlePaginationClick(number.toString(), number)}
      >
        <Text
          style={[
            styles.paginationText,
            selectedNumber === number && styles.selectedPaginationText,
          ]}
        >
          {number}
        </Text>
      </TouchableOpacity>
    ));
  };

  const animatedColor = new Animated.Value(0);

  const themeColorAnimation = animatedColor.interpolate({
    inputRange: [0, 1],
    outputRange: ["#03A9F4", "#FF4081"], // Ocean Blue to Alkaline
  });

  const startAnimation = () => {
    Animated.loop(
      Animated.timing(animatedColor, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();
  };

  useEffect(() => {
    startAnimation();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <View>
          <View style={styles.card}>
            <Animated.Text
              style={[styles.title, { color: themeColorAnimation }]}
            >
              {data?.film?.title}
            </Animated.Text>
            <View style={styles.divider} />
            <Text style={styles.description}>{data?.film?.openingCrawl}</Text>
            <View style={styles.infoContainer}>
              <View style={[styles.infoBox, { backgroundColor: "#B3E5FC" }]}>
                <Text style={styles.infoText}>
                  Release Date: {data?.film?.releaseDate}
                </Text>
              </View>
              <View style={[styles.infoBox, { backgroundColor: "#FF4081" }]}>
                <Text style={styles.infoText}>
                  Director: {data?.film?.director}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.paginationContainer}>
            {renderPaginationNumbers()}
          </View>
        </View>
      )}
    </View>
  );
}

export default function AppWrapper() {
  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#E1F5FE", // Ocean Blue
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  paginationNumber: {
    marginRight: 8,
    backgroundColor: "#03A9F4", // Ocean Blue
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  selectedPaginationNumber: {
    backgroundColor: "#FF4081", // Alkaline
  },
  paginationText: {
    color: "white",
    fontWeight: "bold",
  },
  selectedPaginationText: {
    color: "#FFCDB2", // Alkaline
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoBox: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
  divider: {
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    marginBottom: 16,
  },
});
