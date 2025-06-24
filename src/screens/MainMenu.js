import React from "react";
import { View, StyleSheet, Text, Button} from "react-native";

export default function MainMenu({navigation}){
    return(
        <View style={styles.container}>
            <Text style={styles.title}>Mind Maze Game</Text>
            <Button 
                title="Play"
                onPress={() => navigation.navigate('LevelSelection')}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 30,
    }
})