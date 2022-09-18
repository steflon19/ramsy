# Ramsy - A vanilla node middleware server

[![Software License][ico-license]](LICENSE.md)

This package was created for the technical part of an interview process. It includes basic functionality of a Node.js middleware server that can exposes varius REST endpoints for a frontend to connect to. This package makes use of native node packages.
## Structure


```
bin/
src/
tests/
```

## Exposed endpoints
### GET Endpoints
### "/"
The homepage, returns an H2 html tag containing "homepage"
### "/ping"
Alive check, returns "pong!"
### "/version"
Returns the currently running node version of the server
### "/images"
Fetches images for given `size` and `offset` search parameters. Will return images with IDs > `offset` and < `offset` + `size` or all other images if no size is specified.
### "/Nicholas"
Returns all posts of the user Nicholas
### "/Romaguera"
Returns all posts from users working in the Romaguera group
### "/sorted-users"
Returns all users with allowed website domains, sorted alphabetically by their hometown
### "/new-todos"
If todos have been saved via the corresponding post request, they can be retrieved on this route

### POST endpoints
### "/"
Posting a TODO of the form `{"userId": <number>, "title": <string>, "completed": <boolean>}` to the root endpoint will save a new TODO on the server. Only unique TODO titles will be saved.
## Install

``` bash
npm i
```

## Usage
Starts the server [here][link-localhost]
``` bash
npm run start
```


## Testing
Runs a set of basic tests. The server needs to be running for some of the tests to succeed.
``` bash
npm run test
```

## Security

If you discover any security related issues, please email steflon@protonmail.com instead of using the issue tracker.

## Credits

- [Stefan Lontschar][link-author]

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.

[ico-version]: https://img.shields.io/packagist/v/:vendor/:package_name.svg?style=flat-square
[ico-license]: https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square
[ico-travis]: https://img.shields.io/travis/:vendor/:package_name/master.svg?style=flat-square
[ico-scrutinizer]: https://img.shields.io/scrutinizer/coverage/g/:vendor/:package_name.svg?style=flat-square
[ico-code-quality]: https://img.shields.io/scrutinizer/g/:vendor/:package_name.svg?style=flat-square
[ico-downloads]: https://img.shields.io/packagist/dt/:vendor/:package_name.svg?style=flat-square

[link-author]: https://github.com/steflon19
[link-localhost]: http://localhost:8040
