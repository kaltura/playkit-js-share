## Configuration

Configuration parameters could be provided upon instantiation of the share instance.

```js
var config = {
  shareUrl: '', //will take the current url
  enableTimeOffset: true,
  enableClipping: true,
  useNative: false
};
```

#### Configuration Structure

```js
{
  shareUrl: string,
  embedUrl: string,
  enableTimeOffset: boolean,
  enableClipping: boolean,
  useNative: boolean,
  shareOptions: ShareOptions
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

##
> ### config.enableClipping
>
> ##### Type: `boolean`
>
> ##### Default: `true`
>
> ##### Description: Whether to show the video clipping options.

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
