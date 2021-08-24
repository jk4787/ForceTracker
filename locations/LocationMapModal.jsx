import React, { useState } from "react";
import { Button, Modal, ModalBody } from "reactstrap";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
} from "react-google-maps";
import mapStyles from "./mapStyles";
import PropTypes from "prop-types";
import debug from "sabio-debug";

const _logger = debug.extend("LocationMapModal");

const LocationMapModal = (locationMapProps) => {
  // the following are required props
  const {
    lat,
    lng,
    infoWindowContent,
    isMapShown,
    toggleMap,
  } = locationMapProps;

  _logger("LocationMapModal: locationMapProps", locationMapProps);

  const [isOpen, setIsOpen] = useState(infoWindowContent ? true : false);

  const MyMapComponent = withScriptjs(
    withGoogleMap((props) => (
      <GoogleMap
        defaultZoom={12}
        defaultCenter={{
          lat: props.lat,
          lng: props.lng,
        }}
        defaultOptions={{ styles: mapStyles }}
      >
        {props.isMarkerShown && (
          <Marker
            position={{
              lat: props.lat,
              lng: props.lng,
            }}
            onClick={() =>
              props.infoWindowContent
                ? props.setIsOpen(true)
                : props.setIsOpen(false)
            }
          >
            {isOpen && (
              <InfoWindow
                position={{
                  lat: props.lat,
                  lng: props.lng,
                }}
                onCloseClick={() => props.setIsOpen(false)}
              >
                <div>{props.infoWindowContent}</div>
              </InfoWindow>
            )}
          </Marker>
        )}
      </GoogleMap>
    ))
  );

  return (
    <Modal
      isOpen={!isMapShown}
      toggle={toggleMap}
      //   className={className}
      backdrop={true}
      size={"lg"}
      backdropClassName={"backdropMapModal"}
    >
      <ModalBody>
        <MyMapComponent
          lat={lat}
          lng={lng}
          isMarkerShown
          infoWindowContent={infoWindowContent}
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${googleMapsApi}&v=3.exp&libraries=geometry,drawing,places`}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `400px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      </ModalBody>
      <Button color="secondary" onClick={toggleMap}>
        Close
      </Button>
    </Modal>
  );
};

LocationMapModal.propTypes = {
  lat: PropTypes.number,
  lng: PropTypes.number,
  isMarkerShown: PropTypes.func,
  infoWindowContent: PropTypes.string,
  setIsOpen: PropTypes.func,
  isOpen: PropTypes.bool,
};

const googleMapsApi = "AIzaSyAbEZEkV2fJ64NuNswAanF3Xel2fYV69nc";

export default LocationMapModal;
