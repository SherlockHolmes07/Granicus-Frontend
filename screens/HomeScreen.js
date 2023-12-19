import  { useContext} from 'react';
import { View, Text, Button } from 'react-native';
import { AuthContext } from '../context/AuthContext';


const HomeScreen = () => {
    const { logout } = useContext(AuthContext);
    return (
        <View>
            {/* Logout Button */}
            <Button title="Logout" onPress={logout} />
            <Text>Home Screen</Text>
        </View>
    );
};

export default HomeScreen;