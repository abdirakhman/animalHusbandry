import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from "react-native";

function getMin(a, b) {
  if (a < b) return a;
  else return b;
}

var deviceWidth = Dimensions.get("window").width;
var deviceHeight = Dimensions.get("window").height;

export default class ViewInformation extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: true };
  }
  render() {
    let { info, pretty_info } = this.props.navigation.state.params;
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
        }}
      >
        <Text style={styles.title}> Animal's {pretty_info} Information </Text>
        <SafeAreaView style={styles.box}>
          <ScrollView style={styles.whiteBox}>
            <Text style={styles.textStyle}>
              {this.props.navigation.state.params.data[
                info.toString()
              ].toString()}
            </Text>
          </ScrollView>
        </SafeAreaView>
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
    fontSize: 15,
    justifyContent: "center",
    marginLeft: 10,
    color: "#74B43F",
    paddingTop: 1,
    flex: 1,
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
