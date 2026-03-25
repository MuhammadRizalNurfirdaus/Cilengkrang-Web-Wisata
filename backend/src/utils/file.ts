import { mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

function getFileExtension(file: File): string {
    const fileNameExtension = file.name.split(".").pop()?.toLowerCase();
    const mimeExtension = file.type.split("/")[1]?.toLowerCase();
    const extension = fileNameExtension || mimeExtension || "bin";

    return extension === "jpeg" ? "jpg" : extension;
}

export async function saveFile(file: File, folder: string = "misc"): Promise<string> {
    const uploadDir = join(process.cwd(), "uploads", folder);
    await mkdir(uploadDir, { recursive: true });

    const extension = getFileExtension(file);
    const filename = `${uuidv4()}.${extension}`;
    const path = join(uploadDir, filename);

    await Bun.write(path, file);

    return `/uploads/${folder}/${filename}`;
}
