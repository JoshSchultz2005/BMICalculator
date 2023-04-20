import React, { Component } from 'react';
import {
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Pressable,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 2000);

const assessment = " Assessing Your BMI"+"\n \t \t"+"Underweight: less than 18.5"+"\n \t \t"+"Healthy: 18.5 to 24.9"+"\n \t \t"+"Overweight: 25.0 to 29.9"+"\n \t \t"+"Obese: 30.0 or higher";

const HeightKey = '@MyApp:Height';
const BMIKey = '@MyApp:BMI';
const contentKey = '@MyApp:Content';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.onLoad();
    this.state = { 
      Weight: '',
      Height: '',
      BMI: 0,
      content: false,
    };
  }

  onLoad = async () => {
    try {
      const height = await AsyncStorage.getItem(HeightKey);
      const bmi = await AsyncStorage.getItem(BMIKey);
      const SavedContent = await AsyncStorage.getItem(contentKey);
      this.setState({ Height: height });
      this.setState({ BMI: bmi });
      this.setState({ content: SavedContent });
    } catch (error) {
      console.log(error)
    }
  }

  onSave = async () => {
    const height = this.state.Height; 
    const calculatedBMI = ((this.state.Weight / (this.state.Height * this.state.Height)) * 703).toFixed(1);
    this.setState({ BMI: calculatedBMI});
    this.setState({ content: true});
    try {
      await AsyncStorage.setItem(HeightKey, height);
      await AsyncStorage.setItem(BMIKey, calculatedBMI);
      await AsyncStorage.setItem(contentKey, JSON.stringify(this.state.content));
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.main}>
        <Text style={styles.toolbar}>BMI Calculator</Text>
        <ScrollView style={styles.main}>
          <TextInput 
            style={styles.input} 
            placeholder={'Weight in Pounds'}
            value={this.state.Weight}
            onChangeText={(weight) => this.setState({Weight: weight})}
          >
          </TextInput>
          <TextInput 
            style={styles.input} 
            placeholder={'Height in Inches'}
            value={this.state.Height}
            onChangeText={(height) => this.setState({Height: height})}
          >
          </TextInput>
          <Pressable style={styles.button} onPress={this.onSave}>
            <Text style={styles.buttonText}>
              Compute BMI
            </Text>
          </Pressable>
          <ScrollView style={styles.BMIInfoView}>
            {
            this.state.content ? <Text style={styles.BMIInfo}>Body Mass Index is {this.state.BMI}</Text> : null
            }
          </ScrollView>
          <Text style={styles.assessment}>
            {assessment}
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  toolbar: {
    backgroundColor: '#f4511e',
    color: 'white',
    fontSize: 28,
    padding: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 5
  },
  input: {
    backgroundColor: '#f5f5f5',
    fontSize: 24,
    padding: 5,
    margin: 5
  },
  button: {
    backgroundColor: '#34495e',
    margin: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    padding: 10,
    textAlign: 'center',
  },
  BMIInfoView: {
    marginBottom: 75,
    marginTop: 75,
  },
  BMIInfo: {
    fontSize: 28,
    textAlign: 'center',
  },
  assessment: {
    fontSize: 20,
  }
});