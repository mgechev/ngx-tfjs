# Developing

Use the default project in the application to test with an existing app. Make sure you first build the library before the app:

```shell
$ ng build --configuration development ngx-tfjs
$ ng serve
```

To publish the library:

```shell
$ cd projects/ngx-tfjs
# Edit the version
$ vim package.json
$ npm run build
$ cd ../../dist/ngx-tfjs
$ npm publish
```
