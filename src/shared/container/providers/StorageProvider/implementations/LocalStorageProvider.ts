import uploadConfig from "@config/uploadConfig";
import fs from "fs";
import { resolve } from "path";

import { IStorageProvider } from "../IStorageProvide";

export class LocalStorageProvider implements IStorageProvider {
    async save(file: string, folder: string): Promise<string> {
        await fs.promises.rename(
            // pegar o arquivo no caminho recebido
            resolve(uploadConfig.tmpFolder, file),
            // colocar o arquivo no caminho destinado
            resolve(`${uploadConfig.tmpFolder}/${folder}`, file)
        );

        return file;
    }
    async delete(file: string, folder: string): Promise<void> {
        // caminho do arquivo no caminho destinado
        const fileName = resolve(`${uploadConfig.tmpFolder}/${folder}`, file);

        try {
            await fs.promises.stat(fileName);
        } catch {
            return;
        }
        await fs.promises.unlink(fileName);
    }
}
