import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
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
    flex: 1,
    color: "#74B43F",
    fontFamily: "Electrolize",
    textAlign: "center",
    textAlignVertical: "center",
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
      onPress={() => {
        navigation.state.params.callback(go, title);
        navigation.goBack();
      }}
    >
      <Text style={styles.text}>{title.toString()}</Text>
    </TouchableOpacity>
  );
}

export default class SelectType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      token: "",
      data: [],
    };
  }
  async componentDidMount() {
    await Font.loadAsync({
      Electrolize: require("../assets/fonts/Electrolize.otf"),
    });
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM 'types'",
        [],
        (tx, res) => {
          this.setState({ data: res.rows._array, isLoading: false });
          this.initialData = res.rows._array;
        },
        (tx, err) => {
          alert(err);
        }
      );
    });
  }

  _searchFilterFunction = (text) => {
    if (!text || text === "") {
      this.setState({ data: this.initialData });
      return;
    }
    const newData = this.initialData.filter((item) => {
      const itemData = `${item.name.toString().toUpperCase()}`;

      const textData = text.toString().toUpperCase();

      return itemData.indexOf(textData) > -1;
    });
    this.setState({ data: newData });
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#74B43F" />
        </View>
      );
    }
    return (
      <View style={{ flex: 1, paddingTop: 20 }}>
        <TextInput
          placeholder="Type"
          autoCapitalize="none"
          onChangeText={(text) => this._searchFilterFunction(text)}
          style={styles.textInput}
        />
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <Item
              title={item.name}
              go={item.id}
              navigation={this.props.navigation}
            />
          )}
          keyExtractor={({ id }) => id.toString()}
        />
      </View>
    );
  }
}
