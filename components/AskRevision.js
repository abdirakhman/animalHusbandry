import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as Font from "expo-font";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
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
  title: {
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Electrolize",
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
  contentContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around",
  },
});

export default class AskRevision extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      type: {},
    };
  }
  async componentDidMount() {
    await Font.loadAsync({
      Electrolize: require("../assets/fonts/Electrolize.otf"),
    });
    this.setState({ isLoading: false });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.type !== this.state.type) {
      this.props.navigation.navigate("Revision", {
        type: "type",
        id: this.state.type,
      });
    }
  }
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
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#74B43F" />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{"Choose what you want to do"}</Text>
        <View>
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              this.props.navigation.navigate("SelectType", {
                callback: this._returnType,
              });
            }}
          >
            <Text style={styles.text}>{"By Type"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              this.props.navigation.navigate("Revision", {
                type: "all",
                id: -1,
              });
            }}
          >
            <Text style={styles.text}>{"All"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
