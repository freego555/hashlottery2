import { _global, maxMobileSize } from '../constants';
import { setAppVersion } from '../store/actionCreators/config';

/**
 * Changing version of app on window resize
 **/

export default function resize() {
  window.matchMedia(`(max-width: ${maxMobileSize}px)`).addListener(() => {
    _global.store.dispatch(setAppVersion({ isMobile: !_global.store.getState().config.isMobile }));
  });
}
