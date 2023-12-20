import  { useContext} from 'react';
import { View, Text, Button } from 'react-native';
import { AuthContext } from '../context/AuthContext';


const HomeScreen = () => {
    const { logout } = useContext(AuthContext);
    
    return (
        <View>
            <Text style={{marginBottom: 100, fontSize: 30}}>Home Screen</Text>
            {/* Logout Button */}
            <Button title="Logout" onPress={logout} />
        </View>
    );
};

export default HomeScreen;