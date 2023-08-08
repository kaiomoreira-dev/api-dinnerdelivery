import { container } from "tsyringe";

import { LocalStorageProvider } from "./implementations/LocalStorageProvider";
import { S3StorageProvider } from "./implementations/S3StorageProvider";
import { IStorageProvider } from "./IStorageProvide";

const diskLocal = {
    local: LocalStorageProvider,
    s3: S3StorageProvider,
};

container.registerSingleton<IStorageProvider>(
    "LocalStorageProvider",
    diskLocal[process.env.disk]
);
