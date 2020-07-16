import React from 'react';
import * as Font from 'expo-font';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase("Animals.db");
import * as FileSystem from 'expo-file-system';

const DATA = [
  {
    id : '1',
    data : {
      first : {
        title: 'INSPECT',
        go: "Scanner",
        params : {type : 'Request'}
      },
      second : {
        title: 'ADD',
        go: "Insert",
      },
    }
  },
  {
    id : '2',
    data : {
      first : {
        title: 'ANIMALS',
        go: "ViewAll",
      },
      second : {
        title : "TYPES",
        go : "Types",
      }
    }
  },
  {
    id : '3',
    data : {
      first : {
        title: "EDIT",
        go: "Scanner",
        params : {type : 'Edit'}
      },
      second : {
        title: 'REVISION',
        go: 'AskRevision',
      }
    }
  }
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop : 50,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    fontFamily: "Electrolize",
  },
  text: {
    fontFamily : 'Electrolize',
    color : 'white',
    fontSize : 20,
    textAlign : 'center',
  },
  items : {
    width  : 30,
  },
  btn : {
    display : 'flex',
    height : 125,
    width : 125,
    justifyContent : 'center',
    alignItems : 'center',
    backgroundColor: '#74B43F',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
  },
  contentContainer : {
    flex : 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
  }
});

const Item = ({data, navigation}) => {
  return (
    <View
    style = {{
      justifyContent:'space-around',
      flexDirection : 'row'
    }}
    >
    <TouchableOpacity
      style = {styles.btn}
      onPress = {() => navigation.navigate(data.first.go, (data.first.params ? data.first.params : {}))}
    >
    <Text
      style={styles.text}
    >{data.first.title}</Text>
    </TouchableOpacity>
    {data.second &&
    (<TouchableOpacity
      style = {styles.btn}
      onPress = {() => navigation.navigate(data.second.go, (data.second.params ? data.second.params : {}))}
    >
    <Text
      style={styles.text}
    >{data.second.title}</Text>
    </TouchableOpacity>)
    }
    </View>
  );
}

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assetsLoaded: false,
    }
  }
  async componentDidMount() {
    await Font.loadAsync({
      'Electrolize': require('../assets/fonts/Electrolize.otf'),
    });
    
    db.transaction(tx => {
      tx.executeSql("CREATE TABLE IF not EXISTS `animals` (\
        `id` integer PRIMARY KEY AUTOINCREMENT,\
        `name` TEXT NOT NULL,\
        `gender` TEXT NOT NULL,\
        `active` TEXT NOT NULL,\
        `type_name` varchar(50) NOT NULL,\
        `type_id` integer not null,\
        `date` date NOT NULL,\
        `vaccine_history` text NOT NULL,\
        `disease_history` text NOT NULL,\
        `ancestors` text NOT NULL\
      );");
      tx.executeSql("CREATE TABLE IF NOT EXISTS `types` (\
        `id` INTEGER PRIMARY KEY AUTOINCREMENT,\
        `name` text NOT NULL\
      );");
    });
    const obj = await FileSystem.getInfoAsync(FileSystem.documentDirectory + '/SQLite/')
    console.log(obj);
    this.setState({ assetsLoaded: true });
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
      <View style={styles.container}>
        <View style={{justifyContent : 'center', alignItems : 'center'}}>
        <Text style={styles.title}> Abdirakhman's Animal Husbandry App </Text>
        </View>
        <FlatList
          data={DATA}
          contentContainerStyle={styles.contentContainer}
          renderItem={({ item }) => (
            <Item
              data={item.data}
              navigation={this.props.navigation}
            />
          )}
          keyExtractor={item => item.id}
        />
      </View>
    );
  }
}
