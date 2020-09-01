import {createStackNavigator, createAppContainer} from 'react-navigation';
import PartiesList from './Components/PartiesList'
import TopFive from './Components/TopFive'
const MainNavigator = createStackNavigator({
  Home: {screen: PartiesList},
  TopFive: {screen: TopFive},
});

const App = createAppContainer(MainNavigator);

export default App;