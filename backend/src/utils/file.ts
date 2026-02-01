import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function saveFile(file: File, folder: string = "uploads"): Promise<string> {
    const uploadDir = join("uploads", folder);
    const extension = file.name.split(".").pop();
    const filename = `${uuidv4()}.${extension}`;
    const path = join(uploadDir, filename);

    await Bun.write(path, file);

    return `${folder}/${filename}`;
}
