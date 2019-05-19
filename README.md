# MyMoney Angular App

UI for MyMoney by Eviratec

## Develop / deploy

1. Install dependencies: `$ npm install`
2. Update config entries in `/src/app/modules/app/config.es` to point to [MyMoney by Eviratec Web API](https://github.com/eviratec/mymoney-web-api)
3. Build dist files using Gulp: `$ ./node_modules/gulp/bin/gulp.js dist`
4. Serve files in `/dist` folder using Nginx, Apache, etc. (See Nginx config file example: `nginx.example.conf`)

## License

```
Copyright (c) 2019 Callan Peter Milne

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
```
