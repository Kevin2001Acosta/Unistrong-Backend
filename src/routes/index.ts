/* Cargar dinamicamente las rutas en la aplicación */

import { Router } from "express";
import { readdirSync } from "fs";

const PATH_ROUTER = `${__dirname}/`; // obtiene la ruta completa del archivo
const router = Router();

const cleanFileName = (filename: string) => { // elimina la extensión del archivo
  const file = filename.split(".").shift();
  return file;
};
console.log("ruta larga: ", PATH_ROUTER);
readdirSync(PATH_ROUTER).filter((filename) => { // filtra los archivos que no sean index
  const cleanName = cleanFileName(filename);
  if (cleanName !== "index") {
    import(`./${cleanName}`).then((moduleRouter) => { // importa el archivo
      console.log(`Se esta cargando la ruta /${cleanName}`);
      router.use(`/${cleanName}`, moduleRouter.router); // agrega la ruta al router
    }).catch((error) => {
      console.error(`Error al cargar la ruta /${cleanName}`, error);
    });
  }
});

export { router };
