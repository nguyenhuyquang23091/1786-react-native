// NOTE: The default React Native styling doesn't support server rendering.
// Server rendered styles should not change between the first render of the HTML
// and the first render on the client. Typically, web developers will use CSS
// media queries to achieve a similar result.
export function useColorScheme() {
  // The value 'light' is used as the default, so that when rendering on the
  // server the client and server match. This is important for hydration to
  // work correctly.
  return 'light';
}