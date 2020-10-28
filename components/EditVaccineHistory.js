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

export default class EditVaccineHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: "",
      name: "",
      vaccine_history: "",
      assetsLoaded: false,
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      Electrolize: require("../assets/fonts/Electrolize.otf"),
    });
    this.setState({ assetsLoaded: true });
  }

  _handleText = (name) => {
    return (text) => {
      this.setState({ [name]: text });
    };
  };

  render() {
    if (!this.state.assetsLoaded) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#74B43F" />
        </View>
      );
    }
    let { name } = this.props.navigation.state.params;
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={styles.wrapper}
      >
        <View style={styles.container}>
          <Text style={styles.title}>
            {"Adding record of vaccine for " + name}
          </Text>
          <TextInput
            placeholder="Vaccine"
            style={styles.textInput}
            value={this.state.name}
            onChangeText={this._handleText("name")}
          />

          <DatePicker
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
          <TouchableOpacity style={styles.btn} onPress={this._handleEdit}>
            <Text style={styles.buttonText}>EDIT</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
  _handleEdit = async () => {
    if (this.state.date == "" || this.state.name == "") {
      alert("Write all fields");
      return;
    }
    let { id } = this.props.navigation.state.params;

    db.transaction((tx) => {
      tx.executeSql(
        "SELECT `vaccine_history` FROM 'animals' WHERE id=?",
        [id],
        (tx, res) => {
          let lol = res.rows._array[0];
          let { vaccine_history } = lol;
          vaccine_history =
            this.state.name +
            "      " +
            this.state.date +
            "\r\n" +
            vaccine_history;
          tx.executeSql(
            "UPDATE `animals` SET `vaccine_history`=? WHERE id=?",
            [vaccine_history, id],
            (tx, res) => {
              alert("Success!");
              this.setState({ date: "", name: "" });
            },
            (tx, err) => {
              alert(err);
              alert("Something went wrong");
            }
          );
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
