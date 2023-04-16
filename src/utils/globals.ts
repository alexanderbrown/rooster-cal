/*!
 * These functions adapted from Add-To-Calendar Button, full license as below:
 * 
 *  @preserve
 *
 *  ++++++++++++++++++++++
 *  Add to Calendar Button
 *  ++++++++++++++++++++++
 *
 *  Version: 2.2.5
 *  Creator: Jens Kuerschner (https://jenskuerschner.de)
 *  Project: https://github.com/add2cal/add-to-calendar-button
 *  License: Elastic License 2.0 (ELv2) (https://github.com/add2cal/add-to-calendar-button/blob/main/LICENSE.txt)
 *  Note:    DO NOT REMOVE THE COPYRIGHT NOTICE ABOVE!
 *
 */

// CHECKING FOR SPECIFIC DEVICED AND SYSTEMS
const isBrowser = () => {
    if (typeof window === 'undefined') {
      return false;
    } else {
      return true;
    }
  };
  
  const isWebView = isBrowser()
  ? () => {
      if (/(; ?wv|(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari))/i.test(navigator.userAgent || navigator.vendor)) {
        return true;
      } else {
        return false;
      }
    }
  : () => {
      return false;
    };
const atcbDefaultTarget = isWebView() ? '_system' : '_blank';

export {atcbDefaultTarget}