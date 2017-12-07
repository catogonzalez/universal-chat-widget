# Universal Chat Widget

An open source live web chat widget that connects to any backend. It is created with the remarkable Vue.js for real-time user interaction.

![Chat Widget Screen Shot](/screen-shot.png?raw=true "Chat Widget Screen Shot")

## Modular backend connectivity 

The UCW design decouples the presentation and backend communication layers with the use of *adapters*: we currently have adapters for:

* Rails Action Cable [chat-adapter-action-cable](https://github.com/catogonzalez/chat-adapter-action-cable)
* Rocket Chat [chat-adapter-rocketchat](https://github.com/catogonzalez/chat-adapter-rocketchat)

If you need to connect to a different backend, create your own *adapter* and start using live web chat to that platform. We are welcoming contributors who can work on adapters for any chat platform including the popular Slack and Hipchat. In [our wiki](https://github.com/catogonzalez/universal-chat-widget/wiki), we will write instructions on how to build adapters, although it is very easy if you look at the code for the existing adapters. 

## Prerequisites
You will need a backend server to respond to user messages: it may be a rails API/app that implements Action Cable or an instance of Rocket.Chat

## Getting Started

```bash
mkdir my-chat-widget
cd my-chat-widget
git clone https://github.com/121services/universal-chat-widget
npm run dev
```

From a web browser console, create an instance of the chat widget:
```javascript
myWidget = new UniversalChatWidget.Widget(config)
```
A sample *config* object is described below. Then, you can use the widget *methods*:
```javascript
myWidget.open();
myWidget.isOpen();
myWidget.sendMessage(text);
myWidget.on(event, callback);
myWidget.isEmbedded();
myWidget.close();
```

### Sample config

```json
{
    "adapter": "ActionCable", # one of ActionCable or RocketChat (required)
    "element": "#chat-widget",# css selector of element to replace in DOM when the chat widget renders (required)
    "position": "bottom-right", # or embedded
    "showAvatars": true, 
    "allowUploads": true,
    "poweredByText": "121 Services", # yes, you can change this :)
	"poweredByHost": "https://121.services", # and this!
    "adapterConfig": {
        "backendUrl": "https://my-backend.co/cable",
        "initData": {
            "endpoint": "/start",
            "method": "post",
            "data": {
                "appId": "c683b9da-c908-4407-97dd-91e6bf2552d1"
            }
        }
    }
})
```
More details on configuration will be documented in this repo's wiki. In the meantime, feel free to [open an issue](https://github.com/catogonzalez/universal-chat-widget/issues) with your question and we will respond there.

 
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

## Built With

* [Vue.js](https://vuejs.org/) - The Progressive JavaScript Framework

## Contributing

If you have a feature request or found a bug, please open an issue [here](https://github.com/catogonzalez/universal-chat-widget/issues)

Help with developing and maintaining the code is welcome. Please read [CONTRIBUTING.md](https://github.com/catogonzalez/universal-chat-widget/contributing.md) for details on our code of conduct, and the process for submitting pull requests.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/catogonzalez/universal-chat-widget/tags). 

## Authors

* **Carlos Gonzalez** - *Initial work* - [catogonzalez](https://github.com/catogonzalez)

This project was initially created and is sponsored by [121 Services](https://121.services); you build chatbots? use 121 Services' Bot Platform: it integrates with anything that has an API. 

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

The initial Vue.js package was built following this [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
