import AsyncStorage from '@react-native-async-storage/async-storage';

export const setUserAsyncData = async (value) => {
    try {

        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem('@device', jsonValue)

    } catch (e) {
        console.log('error in setUserAsyncData', e.message);
    }
}


export const getUserAsyncData = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('@device')
       
        return JSON.parse(jsonValue);
    } catch (e) {
        console.log('error in setUserAsyncData', e.message);
    }
}

export const clearUserAsyncData = async () => {
    try {
        AsyncStorage.clear()
    } catch (e) {
        console.log('error in clearUserAsyncData', e.message);
    }
}