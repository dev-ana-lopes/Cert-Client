[![Electron Logo](https://electronjs.org/images/electron-logo.svg)](https://electronjs.org)

[![CircleCI Build Status](https://circleci.com/gh/electron/electron/tree/main.svg?style=shield)](https://circleci.com/gh/electron/electron/tree/main)
[![AppVeyor Build Status](https://ci.appveyor.com/api/projects/status/4lggi9dpjc1qob7k/branch/main?svg=true)](https://ci.appveyor.com/project/electron-bot/electron-ljo26/branch/main)
[![Electron Discord Invite](https://img.shields.io/discord/745037351163527189?color=%237289DA&label=chat&logo=discord&logoColor=white)](https://discord.gg/electronjs)

:memo: Available Translations: 🇨🇳 🇧🇷 🇪🇸 🇯🇵 🇷🇺 🇫🇷 🇺🇸 🇩🇪.
View these docs in other languages on our [Crowdin](https://crowdin.com/project/electron) project.

The Electron framework lets you write cross-platform desktop applications
using JavaScript, HTML and CSS. It is based on [Node.js](https://nodejs.org/) and
[Chromium](https://www.chromium.org) and is used by the [Visual Studio
Code](https://github.com/Microsoft/vscode/) and many other [apps](https://electronjs.org/apps).

Follow [@electronjs](https://twitter.com/electronjs) on Twitter for important
announcements.

This project adheres to the Contributor Covenant
[code of conduct](https://github.com/electron/electron/tree/main/CODE_OF_CONDUCT.md).
By participating, you are expected to uphold this code. Please report unacceptable
behavior to [coc@electronjs.org](mailto:coc@electronjs.org).

## Installation

To install prebuilt Electron binaries, use [`npm`](https://docs.npmjs.com/).
The preferred method is to install Electron as a development dependency in your
app:

```sh
npm install electron --save-dev
```

For more installation options and troubleshooting tips, see
[installation](docs/tutorial/installation.md). For info on how to manage Electron versions in your apps, see
[Electron versioning](docs/tutorial/electron-versioning.md).

## Platform support

Each Electron release provides binaries for macOS, Windows, and Linux.

* macOS (Catalina and up): Electron provides 64-bit Intel and ARM binaries for macOS. Apple Silicon support was added in Electron 11.
* Windows (Windows 10 and up): Electron provides `ia32` (`x86`), `x64` (`amd64`), and `arm64` binaries for Windows. Windows on ARM support was added in Electron 5.0.8. Support for Windows 7, 8 and 8.1 was [removed in Electron 23, in line with Chromium's Windows deprecation policy](https://www.electronjs.org/blog/windows-7-to-8-1-deprecation-notice).
* Linux: The prebuilt binaries of Electron are built on Ubuntu 20.04. They have also been verified to work on:
  * Ubuntu 18.04 and newer
  * Fedora 32 and newer
  * Debian 10 and newer

## Quick start & Electron Fiddle

Use [`Electron Fiddle`](https://github.com/electron/fiddle)
to build, run, and package small Electron experiments, to see code examples for all of Electron's APIs, and
to try out different versions of Electron. It's designed to make the start of your journey with
Electron easier.

Alternatively, clone and run the
[electron/electron-quick-start](https://github.com/electron/electron-quick-start)
repository to see a minimal Electron app in action:

```sh
git clone https://github.com/electron/electron-quick-start
cd electron-quick-start
npm install
npm start
```

## Resources for learning Electron

* [electronjs.org/docs](https://electronjs.org/docs) - All of Electron's documentation
* [electron/fiddle](https://github.com/electron/fiddle) - A tool to build, run, and package small Electron experiments
* [electron/electron-quick-start](https://github.com/electron/electron-quick-start) - A very basic starter Electron app
* [electronjs.org/community#boilerplates](https://electronjs.org/community#boilerplates) - Sample starter apps created by the community

## Programmatic usage

Most people use Electron from the command line, but if you require `electron` inside
your **Node app** (not your Electron app) it will return the file path to the
binary. Use this to spawn Electron from Node scripts:

```javascript
const electron = require('electron')
const proc = require('node:child_process')

// will print something similar to /Users/maf/.../Electron
console.log(electron)

// spawn Electron
const child = proc.spawn(electron)
```

### Mirrors

* [China](https://npmmirror.com/mirrors/electron/)

See the [Advanced Installation Instructions](https://www.electronjs.org/docs/latest/tutorial/installation#mirror) to learn how to use a custom mirror.

## Documentation translations

We crowdsource translations for our documentation via [Crowdin](https://crowdin.com/project/electron).
We currently accept translations for Chinese (Simplified), French, German, Japanese, Portuguese,
Russian, and Spanish.

## Contributing

If you are interested in reporting/fixing issues and contributing directly to the code base, please see [CONTRIBUTING.md](CONTRIBUTING.md) for more information on what we're looking for and how to get started.

## Community

Info on reporting bugs, getting help, finding third-party tools and sample apps,
and more can be found on the [Community page](https://www.electronjs.org/community).

## CertClient

<div align="center">

![Cert-Client Logo](https://cdn.discordapp.com/attachments/1105276174814421122/1228785695632527470/Captura_de_tela_2024-04-13_161439-transformed-removebg-preview.png?ex=662d4edb&is=661ad9db&hm=0b3ccfd66c8e03a1e4ac37261347386bf38a095230aabd099039db4dbb1684f3&)

</div>



:memo: O sistema a ser desenvolvido é uma aplicação de software dedicada à conversão de  certificados digitais  
entre os formatos .PFX e .CRT + .KEY.

Ele simplificará os procedimentos associados à manipulação de certificados digitais, proporcionando uma solução eficiente e acessível para qualquer pessoa que necessite converter certificados digitais para suas operações.


## Instalação/Pacotes nescessarios

Para instalar os recursos nescessarios para usar nosso aplicativo voce precisa baixar esses recursos em sua maquina : 
obrigatorios: </br>
NODE: 21.7.1 ou maior 
NPM: 10.5.0 ou maior 

Opcional
NVM: 1.1.12 ou maior 
## Windows:

* Node:
```sh
[Site do Node.js ](https://nodejs.org/en/download)
```
* NPM: 
```sh
npm install
```
* NVM: 
```sh
[Site para baixar o NVM ](https://github.com/coreybutler/nvm-windows/releases)
```
Feito isso para rodar o projeto basta usar esse comando no prompt de comando:
```sh
npm install
npm start
```
## Linux:
* Node:
```sh
[Site do Node.js ](https://nodejs.org/en/download)
```
ou 
```sh
sudo apt update
sudo apt install nodejs
```
* NPM -Ubuntu/Debian-: 
```sh
sudo apt install npm
```
* NVM: 
```sh
[Site para baixar o NVM ](https://www.treinaweb.com.br/blog/instalando-e-gerenciando-varias-versoes-do-node-js-com-nvm#google_vignette)
```
Feito isso para rodar o projeto basta usar esse comando no prompt de comando:
```sh
npm install
npm start
```


## Suporte para plataformas

Essas são as plataformas/sistemas operacionais que nosso aplicativo funciona sem problemas.

* Windows : Todos os sistemas operacionais Windows a partir do Windows 10 para cima funcionão normalmente

* Linux:  Todos os sistemas operacionais a seguir funcionam sem problemas:
  * Ubuntu 23.00 ou maior 

## Documentação

* [Google Docs](https://docs.google.com/document/d/1kjl30448vsoa45gwtAsBqH7xAKObDRxp/edit) - Documento de requisitos

## Quem fez

* Quer saber quem fez essa projeto existir?
  * [GItHub](https://github.com/Vitor-Gabriel-KR) -kroshaResheniye / Vitor-Gabriel-KR
  * [GItHub](https://github.com/D13YSON) - Dieyson / D13YSON
  * [GItHub](https://github.com/delvecch1o) - Rodrigo Pinheiro / delvecch1o
  * [GItHub](https://github.com/nickoolaz) -Nicolas Araujo / nickoolaz
  * [GItHub](https://github.com/dev-ana-lopes) - Ana Lopes / dev-ana-lopes

## License

MIT License

Copyright (c) 2013 Mark Otto.

Copyright (c) 2017 Andrew Fong.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
