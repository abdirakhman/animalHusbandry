import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import * as Font from 'expo-font';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("Animals.db");



const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#74B43F',
    fontFamily : 'Electrolize',
    textAlign : 'center',
  },
  textgrey: {
    color: 'grey',
    fontFamily : 'Electrolize',
    textAlign : 'center',
  },
  textInput : {
    marginBottom : 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    backgroundColor : 'white',
    borderWidth : 1,
    fontFamily: 'Electrolize',
    height : 45,
    marginHorizontal : 30,
    padding: 16,
  },
  item : {
    backgroundColor : '#EEFCE8',
    borderWidth : 3,
    height : 45,
    marginHorizontal : 30,
    alignSelf : 'stretch',
    marginBottom : 10,
    borderColor : '#74B43F',
    justifyContent : 'center',
    alignItems : 'center',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
  itemgrey : {
    backgroundColor : '#EEFCE8',
    borderWidth : 3,
    height : 45,
    marginHorizontal : 30,
    alignSelf : 'stretch',
    marginBottom : 10,
    borderColor : 'grey',
    justifyContent : 'center',
    alignItems : 'center',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
});

function Item({ title, go, navigation, active }) {  
  return (
  <TouchableOpacity
    style={active == "Alive" ? styles.item : styles.itemgrey}
    onPress={() => navigation.navigate('Request', { id : go.toString() })}
  >
  <Text style={active == "Alive" ? styles.text : styles.textgrey}>{title.toString()}</Text>
  </TouchableOpacity>
);
}



export default class RequestStaff extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      data : [],
    };
  }
  async componentDidMount() {
    await Font.loadAsync({
      'Electrolize': require('../assets/fonts/Electrolize.otf'),
    });
    const { navigation } = this.props;
    let kek = navigation.state.params.id;
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM `animals` WHERE type_id=?", [kek], 
      (tx, res) => {
        this.setState({isLoading : false, data : res.rows._array});
        this.initialData = res.rows._array;
      },
      (tx, err) => {
        alert("Something went wrong");
        alert(err);
      }
      )
    }
    )
  }

  _searchFilterFunction = text => {
    if (!text || text === '') {
      this.setState({data : this.initialData});
      return;
    }
    const newData = this.initialData.filter(item => {
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
          <ActivityIndicator size="large" color="#74B43F"/>
        </View>
      );
    }
    return (
      <View style={{ flex: 1, paddingTop: 20 }}>
        <TextInput
          placeholder="Animal"
          autoCapitalize="none"
          onChangeText={text => this._searchFilterFunction(text)}
          style={styles.textInput}
        />
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <Item
              title={item.name}
              go={item.id}
              active={item.active}
              navigation={this.props.navigation}
            />
          )}
          keyExtractor={({ id }) => id}
        />
      </View>
    );
  }
}
