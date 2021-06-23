// @flow
declare type ShareSocialNetwork = {
  templateUrl: string,
  title: string,
  svg: string
};

declare type ShareSocialNetworks = {
  [name: string]: ShareSocialNetwork
};
