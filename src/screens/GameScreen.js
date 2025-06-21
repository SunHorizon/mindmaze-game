import React, { useState } from "react";
import level1 from '../data/level1.json'
import { View, Text, StyleSheet, Button } from "react-native";


const GameScreen = () => {
    const [playerPos, setPlayerPos] = useState({row: 0, col: 0});

    const canMoveTo = (row, col) => {
        const isBonds = row >= 0 && row < level1.height && col >= 0 && col < level1.width;
        return isBonds;
    }

    const movePlayer = (dRow, dCol) => {
        const newRow = playerPos.row + dRow;
        const newCol = playerPos.col + dCol;
        if(canMoveTo(newRow, newCol)){
            setPlayerPos({ row: newRow, col: newCol });
        }
    }


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Level 1</Text>

            {/* Grid */}
            <View styles={styles.grid}>
                {level1.tiles.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.row}> 
                        {row.map((tile, colIndex) => {
                            const isPlayer = playerPos.row === rowIndex && playerPos.col === colIndex;
                            return (
                                <View
                                    key={colIndex}
                                    style={[
                                        styles.tile,
                                        tile === 1 && styles.titleWalable,
                                        tile === 2 && styles.tileGoal,
                                        tile === 0 && styles.tileEmpty,
                                    ]}
                                >    
                                    {isPlayer && (
                                      <Text style={styles.playerIcon}>
                                        👤
                                      </Text>
                                    )}
                                </View> 
                            );
                        })}
                    </View>
                ))}
            </View>

            {/* Controls */}
            <View style={styles.controls}>
                <View style={styles.dpadRow}>
                    <Button title="Up" onPress={() => movePlayer(-1, 0)} />
                </View>
                <View style={styles.dpadMiddleRow}>
                    <Button title="Left" onPress={() => movePlayer(0, -1)} />
                    <View style={{ width: 30 }} />
                    <Button title="Right" onPress={() => movePlayer(0, 1)} />
                </View>
                <View style={styles.dpadRow}>
                    <Button title="Down" onPress={() => movePlayer(1, 0)} />
                </View>
            </View>

        </View>
    );
};


const TITLE_SIZE = 50;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  grid: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  tile: {
    width: TITLE_SIZE,
    height: TITLE_SIZE,
    margin: 2,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleWalable: {
    backgroundColor: '#4CAF50',
  },
  tileGoal: {
    backgroundColor: '#FFD700', // gold
  },
  tileEmpty: {
    backgroundColor: '#ccc', // grey
  },
  playerTile: {
    borderWidth: 3,
    borderColor: '#0000FF',
  },
  controls: {
    marginTop: 30,
  },
  dpadRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
  },
  dpadMiddleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  playerIcon: {
    fontSize: 30,
    textAlign: 'center',
    textAlignVertical: 'center',
  }
});

export default GameScreen;