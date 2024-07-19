***

<h1 align="center">
Pbinfo Solver
</h1>

***

Pbinfo solver is a browser extension for firefox and chrome that injects solutions from solinfo.ro into the pbinfo.ro code editor automatically. It also has a few quality of life features like hiding the extension scrolling through solutions and showing your original code.

To activate this extension just click on the extension icon in the top right and click the pbinfo solver extension. This will inject the buttons and make the needed requests.


### Developing :

This repo makes the extension for both chrome and firefox so it uses the `gulp` builder to make build the extension files. 

First installing the project just requires a `git clone` and an `npm install`:
```
git clone https://github.com/insertokername/pbinfo-solver.git
cd pbinfo-solver
npm install
```

To build the project run
```
npm run build
```

And then a directory named build will appear that has both a firefox and a chrome folder. The extension is built in the folder respective to your browser. [This](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked) tutorial made by google shows how to install the unpacked extension for **chrome**. And [this](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/) tutorial show how to do it for **firefox**.


### General Desing

Like any other extension this has a `content.js` and a `background.js`.

- `content.js`: is responsable for loading the elements of the extension and to comunicate with the background when they get pressed.

- `background.js`: is responsable for fetching solutions and editing the pbinfo `Editor` variable that is loaded because pbinfo uses CodeMirror for the code editor element.


The folder names are pretty self explanatory:

- `src`: is for the actual code that goes into the extension

- `vendor`: is  for any platform specific code like for example the `manifest.json` files

- `images`: they are just the icons of the extension