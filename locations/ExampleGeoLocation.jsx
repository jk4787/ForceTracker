import React from "react";
import Geocode from "react-geocode";
import debug from "sabio-debug";
import GeoLocation from "./GeoLocation";
import LocationMapModal from "./LocationMapModal";

const _logger = debug.extend("LocationGeoLocation");

class ExampleGeoLocation extends React.Component {
  state = {
    isMapShown: false,
  };

  toggleMap = () => {
    this.setState((prevState) => {
      return { ...prevState, isMapShown: !this.state.isMapShown };
    });
  };

  onGeoLocatedSuccess = (props) => {
    _logger("onGeoLocatedSuccess: props.coords", props.coords);
    _logger("onGeoLocatedSuccess: latitude", props.coords.latitude);
    _logger("onGeoLocatedSuccess: longitude", props.coords.longitude);
    const { latitude, longitude } = props.coords ? props.coords : null;

    try {
      if (latitude && longitude) {
        this.setState((prevState) => {
          return {
            ...prevState,
            latitude,
            longitude,
          };
        });
      } else {
        throw Error(
          "onGeoLocatedSuccess: react-geolocated did not return coordinates"
        );
      }
    } catch (e) {
      _logger("onGeoLocatedSuccess: catch error", e);
    }
  };

  onGeoLocatedError = (props) => {
    _logger("onGeoLocatedError", props);
  };

  render() {
    return (
      <div>
        <GeoLocation
          onSuccess={this.onGeoLocatedSuccess}
          onError={this.onGeoLocatedError}
        />
        {this.state.latitude && this.state.longitude && (
          <LocationMapModal
            lat={this.state.latitude}
            lng={this.state.longitude}
            isMapShown={this.state.isMapShown}
            toggleMap={this.toggleMap}
          />
        )}
      </div>
    );
  }
}

Geocode.setApiKey("AIzaSyAbEZEkV2fJ64NuNswAanF3Xel2fYV69nc");

export default ExampleGeoLocation;
