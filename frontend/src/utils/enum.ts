export function formatTipeHari(tipeHari: string): string {
    switch (tipeHari) {
        case "HARI_KERJA":
            return "Hari Kerja";
        case "HARI_LIBUR":
            return "Hari Libur";
        case "SEMUA_HARI":
            return "Semua Hari";
        default:
            return tipeHari.replaceAll("_", " ");
    }
}

export function getTipeHariBadgeClass(tipeHari: string): string {
    switch (tipeHari) {
        case "HARI_LIBUR":
            return "bg-danger";
        case "HARI_KERJA":
            return "bg-info";
        default:
            return "bg-primary";
    }
}
