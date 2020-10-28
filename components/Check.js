import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import * as Font from "expo-font";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("Animals.db");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#74B43F",
    fontFamily: "Electrolize",
    textAlign: "center",
  },
  title: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    fontFamily: "Electrolize",
    height: 45,
    marginHorizontal: 30,
    padding: 16,
  },
  titleText: {
    fontFamily: "Electrolize",
    fontSize: 15,
  },
  textInput: {
    marginBottom: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    backgroundColor: "white",
    borderWidth: 1,
    fontFamily: "Electrolize",
    height: 45,
    marginHorizontal: 30,
    padding: 16,
  },
  item: {
    backgroundColor: "#EEFCE8",
    borderWidth: 3,
    height: 45,
    marginHorizontal: 30,
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderColor: "#74B43F",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
});

function Item({ title, go, navigation }) {
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate("Request", { id: go.toString() })}
    >
      <Text style={styles.text}>{title.toString()}</Text>
    </TouchableOpacity>
  );
}

function isForgot(id, used) {
  for (const item of used) {
    if (id === +item) {
      return false;
    }
  }
  return true;
}

function CreateTitle({ navigation }) {
  return (
    <View style={styles.title}>
      <Text style={styles.titleText}>
        {"Revising animals by " +
          navigation.state.params.type +
          " : " +
          navigation.state.params.id.name}
      </Text>
    </View>
  );
}

function CreateTitleAll() {
  return (
    <View style={styles.title}>
      <Text style={styles.titleText}>{"Revising all animals"}</Text>
    </View>
  );
}

export default class Check extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      forgotThings: [],
    };
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  async componentDidMount() {
    await Font.loadAsync({
      Electrolize: require("../assets/fonts/Electrolize.otf"),
    });
    const { navigation } = this.props;
    const used = navigation.state.params.used ?? [];
    let req = "";
    let args = [];
    if (navigation.state.params.type == "type") {
      req = "SELECT * FROM `animals` WHERE type_id=?;";
      args = [navigation.state.params.id.id];
    } else {
      req = "SELECT * FROM `animals`";
    }
    db.transaction((tx) => {
      tx.executeSql(
        req,
        args,
        (tx, res) => {
          let arr = res.rows._array;
          for (let i = 0; i < arr.length; i++) {
            if (isForgot(arr[i].id, used)) {
              this.setState((prevState) => ({
                forgotThings: [...prevState.forgotThings, arr[i]],
              }));
            }
          }
          this.setState({ isLoading: false });
        },
        (tx, err) => {
          alert("Something went wrong");
          alert(err);
        }
      );
    });
  }
  render() {
    if (this.state.isLoading === true) {
      return (
        <View style={{ flex: 1, padding: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View style={{ flex: 1, paddingTop: 20 }}>
        {this.props.navigation.state.params.type == "type" && (
          <CreateTitle navigation={this.props.navigation} />
        )}
        {this.props.navigation.state.params.type == "all" && <CreateTitleAll />}
        <FlatList
          data={this.state.forgotThings}
          renderItem={({ item }) => (
            <Item
              title={item.name}
              go={item.id}
              navigation={this.props.navigation}
            />
          )}
          keyExtractor={({ id }) => id}
        />
      </View>
    );
  }
}
