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
import DatePicker from 'react-native-datepicker';
import RNPickerSelect from 'react-native-picker-select';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("Animals.db");

export default class InsertThing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date : '',
      type : {},
      name : '',
      gender : '',
      assetsLoaded : false,
      disease_history : '',
      vaccine_history : '',
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
  _returnType = (_id, _name) => {
    this.setState(prevState => ({
      type: {
        ...prevState.type,
        name: _name,
        id : _id,
      }
    }));
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
          <Text style={styles.title}>Adding the animal</Text>
          
          <TextInput
          placeholder="Name"
          style={styles.textInput}
          value={this.state.name}
          onChangeText={this._handleText('name')}
          />
          <RNPickerSelect
            useNativeAndroidPickerStyle={false}
            onValueChange={(value) => this.setState({gender : value})}
            style={pickerSelectStyle}
            value={this.state.gender}
            items={[
              { key : "1", label: 'Male', value: 'Male' },
              { key : "2", label: 'Female', value: 'Female' },
            ]}
          />
          <TouchableOpacity
              onPress={() => this.props.navigation.navigate('SelectType', {callback : this._returnType})}
              style={styles.buttonInput}
          >
          {this.state.type.name ? (
          <Text style={styles.chooseText}>
          {this.state.type.name}
          </Text>
          ) : (
            <Text style={[styles.chooseText, {color : '#C7C7CD'}]}>
            {'Choose a type'}
            </Text>
          ) }

          </TouchableOpacity>

          <DatePicker
            style={styles.datePicker}
            customStyles= {{
              placeholderText : {
                fontFamily : 'Electrolize',
                alignSelf: 'stretch',
                padding: 10,
              },
              dateText : {
                alignSelf: 'stretch',
                padding: 10,
                fontFamily : 'Electrolize',
              },
              dateInput : {
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                borderBottomRightRadius: 5,
                borderBottomLeftRadius: 5,
                borderWidth : 1,
                textAlign : 'right',
                borderColor: 'gray',
              }
            }}
            date={this.state.date}
            mode="date"
            placeholder="Select date"
            format="YYYY-MM-DD"
            minDate="2000-01-01"
            showIcon={false}
            maxDate="2050-01-01"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            onDateChange={(date) => {this.setState({date: date})}}
          />
          <TextInput
          placeholder="Vaccine History"
          style={[styles.textInput, {height : 100}]}
          value={this.state.vaccine_history}
          onChangeText={this._handleText('vaccine_history')}
          />
          <TextInput
          placeholder="Disease History"
          style={[styles.textInput, {height : 100}]}
          value={this.state.disease_history}
          onChangeText={this._handleText('disease_history')}
          />

          <TouchableOpacity style={styles.btn} onPress={this._handleinsert}>
            <Text style={styles.buttonText}>ADD</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
  _handleinsert = async () => {
    if (this.state.date == '' || this.state.type == '' || this.state.gender == '' || this.state.gender == null) {
      alert("Write all fields");
      return;
    }
    db.transaction(tx => {
      tx.executeSql("INSERT INTO 'animals' (id, name, gender, active, type_name, type_id, date, vaccine_history, disease_history, ancestors) VALUES (null, ?, ?, 'Alive', ?, ?, ?, ?, ?, '')", 
      [this.state.name, this.state.gender, this.state.type.name, this.state.type.id, this.state.date, this.state.vaccine_history, this.state.disease_history], 
      (tx, res) => {
        alert("Success! Id is " + res.insertId);
        this.setState({type : {}, gender : '', name : '', date : '', disease_history : '', vaccine_history : ''});
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
const pickerSelectStyle = StyleSheet.create({
  inputIOS : {
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
  inputAndroid : {
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
});
