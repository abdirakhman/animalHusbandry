import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';


import Profile from './components/Profile';
import Check from './components/Check';
import Edit from './components/Edit';
import Insert from './components/Insert';
import Request from './components/Request';
import RequestByType from './components/RequestByType';
import Revision from './components/Revision';
import Scanner from './components/Scanner';
import SelectType from './components/SelectType';
import ViewAll from './components/ViewAll';
import Types from './components/Types';
import AddType from './components/AddType';
import AskRevision from './components/AskRevision';
import ViewInformation from './components/ViewInformation';
import EditVaccineHistory from './components/EditVaccineHistory';
import EditDiseaseHistory from './components/EditDiseaseHistory';

const MainNavigator = createStackNavigator({
  Home: {screen: Profile},
  Profile: {screen: Profile},
  AskRevision : {screen : AskRevision},
  Check : {screen : Check},
  Edit : {screen : Edit},
  Insert : {screen : Insert},
  Request : {screen : Request},
  RequestByType : {screen : RequestByType},
  Scanner : {screen : Scanner},
  SelectType : {screen : SelectType},
  Revision : {screen : Revision},
  ViewAll : {screen : ViewAll},
  Types : {screen : Types},
  AddType : {screen : AddType},
  ViewInformation : {screen : ViewInformation},
  EditVaccineHistory : {screen : EditVaccineHistory},
  EditDiseaseHistory : {screen : EditDiseaseHistory},
},
{
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  }
});

const App = createAppContainer(MainNavigator);

export default App;
