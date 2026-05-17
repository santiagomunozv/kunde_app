import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import colors from "@theme/colors";
import { useAuthContext } from "@contexts/AuthContext";
import { AgendaPage } from "@pages/agenda/AgendaPage";
import { EventDetailPage } from "@pages/agenda/EventDetailPage";
import { LoginPage } from "@pages/auth/LoginPage";
import { ProfilePage } from "@pages/auth/ProfilePage";
import { RequestsPage } from "@pages/agenda/RequestsPage";
import { SchedulePage } from "@pages/schedule/SchedulePage";
import { AppTabParamList, AuthStackParamList, RootStackParamList } from "./types";

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<AppTabParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginPage} />
    </AuthStack.Navigator>
  );
}

function AppTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.blue,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ color, size }) => {
          const iconName = route.name === "Agenda" ? "calendar-outline" : route.name === "Solicitudes" ? "time-outline" : "person-outline";
          return <Ionicons name={iconName} color={color} size={size} />;
        },
      })}
    >
      <Tabs.Screen name="Agenda" component={AgendaPage} />
      <Tabs.Screen name="Solicitudes" component={RequestsPage} />
      <Tabs.Screen name="Perfil" component={ProfilePage} />
    </Tabs.Navigator>
  );
}

function AppNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="AppTabs" component={AppTabs} />
      <RootStack.Screen name="Schedule" component={SchedulePage} />
      <RootStack.Screen name="EventDetail" component={EventDetailPage} />
    </RootStack.Navigator>
  );
}

export default function MainNavigator() {
  const { bootstrapping, isAuthenticated } = useAuthContext();

  if (bootstrapping) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator color={colors.blue} size="large" />
      </View>
    );
  }

  return <NavigationContainer>{isAuthenticated ? <AppNavigator /> : <AuthNavigator />}</NavigationContainer>;
}

const styles = StyleSheet.create({
  boot: {
    alignItems: "center",
    backgroundColor: colors.lightGray,
    flex: 1,
    justifyContent: "center",
  },
  tabBar: {
    borderTopColor: colors.line,
    backgroundColor: colors.white,
    height: 66,
    paddingBottom: 8,
    paddingTop: 6,
  },
});
