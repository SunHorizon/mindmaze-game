import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Button, Animated, TouchableOpacity  } from "react-native";
import { useNavigation } from "@react-navigation/native";

//Levels
import level1Data from '../data/level1.json';
import level2Data from '../data/level2.json';
import level3Data from '../data/level3.json';

const levels = {
  1: level1Data,
  2: level2Data,
  3: level3Data,
};


// enums
const COUNT_DOWN_TIMER = 3;


const GameScreen = ({ route }) => {

    const { levelNumber } = route.params;
    // Load level based on levelNumber
    const levelData = levels[levelNumber];

    const navigation = useNavigation();

    const playerPositionRef = useRef({ row: 0, col: 0 }); // Add ref
    const [playerPos, setPlayerPos] = useState({row: 0, col: 0});
    const [isMemorizationPhase, setIsMemorizationPhase] = useState(true);
    const [countdown, setCountdown] = useState(COUNT_DOWN_TIMER);

    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [steppedTile, setSteepedTile] = useState({});

    const [animatedTile, setAnimatedTile]= useState({});

    

    useEffect(() => {
      if(countdown > 0){
        const timer = setTimeout(() => {
        setCountdown(countdown - 1);
        }, 1000);
        return () => clearTimeout(timer);
      }else{
        setIsMemorizationPhase(false);
      }
    },[countdown])

    const canMoveTo = (row, col) => {
        const isBonds = row >= 0 && row < levelData.height && col >= 0 && col < levelData.width;
        return isBonds;
    }

    const movePlayer = (dRow, dCol) => {
        if(gameOver || gameWon) return;

        const newRow = playerPos.row + dRow;
        const newCol = playerPos.col + dCol;

        if(!canMoveTo(newRow, newCol)) return;

        const tile = levelData.tiles[newRow][newCol];

        if(!gameStarted) setGameStarted(true);

        if(tile === 0) setGameOver(true);
        if(tile === 2) setGameWon(true);
        if(steppedTile[`${newRow},${newCol}`] === 'black') setGameOver(true);

        if(tile === 1 && steppedTile[`${newRow},${newCol}`] !== 'black'){

          const key = `${newRow},${newCol}`;
          setSteepedTile((prev) => ({...prev, [key]: 'green'}));

          const anim = new Animated.Value(1)
          setAnimatedTile((prev) => ({ ...prev, [key]: anim }));

          Animated.timing(anim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }).start(() => {
              setSteepedTile((prev) => ({...prev, [key]: 'black'}));
              const currentPos = playerPositionRef.current;
              if(currentPos.row === newRow && currentPos.col === newCol){
                setGameOver(true);
              }
          })
        }

        // move player
        setPlayerPos({ row: newRow, col: newCol });
        playerPositionRef.current = { row: newRow, col: newCol };
    }
  
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Level {levelNumber}</Text>

            <View style={styles.topBar}>
              <TouchableOpacity style={styles.navButton} onPress={() => navigation.goBack()}>
                <Text style={styles.navButtonText}>Quit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navButton} onPress={() => navigation.reset({index: 0, routes: [{ name: 'MainMenu' }]})}>
                <Text style={styles.navButtonText}>Main Menu</Text>
              </TouchableOpacity>
            </View>


            {/* Grid */}
            <View styles={styles.grid}>
                {levelData.tiles.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.row}> 
                        {row.map((tile, colIndex) => {
                            const isPlayer = playerPos.row === rowIndex && playerPos.col === colIndex;
                            const key = `${rowIndex},${colIndex}`;
                            
                            let tileStyle = {};
                            if(tile === 3){
                              tileStyle = styles.tileStart;
                            }else if(steppedTile[key] === 'green'){
                              tileStyle = styles.tileCorrect;
                            } else if(steppedTile[key] === 'black'){
                              tileStyle = styles.tileBlack;
                            }else{
                              if(isMemorizationPhase){
                                if (tile === 1) tileStyle = styles.tileWalkables;
                                else if (tile === 2) tileStyle = styles.tileGoal;
                                else tileStyle = styles.tileEmpty;
                              }else{
                                tileStyle = styles.tileEmpty;
                              }
                            }
                            return (
                              steppedTile[key] === 'green' && animatedTile[key] ? (
                                <Animated.View
                                    key={colIndex}
                                    style={[ 
                                      styles.tile, 
                                      tileStyle,
                                      {
                                        opacity: animatedTile[key],
                                         position: 'relative',
                                      }

                                      ]}>    
                                    {isPlayer && ( <Text style={styles.playerIcon}>👤</Text>)}
                                </Animated.View> 

                              ): (
                                 <View key={colIndex} style={[ styles.tile, tileStyle]}>    
                                    {isPlayer && ( <Text style={styles.playerIcon}>👤</Text> )}
                                </View> 
                              )
                            );
                        })}
                    </View>
                ))}
            </View>
            

            {gameOver && ( <Text style={styles.gameOverText}>Game Over! ❌</Text>)}       
            {gameWon &&  (<Text style={styles.gameWonText}>You Win! 🎉</Text>)}
            {(gameOver || gameWon) && 
                <View style={styles.gameOverContainer}>
                  <TouchableOpacity style={styles.retryButton} 
                  onPress={() => {
                    setTimeout(() => {
                      navigation.replace('GameScreen', { levelNumber });
                    }, 50);
                  }}>
                    <Text style={styles.retryText}>Retry</Text>
                  </TouchableOpacity>
                </View>
            }
            
            {/* Controls */}
            {isMemorizationPhase ?
              (<Text style={styles.countdownText}> Memorize the path... {countdown} </Text>) 
                :
              (!gameOver && !gameWon) && 
              <View style={styles.controls}>
                  <View style={styles.dpadRow}>
                      <TouchableOpacity style={styles.dpadButton} onPress={() => movePlayer(-1, 0)} >
                        <Text style={styles.dpadText}>↑</Text>
                      </TouchableOpacity>
                  </View>
                  <View style={styles.dpadMiddleRow}>
                     <TouchableOpacity style={styles.dpadButton} onPress={() => movePlayer(0, -1)} >
                        <Text style={styles.dpadText}>←</Text>
                      </TouchableOpacity>
                      <View style={{ width: 30 }} />
                      <TouchableOpacity style={styles.dpadButton} onPress={() => movePlayer(0, 1)} >
                        <Text style={styles.dpadText}>→</Text>
                      </TouchableOpacity>
                  </View>
                  <View style={styles.dpadRow}>
                      <TouchableOpacity style={styles.dpadButton} onPress={() => movePlayer(1, 0)} >
                        <Text style={styles.dpadText}>↓</Text>
                      </TouchableOpacity>
                  </View>
              </View>
              
              }
        </View>
    );
};


const TITLE_SIZE = 50;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
    backgroundColor: '#f2f5f9'
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
  },
  topBar: {
    flexDirection: 'row',
    gap: 15,
    justifyContent: 'center',
    marginVertical: 20,
  },
  navButton: {
    backgroundColor: '#34495e',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },  
  navButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
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
    elevation: 2,
  },
  tileStart: {
    backgroundColor: '#3498db',
  },
  tileCorrect: {
    backgroundColor: '#2ecc71',
  },
  tileBlack: {
    backgroundColor: '#2c3e50',
  },
  tileWalkables: {
    backgroundColor: '#2ecc71',
  },
  tileGoal: {
    backgroundColor: '#f1c40f', // gold
  },
  tileEmpty: {
    backgroundColor: '#dcdde1', // grey
  },
  playerIcon: {
    fontSize: 26,
  },
  playerTile: {
    borderWidth: 3,
    borderColor: '#0000FF',
  },
  controls: {
    marginTop: 20,
  },
  dpadButton: {
    backgroundColor: '#2980b9',
    borderRadius: 10,
    padding: 15,
    margin: 5,
  },
  dpadText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
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
  countdownText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e67e22',
    marginBottom: 10,
  },
  gameOverText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginTop: 20,
  },
  gameWonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#27ae60',
    marginTop: 20,
  },
  gameOverContainer: {
    marginTop: 30,
  },
  retryButton: {
    backgroundColor: '#9b59b6',
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  retryText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  }
});

export default GameScreen;