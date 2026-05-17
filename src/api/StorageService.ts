import AsyncStorage from "@react-native-async-storage/async-storage";

const StorageService = {
  getValue(key: string) {
    return AsyncStorage.getItem(key);
  },

  setValue(key: string, value: string) {
    return AsyncStorage.setItem(key, value);
  },

  multiSet(values: [string, string][]) {
    return AsyncStorage.multiSet(values);
  },

  multiRemove(keys: string[]) {
    return AsyncStorage.multiRemove(keys);
  },
};

export default StorageService;
