
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, Button } from "react-native";
// the package we are using for naviigation uses a native navigation stack

const Stack = createNativeStackNavigator();

export default function Navigation() {
    return(
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name = "NavRoot"
                    component={NavRoot}
                />
                <Stack.Screen
                    name = "NavExample1"
                    component={NavExample1}
                />
                <Stack.Screen
                    name = "NavExample2"
                    component={NavExample2}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

function NavRoot ({navigation}: any) {
    return(
        <View>
            <Text> Hi from navigation</Text>
            <Button
                title = "EXAMPLE 1"
                onPress={() => {
                    navigation.navigate("NavExample1");
                }}
            />
            <Button
                title = "EXAMPLE 2"
                onPress={() => {
                    navigation.navigate("NavExample2",{data: "SOME RELEVANT INFO"});
                }}
            />
        </View>
    );
}
function NavExample1(){
    return(
        <View>
            <Text> Nav Example 1</Text>
        </View>
    );
}

function NavExample2({navigation, route}: any){
    return(
        <View>
            <Text> Nav Example 2. Some data: {route.params.data}</Text>
        </View>
    );
}