## Configuration

Configuration parameters could be provided upon instantiation of the share instance.

```js
var config = {
  shareUrl: '', //will take the current url
  enableTimeOffset: true,
  useNative: false
};
```

#### Configuration Structure

```js
{
  shareUrl: string,
  embedUrl: string,
  enableTimeOffset: boolean,
  useNative: boolean,
  shareOptions: ShareOptions,
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

##

> ### config.embedUrl
>
> ##### Type: `string`
>
> ##### Description: Defines the embed url.

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
> ##### Description: Defines whenever to use native share (uses native share API).

##

> ### config.shareOptions
>
> ##### Type: `ShareOptions`
>
> > ```js
> > {
> >  shareOptions: {
> >    facebook: {
> >       templateUrl: 'https://www.facebook.com/sharer/sharer.php?u={shareUrl}',
> >       display: true,
> >       title: 'facebook',
> >       icon: '...'
> >    },
> >    linkedin: {
> >      templateUrl: 'https://www.linkedin.com/shareArticle?mini=true&url={shareUrl}',
> >      display: true,
> >      title: 'linkedin',
> >      icon: '...'
> >    },
> >    twitter: {
> >      display: true,
> >      templateUrl: 'https://twitter.com/share?url={shareUrl}',
> >      title: 'share.share-on-twitter',
> >      icon: '...'
> >   },
> >   email: {
> >     templateUrl: 'mailto:?subject=Check out {description}&body=Check out {description} - {shareUrl}',
> >     display: true,
> >     title: 'share.email',
> >     icon: {
> >      'fill-rule': 'evenodd',
> >      'clip-rule': 'evenodd',
> >       d: '...'
> >     }
> >   },
> >   embed: {
> >     templateUrl: '<iframe src="{embedUrl}" style="width: 560px;height: 395px" allowfullscreen webkitallowfullscreen mozAllowFullScreen frameborder="0" allow="accelerometer *; autoplay *; encrypted-media *; gyroscope *; picture-in-picture *"/>',
> >     display: true,
> >     title: 'share.embed',
> >     icon: '...'
> >   }
> > }
> > ```

##

> ### config.uiComponent
>
> ##### Type: `KPUIComponentOptions`
>
> ##### Description: Defines the ui components configuration.

##

> See guide [ui-components](https://github.com/kaltura/playkit-js-ui/blob/master/docs/ui-components.md)
