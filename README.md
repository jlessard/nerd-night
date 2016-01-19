# Nerd Night
Angular 2 + Express + Node + Mongo

### Development

```sh
$ git clone git@github.com:jlessard/nerd-night.git nerd-night
$ cd nerd-night
$ npm install gulp -g
$ npm install
$ gulp
http://localhost:3000
```

### Live Reload
Install Chrome Browser Extension:
https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei

### App Structure
* /api - express server
* /app - angular 2
* /assets - images + 3rd party js/css
* /dist - created via gulp, front end is served from here, changes will be overwritten
* index.html - layout file for front end