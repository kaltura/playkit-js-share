// @flow
declare type ShareSocialNetwork = {
  templateUrl: string,
  title: string,
  ariaLabel: string,
  svg: string
};

declare type ShareSocialNetworks = {
  [name: string]: ShareSocialNetwork
};
