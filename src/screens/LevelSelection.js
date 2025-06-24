import React from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';


const levels = [
    { id: 1, name: 'Level 1' },
    { id: 2, name: 'Level 2' },
    { id: 3, name: 'Level 3' },
]

export default function LevelSelection({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select a Level</Text>
            <FlatList 
                data={levels}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) => (
                    <Button 
                        title={item.name}
                        onPress={() =>  navigation.navigate('GameScreen', { levelNumber: item.id })}
                    />
                )}
            />
        </View>
    )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
});