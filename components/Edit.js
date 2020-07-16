import React from "react";
import * as Font from "expo-font";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import DatePicker from "react-native-datepicker";
import RNPickerSelect from "react-native-picker-select";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("Animals.db");

function ViewInfo({ found, navigation, _name }) {
  if (found === true) {
    return (
      <>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() =>
            navigation.navigate("EditVaccineHistory", {
              id: navigation.state.params.id,
              name: _name,
            })
          }
        >
          <Text style={styles.textStyle}>{"Edit Vaccine History"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() =>
            navigation.navigate("EditDiseaseHistory", {
              id: navigation.state.params.id,
              name: _name,
            })
          }
        >
          <Text style={styles.textStyle}>{"Edit Disease History"}</Text>
        </TouchableOpacity>
      </>
    );
  } else {
    return (
      <>
        <View style={styles.editBtn}>
          <Text style={styles.textStyle}>{"Edit Vaccine History"}</Text>
        </View>
        <View style={styles.editBtn}>
          <Text style={styles.textStyle}>{"Edit Disease History"}</Text>
        </View>
      </>
    );
  }
}

export default class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: "",
      type: {},
      name: "",
      gender: "",
      assetsLoaded: false,
      disease_history: "",
      vaccine_history: "",
      _active: "",
      active: "",
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      Electrolize: require("../assets/fonts/Electrolize.otf"),
    });
    let kek = this.props.navigation.state.params.id;

    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM `animals` WHERE id=?",
        [kek],
        (tx, res) => {
          if (res.rows.length > 0) {
            let lol = res.rows._array[0];
            this.setState((prevState) => ({
              ...prevState,
              ...lol,
              found: true,
            }));
            this.setState({ _active: this.state.active });
          } else {
            this.setState((prevState) => ({
              ...prevState,
              name: "Not Found",
              active: "Not Found",
              _active : "Not Found",
              type_name: "Not Found",
              date: "Not Found",
              gender: "Not Found",
            }));
            this.setState({ found: false });
            alert("Not found");
          }
          this.setState({ isLoading: false });
        },
        (tx, err) => {
          alert(err);
        }
      );
    });
    this.setState({ assetsLoaded: true });
  }

  _handleText = (name) => {
    return (text) => {
      this.setState({ [name]: text });
    };
  };
  _returnType = (_id, _name) => {
    this.setState((prevState) => ({
      type: {
        ...prevState.type,
        name: _name,
        id: _id,
      },
    }));
  };

  render() {
    if (!this.state.assetsLoaded) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#74B43F" />
        </View>
      );
    }
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={styles.wrapper}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Editing the animal</Text>

          <TextInput
            placeholder="Name"
            editable={false}
            style={styles.textInput}
            value={this.state.name}
            onChangeText={this._handleText("name")}
          />
          <RNPickerSelect
            useNativeAndroidPickerStyle={false}
            onValueChange={(value) => this.setState({ _active: value })}
            style={pickerSelectStyle}
            value={this.state._active}
            items={[
              { key: "1", label: "Alive", value: "Alive" },
              { key: "2", label: "Dead", value: "Dead" },
            ]}
          />
          <RNPickerSelect
            useNativeAndroidPickerStyle={false}
            onValueChange={(value) => this.setState({ gender: value })}
            style={pickerSelectStyle}
            disabled={true}
            value={this.state.gender}
            items={[
              { key: "1", label: "Male", value: "Male" },
              { key: "2", label: "Female", value: "Female" },
            ]}
          />
          <View
            onPress={() =>
              this.props.navigation.navigate("SelectType", {
                callback: this._returnType,
              })
            }
            style={styles.buttonInput}
          >
            {this.state.type_name ? (
              <Text style={styles.chooseText}>{this.state.type_name}</Text>
            ) : (
              <Text style={[styles.chooseText, { color: "#C7C7CD" }]}>
                {"Choose a type"}
              </Text>
            )}
          </View>

          <DatePicker
            disabled={true}
            style={styles.datePicker}
            customStyles={{
              placeholderText: {
                fontFamily: "Electrolize",
                alignSelf: "stretch",
                padding: 10,
              },
              dateText: {
                alignSelf: "stretch",
                padding: 10,
                fontFamily: "Electrolize",
              },
              dateInput: {
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                borderBottomRightRadius: 5,
                borderBottomLeftRadius: 5,
                borderWidth: 1,
                textAlign: "right",
                borderColor: "gray",
              },
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
            onDateChange={(date) => {
              this.setState({ date: date });
            }}
          />
          <ViewInfo
            _name={this.state.name}
            navigation={this.props.navigation}
            found={this.state.found}
          />
          {this.state.found === true ? (
            <TouchableOpacity style={styles.btn} onPress={this._handleEdit}>
              <Text style={styles.buttonText}>EDIT</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.btn} onPress={this._handleEdit}>
              <Text style={styles.buttonText}>EDIT</Text>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    );
  }
  _handleEdit = async () => {
    if (this.state.active == this.state._active || this.state._active == null) {
      alert("Nothing to change");
      return;
    }
    let { id } = this.props.navigation.state.params;

    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE `animals` SET `active`=? WHERE id=?",
        [this.state._active, id],
        (tx, res) => {
          this.setState({ active: this.state._active });
          alert("Success!");
        },
        (tx, err) => {
          alert(err);
          alert("Something went wrong");
        }
      );
    });
  };
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 20,
    fontFamily: "Electrolize",
  },
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  datePicker: {
    width: 200,
    height: 40,
    borderColor: "gray",
    marginBottom: 20,
  },
  buttonInput: {
    width: 200,
    fontFamily: "Electrolize",
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    justifyContent: "center",
    marginBottom: 20,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
  textInput: {
    width: 200,
    fontFamily: "Electrolize",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
  btn: {
    borderWidth: 1,
    borderColor: "gray",
    paddingHorizontal: 20,
    alignItems: "center",
    padding: 5,
    backgroundColor: "#74B43F",
  },
  editBtn: {
    backgroundColor: "#EEFCE8",
    borderWidth: 3,
    height: 45,
    marginHorizontal: 30,
    marginBottom: 10,
    borderColor: "#74B43F",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    width: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontFamily: "Electrolize",
  },
  chooseText: {
    fontFamily: "Electrolize",
  },
  textStyle: {
    fontSize: 18,
    justifyContent: "center",
    marginLeft: 10,
    color: "#74B43F",
    paddingTop: 1,
    fontFamily: "Electrolize",
  },
});
const pickerSelectStyle = StyleSheet.create({
  inputIOS: {
    width: 200,
    fontFamily: "Electrolize",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
  inputAndroid: {
    width: 200,
    fontFamily: "Electrolize",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
});
