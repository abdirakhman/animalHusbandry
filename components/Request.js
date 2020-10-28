import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import * as SQLite from "expo-sqlite";
import { TouchableOpacity } from "react-native-gesture-handler";
const db = SQLite.openDatabase("Animals.db");

function getMin(a, b) {
  if (a < b) return a;
  else return b;
}

function ViewInfo({ found, navigation, data }) {
  if (found === true) {
    return (
      <>
        <TouchableOpacity
          style={styles.btn}
          onPress={() =>
            navigation.navigate("ViewInformation", {
              data: data,
              info: "vaccine_history",
              pretty_info: "vaccine history",
            })
          }
        >
          <Text style={styles.textStyle}>{"View Vaccine History"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() =>
            navigation.navigate("ViewInformation", {
              data: data,
              info: "disease_history",
              pretty_info: "disease history",
            })
          }
        >
          <Text style={styles.textStyle}>{"View Disease History"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() =>
            navigation.navigate("ViewInformation", {
              data: data,
              info: "ancestors",
              pretty_info: "ancestors",
            })
          }
        >
          <Text style={styles.textStyle}>{"View Ancestors"}</Text>
        </TouchableOpacity>
      </>
    );
  } else {
    return (
      <>
        <View style={styles.btn}>
          <Text style={styles.textStyle}>{"View Vaccine History"}</Text>
        </View>
        <View style={styles.btn}>
          <Text style={styles.textStyle}>{"View Disease History"}</Text>
        </View>
        <View style={styles.btn}>
          <Text style={styles.textStyle}>{"View Ancestors"}</Text>
        </View>
      </>
    );
  }
}

var deviceWidth = Dimensions.get("window").width;
var deviceHeight = Dimensions.get("window").height;
var boxHeight = getMin((deviceHeight * 4) / 5, 500);

export default class Request extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: true, found: false };
    this.componentDidMount = this.componentDidMount.bind(this);
  }
  async componentDidMount() {
    let given_id = this.props.navigation.state.params.id;

    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM `animals` WHERE id=?",
        [given_id],
        (tx, res) => {
          if (res.rows.length > 0)
            this.setState({ dataSource: res.rows._array[0], found: true });
          else {
            this.setState((prevState) => ({
              dataSource: {
                ...prevState.dataSource,
                name: "Not Found",
                active: "Not Found",
                type_name: "Not Found",
                date: "Not Found",
                gender: "Not Found",
              },
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
  }
  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, padding: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
        }}
      >
        <Text style={styles.title}> Animal Information </Text>
        <View style={styles.box}>
          <View style={styles.whiteBox}>
            <Text style={styles.textStyle}>
              {"Name: " + this.state.dataSource.name.toString()}
            </Text>
          </View>
          <View style={styles.greenBox}>
            <Text style={styles.textStyle}>
              {"Gender: " + this.state.dataSource.gender.toString()}
            </Text>
          </View>
          <View style={styles.whiteBox}>
            <Text style={styles.textStyle}>
              {"Active: " + this.state.dataSource.active}
            </Text>
          </View>
          <View style={styles.greenBox}>
            <Text style={styles.textStyle}>
              {"Type: " + this.state.dataSource.type_name}
            </Text>
          </View>
          <View style={styles.whiteBox}>
            <Text style={styles.textStyle}>
              {"Date: " + this.state.dataSource.date}
            </Text>
          </View>
        </View>
        <ViewInfo
          data={this.state.dataSource}
          navigation={this.props.navigation}
          found={this.state.found}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2896d3",
  },
  text: {
    color: "#fff",
  },
  title: {
    fontSize: 20,
    paddingBottom: 36,
    fontFamily: "Electrolize",
  },
  box: {
    borderWidth: 3,
    height: getMin((deviceHeight * 2) / 5, 500),
    width: (deviceWidth * 9) / 10,
    borderColor: "#74B43F",
    marginBottom: 20,
  },
  whiteBox: {
    flex: 1,
    backgroundColor: "white",
  },
  greenBox: {
    flex: 1,
    backgroundColor: "#EEFCE8",
  },
  textStyle: {
    fontSize: 22,
    justifyContent: "center",
    marginLeft: 10,
    color: "#74B43F",
    paddingTop: 1,
    fontFamily: "Electrolize",
  },
  btn: {
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
    width: (deviceWidth * 9) / 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
