# User management service

This package provides some utilities for user management from the _express_ route
down to the mongoose data layer.

## How to use

It's quite simple, just do:

```javascript
import users from 'user-management-service';

const unless = {
  path: [
    { url: /\/signup/ },
    { url: /\/login/ }
  ]
};

mongoose.Promise = Promise;

const app = express();
app.use(bodyParser.json());
app.use(users({ secret: 'somesecret', app, unless, mongoose }));
```

The options required are:

 - secret: some string secret used to encode and decode the tokens
 - app: the _express_ app
 - mongoose: the _mongoose_ object used on your project
 - unless: the endpoints you don't want to be authenticated

In case you want the _login_ and _signup_ to be in different sub-endpoints:

```javascript
const unless = {
  path: [
    { url: /\/your\/endpoint\/signup/ },
    { url: /\/your\/endpoint\/login/ }
  ]
};

app.use('/your/endpoint', users({ ..., unless }));
```

## Implementation details

This package saves the users in an `users` collection on mongodb, requiring the
fields `username`, `password` and `email` and accepting a `role` field.

We don't implement anything related to ACLs, so you can use your own
implementation or use some third party library.

## TODO

- Implement Facebook login
- Implement Google login
