import React from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';


const levels = [
    { id: 1, name: 'Level 1' },
    { id: 2, name: 'Level 2' },
    { id: 3, name: 'Level 3' },
]

export default function LevelSelection({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>🗂 Select a Level</Text>

            <FlatList 
                data={levels}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
                renderItem={({item}) => (

                    <TouchableOpacity
                        style={styles.card}
                        activeOpacity={0.8}
                        onPress={() =>  navigation.navigate('GameScreen', { levelNumber: item.id })}
                    >
                        <Text style={styles.cardText}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafd',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 30,
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3},
    shadowRadius: 6,
    alignContent: 'center',
    justifyContent: 'center',
  },
  cardText: {
    fontSize: 20,
    fontWeight: '600',
    color: "#4CAF50",
  }
});