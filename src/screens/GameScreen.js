import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Button, Animated } from "react-native";


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

    const resetGame = () => {
      setPlayerPos({ row: 0, col: 0});
      setGameStarted(false);
      setGameOver(false);
      setGameWon(false);
      setSteepedTile({});
      setAnimatedTile({});
      setIsMemorizationPhase(true);
      setCountdown(COUNT_DOWN_TIMER);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Level {levelNumber}</Text>

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
            
            {gameOver && (
              <>
                <Text style={styles.gameOverText}>Game Over! ❌</Text>
                <View style={styles.gameOverContainer}>
                  <Button title="Retry" onPress={resetGame} />
                </View>
              </>
            )}
            
            {gameWon &&  (
              <>
                <Text style={styles.gameWonText}>You Win! 🎉</Text>
                <View style={styles.gameOverContainer}>
                  <Button title="Retry" onPress={resetGame} />
                </View>
              </>
            )}
            
            {/* Controls */}
            {isMemorizationPhase ?
              (<Text style={styles.countdownText}> Memorize the path... {countdown} </Text>) 
                :
              (!gameOver && !gameWon) && 
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
              </View>}
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
  tileStart: {
    backgroundColor: '#2196F3',
  },
  tileCorrect: {
    backgroundColor: '#4CAF50',
  },
  tileBlack: {
    backgroundColor: '#000',
  },
  tileWalkables: {
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
  },
  countdownText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 10,
  },
  gameOverText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'red',
    marginTop: 20,
  },
  gameWonText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'green',
    marginTop: 20,
  },
  gameOverContainer: {
    marginTop: 30,
  },
});

export default GameScreen;