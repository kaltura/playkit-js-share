// @flow
declare type ShareConfig = {
  shareUrl?: string,
  embedUrl: string,
  enableTimeOffset: boolean,
  enableClipping: boolean,
  useNative: boolean,
  shareOptions?: ShareOptions,
  embedBaseUrl?: string,
  uiConfId?: string,
  partnerId?: string,
  entryId?: string,
  uiComponent?: KPUIComponentOptions
};
