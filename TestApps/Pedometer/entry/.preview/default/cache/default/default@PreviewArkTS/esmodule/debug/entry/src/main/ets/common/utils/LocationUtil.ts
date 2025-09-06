import geoLocationManager from "@ohos:geoLocationManager";
class LocationUtil {
    geolocationOn(locationChange: (location: geoLocationManager.Location) => void): void {
        let requestInfo: geoLocationManager.LocationRequest = {
            'priority': 0x203,
            'scenario': 0x300,
            'timeInterval': 0,
            'distanceInterval': 0,
            'maxAccuracy': 0
        };
        try {
            geoLocationManager.on('locationChange', requestInfo, locationChange);
        }
        catch (err) {
            console.error("locationChange error:" + JSON.stringify(err));
        }
    }
    geolocationOff(): void {
        geoLocationManager.off('locationChange');
    }
}
let locationUtil = new LocationUtil();
export default locationUtil as LocationUtil;
