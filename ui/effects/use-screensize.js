// Widths are taken from "ui/scss/init/vars.scss"
import useMedia from './use-media';

export function useIsMobile() {
  const isMobile = useMedia(['(min-width: 901px)'], [false], true);
  return isMobile;
}

export function useIsMediumScreen() {
  const isMedium = useMedia(['(min-width: 1151px)'], [false], true);
  return isMedium;
}

export function useIsLargeScreen() {
  const isLarge = useMedia(['(min-width: 1601px)'], [false], true);
  return !isLarge;
}
