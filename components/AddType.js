import React from 'react';
import * as Font from 'expo-font';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  ActivityIndicator } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("Animals.db");

export default class AddType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name : '',
      assetsLoaded : false,
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      'Electrolize': require('../assets/fonts/Electrolize.otf'),
    });
    this.setState({ assetsLoaded: true });
  }

  _handleText = (name) => {
    return text => {
      this.setState({[name] : text});
    }
  }
  
  

  render() {
    if (!this.state.assetsLoaded) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#74B43F"/>
        </View>
      );
    }
    return (
      <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={styles.wrapper}>
        <View style={styles.container}>
          <Text style={styles.title}>Adding the type</Text>
          
          <TextInput
          placeholder="Name"
          style={styles.textInput}
          value={this.state.name}
          onChangeText={this._handleText('name')}
          />
          
          <TouchableOpacity style={styles.btn} onPress={this._handleinsert}>
            <Text style={styles.buttonText}>ADD</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
  _handleinsert = async () => {
    if (this.state.name == '') {
      alert("Write all fields");
      return;
    }
    db.transaction(tx => {
      tx.executeSql("INSERT INTO 'types' (id, name) VALUES (null, ?)", 
      [this.state.name], 
      (tx, res) => {
        alert("Success! Id is " + res.insertId);
        this.setState({name : ''});
        this.props.navigation.goBack();
      },
      (tx, err) => {
        alert(err);
        alert("Something went wrong");
      }
      )
    });
  }
}



const styles = StyleSheet.create({
  title : {
    marginBottom : 20,
    fontFamily : 'Electrolize',
  },
  wrapper: {
    flex: 1,
  },
  container: {
    flex : 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  datePicker : {
    width : 200,
    height: 40,
    borderColor: 'gray',
    marginBottom: 20,
  },
  buttonInput : {
    width : 200,
    fontFamily : 'Electrolize',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    justifyContent : 'center',
    marginBottom: 20,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
  textInput : {
    width : 200,
    fontFamily : 'Electrolize',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
  btn : {
    borderWidth : 1,
    borderColor : 'gray',
    paddingHorizontal : 20,
    alignItems : 'center',
    padding : 5,
    backgroundColor : '#74B43F',
  },
  buttonText : {
    color : 'white',
    fontFamily : 'Electrolize',
  },
  chooseText : {
    fontFamily : 'Electrolize',
  }
});
