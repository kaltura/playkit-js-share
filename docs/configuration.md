## Configuration

Configuration parameters could be provided upon instantiation of the share instance.

```js
var config = {
  'shareUrl': '', //will take the current url
  'enableTimeOffset': true,
  'useNative': false
};
```

#### Configuration Structure

```js
{
  shareUrl: string,
  enableTimeOffset: boolean,
  useNative: boolean,
  socialNetworks: ShareSocialNetworks,
  embedBaseUrl?: string, // optional
  uiConfId?: string, // optional
  partnerId?: string, // optional
  entryId?: string, // optional
  uiComponent?: KPUIComponentOptions // optional
}
```

##

> ### config.shareUrl
>
> ##### Type: `string`
>
> ##### Default: `parnet url`
>
> ##### Description: Defines the share url.
>

##

> ### config.enableTimeOffset
>
> ##### Type: `boolean`
>
> ##### Default: `true`
>
> ##### Description: Whether to show the start time.

##

> ### config.useNative
>
> ##### Type: `boolean`
>
> ##### Default: `false`
>
> ##### Description: Defines whenever to use native share.
>

##

> ### config.socialNetworks
>
> ##### Type: `ShareSocialNetworks`
>
> ##### Default: `null`
>
> ##### Description: Defines the social network object.
>

##

> ### config.socialNetworks.templateUrl
>
> ##### Type: `string`
>
> ##### Description: Defines the template for specific social network.
>

##

> ### config.socialNetworks.title
>
> ##### Type: `string`
>
> ##### Description: Defines the title for a social network.

##

> ### config.socialNetworks.svg
>
> ##### Type: `any`
>
> ##### Description: Defines path property in svg.
##

> ### config.uiComponent
>
> ##### Type: `KPUIComponentOptions`
>
> ##### Description: Defines the ui components configuration.

##
> See guide [ui-components](https://github.com/kaltura/playkit-js-ui/blob/master/docs/ui-components.md)
