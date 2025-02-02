import { createStackNavigator } from "@react-navigation/stack";
import UserChat from "../Screens/User/UserChats/UserChat";
import UserChatList from "../Screens/User/UserChats/UserChatList";

const Stack = createStackNavigator();

export default function ChatNavigator() {
    return (
        <Stack.Navigator
            initialRouteName='UserChatList'
            screenOptions={{
                headerShown: false,
            }} >
            <Stack.Screen name='UserChatList' component={UserChatList} />

            <Stack.Screen name='UserChat' component={UserChat} />
        </Stack.Navigator>
    )
}