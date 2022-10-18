# Mantenimiento- Backend

Back-end para la aplicación de Mantenimiento. Este es la API del sistema [Mantenimiento-Frontend](http://10.73.82.219/Bonobo.Git.Server/Repository/Detail/801c1d6b-2663-4521-9079-4b0fd1145ef4) y esta conectado a la base de datos Mantenimiento y utiliza registros de la base de datos.

## Informacion
---
Back-end controlador de bbdd Mantenimiento.
El proyecto está realizado en:
- [Node.js](https://nodejs.org/es/)
- [Typrescript](https://www.typescriptlang.org/)
- [SQL]()

### BBDD:

* MSSQL

## Programas necesarios
---
Para poder utilizar el proyecto en localhost en necesario clonarlo y tener algunos programas necesarios:

- [Nodejs](https://nodejs.org/es/download/) v14.17.0 o Superior.
- [VS Code](https://code.visualstudio.com/download)
- [PostMan](https://www.postman.com/downloads/) para puebas de APIS. (Opcional)
- [Git](https://git-scm.com/downloads) para poder gestionar las versiones.
## Como Clonar
---
Comando para clonar:

```bash
cd CARPETA_PROYECTO
git clone [LINK DEL REPOSITORIO]
```
## Instalación
---
Ya clonado el proyecto es necesario instalar todas las dependencias con el comando:
```bash
npm install
```
### Run en LocalHost:
---
- Cambiar el puerto en el archivo [index.ts](/src/index.ts) en la línea: 
````bash
this.app.set('port', process.env.PORT || 3011);
````
- Ejecutar script build y dev 
````bash
npm run build
npm run dev
````
Este a su vez ejecutara en la funcionalidad de pruebas y dev.
### Run en Producción:
---
- Cambiar el puerto en el archivo [index.ts](/src/index.ts) en la línea 52: 
```bash
this.app.set('port', process.env.PORT || 3011);
```
- Cambiar name y description del archivo [service.js](/service.js) en la línea 6 y 7:
```bash
...
name: 'API MANTENIMIENTO',
description: 'API MANTENIMIENTO 3011',
...
```
- Cuando el puerto sea el deseado ejecutar el comando:

```bash
cd CARPETA_PROYECTO
npm install node-windows
node service.js
```
Este a su vez inciará el servicio para la ejecución del servidor en producción

## Subir cambios


### Repositorios:

* Back end `http://10.73.82.219/Bonobo.Git.Server/Backend-mantenimiento.git`

---
Para poder subir cambios al repositorio es necesario utilizar los siguientes comandos.

`git add .` o si lo prefiere `git add "./direction_file"`

```bash
git commit -m "tu mensaje"
git push origin master
```

o si usted se encuentra en otro branch

```bash
git push origin "your_branch"