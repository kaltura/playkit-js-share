// @flow
declare type ShareSocialNetwork = {
  display: boolean,
  templateUrl: string,
  title: string,
  svg: any
};

declare type ShareSocialNetworks = {
  [name: string]: ShareSocialNetwork
};
