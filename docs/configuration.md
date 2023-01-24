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

> ### config.useNative
>
> ##### Type: `boolean`
>
> ##### Default: `false`
>
> ##### Description: Defines whenever to use native share.

##

> ### config.shareOptions
>
> ##### Type: `ShareOptions`
>
> > ```js
> > {
> >  shareOptions: {
> >    facebook: {
> >       templateUrl: '...',
> >       display: true,
> >       title: 'facebook',
> >       icon: '...'
> >    },
> >    linkdin: {
> >       templateUrl: '...',
> >       display: false,
> >       title: 'linkdin',
> >       icon: '...'
> >    }
> >  }
> > }
> > ```
