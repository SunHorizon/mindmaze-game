import React from "react";
import { View, StyleSheet, Text, Button, TouchableOpacity } from "react-native";

export default function MainMenu({navigation}){
    return(
        <View style={styles.container}>
            <Text style={styles.title}>🧠 Mind Maze</Text>

            <TouchableOpacity
                style={styles.playButton}
                onPress={() => navigation.navigate('LevelSelection')}
                activeOpacity={0.8}
            >   
                <Text style={styles.playButtonText}>Play</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f8',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 36,
        fontWeight: '800',
        color: '#333',
        marginBottom: 60,
        textShadowColor: '#ccc',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    playButton: {
        backgroundColor: '#4CAF50', 
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 12,
        elevation: 5,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: { width: 2, height: 4}
    },
    playButtonText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: '600',
        letterSpacing: 1,
    }
})