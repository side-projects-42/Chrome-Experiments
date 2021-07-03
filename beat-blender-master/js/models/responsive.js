//

//

/**
 * this modules responsibility is to set breakpoints for the view and apply a css-style
 * for its appropriate dimensions
 */

export const DESKTOP = "desktop";
export const MOBILE_PORTRAIT = "mobile-portrait";
export const MOBILE_LANDSCAPE = "mobile-landscape";
export const TABLET = "tablet";

const queries = [
  ["(max-width: 479px)", MOBILE_PORTRAIT],
  ["(orientation: landscape) and (max-height: 440px)", MOBILE_LANDSCAPE],
  ["(max-width: 991px)", TABLET],
];

export function is(layout) {
  return get() === layout;
}

export function get() {
  if (!window.matchMedia) {
    //possibly a really old browser, if so its desktop
    return DESKTOP;
  }

  for (let i = 0; i < queries.length; i++) {
    const q = queries[i];
    if (window.matchMedia(q[0]).matches) {
      return q[1];
    }
  }
  return DESKTOP;
}
