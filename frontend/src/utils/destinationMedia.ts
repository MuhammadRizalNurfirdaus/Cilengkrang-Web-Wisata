import type { Galeri, Wisata } from "../types";

export const SITE_MAPS_URL = "https://maps.app.goo.gl/wUUnezoheZNLnSzEA";

const DESTINATION_IMAGE_MAP: Record<string, string> = {
    "curug-cilengkrang": "/img/terjun2.jpg",
    "pemandian-air-panas-alami": "/img/pemandian_air_panas_utama.jpg",
    "camping-ground-pinus": "/img/kemah.jpg",
    "trekking-trail": "/img/gunung.jpg",
};

const DESTINATION_LOCATION_MAP: Record<string, string> = {
    "curug-cilengkrang":
        "Jl. Pejambon, Pajambon, Kecamatan Kramatmulya, Kabupaten Kuningan, Jawa Barat 45553",
};

function getDestinationKey(wisata?: Pick<Wisata, "slug" | "nama">): string | undefined {
    if (wisata?.slug) {
        return wisata.slug;
    }

    if (!wisata?.nama) {
        return undefined;
    }

    return wisata.nama.toLowerCase().replace(/\s+/g, "-");
}

export function getDestinationImage(wisata?: Pick<Wisata, "gambar" | "slug" | "nama">): string | undefined {
    if (wisata?.gambar) {
        return wisata.gambar;
    }

    const key = getDestinationKey(wisata);
    return key ? DESTINATION_IMAGE_MAP[key] : undefined;
}

export function getDestinationLocation(wisata?: Pick<Wisata, "lokasi" | "slug" | "nama">): string | undefined {
    const key = getDestinationKey(wisata);

    if (key && DESTINATION_LOCATION_MAP[key]) {
        return DESTINATION_LOCATION_MAP[key];
    }

    return wisata?.lokasi;
}

export const fallbackGalleryItems: Galeri[] = [
    {
        id: -1,
        namaFile: "/img/gunung.jpg",
        judul: "Lembah Cilengkrang",
        keterangan: "Panorama perbukitan dan jalur hijau di kawasan Lembah Cilengkrang.",
        kategori: "destinasi",
        uploadedAt: new Date(0).toISOString(),
    },
    {
        id: -2,
        namaFile: "/img/terjun2.jpg",
        judul: "Curug Cilengkrang",
        keterangan: "Air terjun Curug Cilengkrang dengan nuansa hutan yang rindang.",
        kategori: "destinasi",
        uploadedAt: new Date(0).toISOString(),
    },
    {
        id: -3,
        namaFile: "/img/air3.jpg",
        judul: "Aliran Sungai Alami",
        keterangan: "Sudut sungai berbatu dengan air jernih yang memperkuat suasana alami kawasan.",
        kategori: "destinasi",
        uploadedAt: new Date(0).toISOString(),
    },
    {
        id: -4,
        namaFile: "/img/pemandian_air_panas_utama.jpg",
        judul: "Pemandian Air Panas",
        keterangan: "Area pemandian air panas alami yang menjadi daya tarik utama pengunjung.",
        kategori: "destinasi",
        uploadedAt: new Date(0).toISOString(),
    },
    {
        id: -5,
        namaFile: "/img/kemah.jpg",
        judul: "Camping Ground Pinus",
        keterangan: "Suasana area camping di tengah pepohonan yang teduh.",
        kategori: "aktivitas",
        uploadedAt: new Date(0).toISOString(),
    },
    {
        id: -6,
        namaFile: "/img/gazebo.jpg",
        judul: "Area Gazebo",
        keterangan: "Spot bersantai di area gazebo dekat aliran sungai.",
        kategori: "fasilitas",
        uploadedAt: new Date(0).toISOString(),
    },
];
