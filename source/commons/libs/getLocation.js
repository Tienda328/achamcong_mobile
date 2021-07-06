import Geolocation from '@react-native-community/geolocation';

/**
 * 
 * @returns {latitude, longitude}
 */

export default function getLocation() {
    return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
            (position) => {
                console.log({position})
                resolve(position);
            },
            (error) => {
                reject(error)
            },
            {
                enableHighAccuracy: false
            }
        );
    })
}
