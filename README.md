# chat-widget

> Universal chat widget

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


local adapter development:
based on http://justjs.com/posts/npm-link-developing-your-own-npm-modules-without-tears

npm link: symbolic links to the rescue
Fortunately npm provides a tool to avoid this tedium. And it's easy to use. But there's a catch.

Here's how it's supposed to work:

1. cd to src/appy

2. Run "npm link". This creates a symbolic link from a global folder to the src/appy folder.

3. cd to src/mysite

4. Run "npm link appy". This links "node_modules/appy" in this particular project to the global folder, so that "require" calls looking for appy wind up loading it from your development folder, src/appy.

Mission accomplished... almost. If you installed Node in a typical way, using MacPorts or Ubuntu's apt-get, then npm's "global" folders are probably in a location shared system-wide, like /opt/local/npm or /usr/lib/npm. And this is not good, because it means those "npm link" commands are going to fail unless you run them as root.

