# ffn-client

## Installation 

```sh
$ npm i shlink-client

# Or with yarn

$ yarn add shlink-client
```

## API

### SwimmerProfile

```ts
import { SwimmerProfile } from 'ffn-client';

const profile = new SwimmerProfile('1979311');

profile.fetch()
    .then(data => JSON.stringify(data, null, 2))
    .then(console.log);
```

See examples in [this directory](./examples).


### More to come ...