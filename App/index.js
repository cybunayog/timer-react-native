/* eslint-disable spaced-comment */
/*********************
 *     Libraries     *
 *********************/
import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Dimensions, Picker, Platform } from 'react-native';
import { Audio } from 'expo-av';

/*********************
 *       Files       *
 *********************/
const startAudio = require('timer/audio/lickity.m4a');
const endAudio = require('timer/audio/thanksDylan.m4a');


/*********************
 *      Styles       *
 *********************/
const screen = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07121B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    borderWidth: 10,
    borderColor: "#89AAFF",
    width: screen.width / 2,
    height: screen.width / 2,
    borderRadius: screen.width / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  buttonStop: {
    borderColor: "#FF851B",
  },
  buttonText: {
    fontSize: 45,
    color: "#89AAFF",
  },
  buttonTextStop: {
    color: "#FF851B",
  },
  timerText: {
    color: "#fff",
    fontSize: 90,
  },
  picker: {
    width: 50,
    ...Platform.select({
      android: {
        color: "#fff",
        backgroundColor: "#07121B",
        marginLeft: 10,
      }
    }),
  },
  pickerItem: {
    color: "#fff",
    fontSize: 20,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

/*********************
 *  State Handlers   *
 *********************/
/**
 * Formats single digit numbers
 * @param {Integer} number 
 * 
 * EX) 3 => 03, 10 => 10
 */
const formatNumber = (number) => `0${number}`.slice(-2)

/**
 * Gets remaining time
 *  
 * @param {Integer} time
 */
const getRemaining = (time) => { //if time = 6753
  const hours = Math.floor(time/3600); // hours = 1
  const minutes = Math.floor(time/60) - (hours * 60); // minutes = 112 - 60 = 52
  const seconds = (time - (minutes * 60) - (hours * 3600)); // seconds = 6753 - 3120 - 3600 = 33
  return {
    hours: formatNumber(hours),
    minutes: formatNumber(minutes),
    seconds: formatNumber(seconds)
  };
};

/**
 * Increments numbers based on parameter's length
 */
const createArray = length => {
  // Incrementing numbers
  const arr = [];
  let i = 0;
  while (i < length) {
    arr.push(i.toString());
    i += 1;
  }
  return arr;
};

/*********************
 * Global Variables  *
 *********************/
const AVAILABLE_HOURS = createArray(10); // Max 10
const AVAILABLE_MINUTES = createArray(60); // Max 60
const AVAILABLE_SECONDS = createArray(60); // Max 60
const playbackObject = new Audio.Sound();


/*********************
 *   Audio Handler   *
 *********************/

const handleAudio = async (audio) =>  {
  try {
    await playbackObject.unloadAsync();
    await playbackObject.loadAsync(audio);
    await playbackObject.playAsync();
  } catch (err) {
    console.log(`You gone goof'd: ${err}`);
  }
};

const handleLoopAudio = async (audio) => {
  try {
    await playbackObject.unloadAsync();
    await playbackObject.loadAsync(audio);
    await playbackObject.replayAsync({isLooping: true});
  } catch (err) {
    console.log(`You gone goof'd: ${err}`);
  }
}


/*********************
 *   App Component   *
 *********************/
export default class App extends Component {

/***************************
 *     Initial States      *
 ***************************/
state = {
  remainingSeconds: 5,
  isRunning: false,
  selectedHours: "0",
  selectedMinutes: "0",
  selectedSeconds: "5",
};

interval = null;
  
/***************************
 * State Handler Functions *
 ***************************/
  
/**
 *  Handles when timer reaches 0
 */
componentDidUpdate(prevProp, prevState) {
  if (this.state.remainingSeconds === 0 && prevState.remainingSeconds !== 0) {
    this.stop();
  }
  
}

/**
 * Clears interval
 */
componentWillUnmount() {
  if (this.interval) {
    // Avoiding memory links
    clearInterval(this.interval);
  }
}
  
 
/**
 * Starts timer countdown, interval of 1000ms
 * 
 * Audio start playing
 */
start = () => {
  this.setState(state => ({
      // count down seconds
      remainingSeconds: parseInt(state.selectedHours, 10) * 3600 + parseInt(state.selectedMinutes, 10) * 60 + parseInt(state.selectedSeconds, 10),
      isRunning: true,
    }));
  
  handleLoopAudio(startAudio);
    
  this.interval = setInterval(() => {
    // the interval is being run in 1000ms, and subtracting the seconds
    this.setState(state => ({
      remainingSeconds: state.remainingSeconds - 1,
    }));
  }, 1000);
};

/**
 * Stops timer countdown when reaches 0, 
 */
stop = () => {
  clearInterval(this.interval);
  this.interval = null;
  this.setState({
    remainingSeconds: 5, // Temporary
    isRunning: false,
  });
  handleAudio(endAudio);
}
  
 
 
/***************************
 * Functional Components   *
 ***************************/

/**
 * Renders scrollable pickers for minutes & seconds
 */
renderPickers = () => (
  <View style={styles.pickerContainer}>
    {/* Hours */}
    <Picker
      style={styles.picker}
      itemStyle={styles.pickerItem}
      selectedValue={this.state.selectedHours}
      onValueChange={itemValue => {
          // Update the state
          this.setState({selectedHours: itemValue});
          }}
      mode="dropdown"
    >
      {AVAILABLE_HOURS.map(value => (
        <Picker.Item key={value} label={value} value={value} />
        ))}
    </Picker>
    <Text style={styles.pickerItem}>hours</Text>

    {/* Minutes */}
    <Picker
      style={styles.picker}
      itemStyle={styles.pickerItem}
      selectedValue={this.state.selectedMinutes}
      onValueChange={itemValue => {
          // Update the state
          this.setState({selectedMinutes: itemValue});
          }}
      mode="dropdown"
    >
      {AVAILABLE_MINUTES.map(value => (
        <Picker.Item key={value} label={value} value={value} />
        ))}
    </Picker>
    <Text style={styles.pickerItem}>minutes</Text>

    {/* Seconds */}
    <Picker
      style={styles.picker}
      itemStyle={styles.pickerItem}
      selectedValue={this.state.selectedSeconds}
      onValueChange={itemValue => {
          // Update the state
          this.setState({selectedSeconds: itemValue});
          }}
      mode="dropdown"
    >
      {AVAILABLE_SECONDS.map(value => (
        <Picker.Item key={value} label={value} value={value} />
        ))}
    </Picker>
    <Text style={styles.pickerItem}>seconds</Text>
  </View>
  );
  
  render() {
    /**
     * Initial render to App.js
     */
    const {hours, minutes, seconds} = getRemaining(this.state.remainingSeconds);
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        {this.state.isRunning ? (
          // if running, render what we currently have
          <Text style={styles.timerText}>{`${hours}:${minutes}:${seconds}`}</Text>
        ) : (
          this.renderPickers()
        )}

        {this.state.isRunning ? (
          // if running, render stop button
          <TouchableOpacity onPress={this.stop} style={[styles.button, styles.buttonStop]}>
            <Text style={[styles.buttonText, styles.buttonTextStop]}>Stop</Text>
          </TouchableOpacity>
        ) : (
          // else, render start button
          <TouchableOpacity onPress={this.start} style={styles.button}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        )}
      </View>
      );
    }
}
