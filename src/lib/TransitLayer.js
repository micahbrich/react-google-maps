import {
  MAP,
  TRANSIT_LAYER,
} from "./constants";
import {
  addDefaultPrefixToPropTypes,
  collectUncontrolledAndControlledProps,
  default as enhanceElement,
} from "./enhanceElement";

import PropTypes from "prop-types";
/* global google */
import _ from "lodash";
import createReactClass from "create-react-class";

const controlledPropTypes = {
  // NOTICE!!!!!!
  //
  // Only expose those with getters & setters in the table as controlled props.
  //
  // [].map.call($0.querySelectorAll("tr>td>code", function(it){ return it.textContent; })
  //    .filter(function(it){ return it.match(/^set/) && !it.match(/^setMap/); })
  //
  // https://developers.google.com/maps/documentation/javascript/3.exp/reference#TransitLayer
  options: PropTypes.object,
};

const defaultUncontrolledPropTypes = addDefaultPrefixToPropTypes(controlledPropTypes);

const eventMap = {
  // https://developers.google.com/maps/documentation/javascript/3.exp/reference#TransitLayer
  // [].map.call($0.querySelectorAll("tr>td>code"), function(it){ return it.textContent; })
};

const publicMethodMap = {
  // Public APIs
  //
  // https://developers.google.com/maps/documentation/javascript/3.exp/reference#TransitLayer
  //
  // [].map.call($0.querySelectorAll("tr>td>code"), function(it){ return it.textContent; })
  //    .filter(function(it){ return it.match(/^get/) && !it.match(/Map$/); })
  // END - Public APIs
};

const controlledPropUpdaterMap = {
  options(transitLayer, options) { transitLayer.setOptions(options); },
};

function getInstanceFromComponent(component) {
  return component.state[TRANSIT_LAYER];
}

export default _.flowRight(
  createReactClass,
  enhanceElement(getInstanceFromComponent, publicMethodMap, eventMap, controlledPropUpdaterMap),
)({
  displayName: `TransitLayer`,

  propTypes: {
    ...controlledPropTypes,
    ...defaultUncontrolledPropTypes,
  },

  contextTypes: {
    [MAP]: PropTypes.object,
  },

  getInitialState() {
    // https://developers.google.com/maps/documentation/javascript/3.exp/reference#TransitLayer
    const transitLayer = new google.maps.TransitLayer({
      map: this.context[MAP],
      ...collectUncontrolledAndControlledProps(
        defaultUncontrolledPropTypes,
        controlledPropTypes,
        this.props
      ),
    });
    return {
      [TRANSIT_LAYER]: transitLayer,
    };
  },

  componentWillUnmount() {
    const transitLayer = getInstanceFromComponent(this);
    if (transitLayer) {
      transitLayer.setMap(null);
    }
  },

  render() {
    return false;
  },
});
