[![Cert-Client Logo]([https://electronjs.org/images/electron-logo.svg)](https://electronjs.org](https://cdn.discordapp.com/attachments/1105276174814421122/1228782011376734238/Captura_de_tela_2024-04-13_155806-transformed-removebg-preview.png?ex=662d4b6d&is=661ad66d&hm=7ef613f278f446437376b0e2320da614109024cd961df66b71bd2293be9bb541&))

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

## Instalação/Pacotes nescessarios

Para instalar os recursos nescessarios para usar nosso aplicativo voce precisa baixar esses recursos em sua maquina : 

* A porra do nome do arquivo 
```sh
Bota a porra dos comando em ordem e dizer o que e cada 1 tmj
```
* AI copia e colar se precisar de mais de 1 e edita 
```sh
Bota a porra dos comando em ordem e dizer o que e cada 1 tmj
```
* ai faz uma aba pros comando linux tambem 
```sh
Bota a porra dos comando em ordem e dizer o que e cada 1 tmj
```


## Suporte para plataformas

Essas são as plataformas/sistemas operacionais que nosso aplicativo funciona sem problemas.

* Aqui vai dizer em que plataformas roda a porra do projeto provavelmente em tudo mais tem que testar fds
*ai bota um topico pra cada 1 tipo de plataforma igual ai em baixo
* Linux: The prebuilt binaries of Electron are built on Ubuntu 20.04. They have also been verified to work on:
  * Ubuntu 18.04 and newer
  * Fedora 32 and newer
  * Debian 10 and newer


## Documentação

* [electronjs.org/docs](https://electronjs.org/docs) - Documento de requisitos
* [electron/fiddle](https://github.com/electron/fiddle) - se quiser outro copia e cola o codigo ai 


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

## License

[MIT](https://github.com/electron/electron/blob/main/LICENSE)

When using Electron logos, make sure to follow [OpenJS Foundation Trademark Policy](https://trademark-policy.openjsf.org/).
