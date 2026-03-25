import type { Article, Galeri, Wisata } from "../types";
import { getDestinationImage } from "./destinationMedia";

const ARTICLE_IMAGE_BY_SLUG: Record<string, string> = {
    "panduan-lengkap-berkunjung-ke-lembah-cilengkrang": "/img/panduan_lengkap_berkemah.jpg",
    "5-spot-foto-instagramable-di-cilengkrang": "/img/air3.jpg",
    "manfaat-kesehatan-dari-air-panas-alami": "/img/pemandian_air_panas_utama.jpg",
};

const ARTICLE_IMAGE_BY_KEYWORD: Array<{ keyword: string; path: string }> = [
    { keyword: "air panas", path: "/img/pemandian_air_panas_utama.jpg" },
    { keyword: "instagram", path: "/img/air3.jpg" },
    { keyword: "foto", path: "/img/air2.jpg" },
    { keyword: "panduan", path: "/img/panduan_lengkap_berkemah.jpg" },
    { keyword: "camping", path: "/img/kemah.jpg" },
];

const WISATA_IMAGE_BY_NAME: Record<string, string> = {
    "pemandian air panas alami": "/img/pemandian_air_panas_utama.jpg",
    "camping ground pinus": "/img/kemah.jpg",
    "curug cilengkrang": "/img/terjun2.jpg",
    "trekking trail": "/img/gunung.jpg",
};

const ADMIN_GALLERY_FALLBACK_IMAGES = [
    "/img/terjun2.jpg",
    "/img/gunung.jpg",
    "/img/air3.jpg",
    "/img/kemah.jpg",
    "/img/pemandian_air_panas_utama.jpg",
    "/img/gazebo.jpg",
];

function normalize(value?: string | null) {
    return value?.toLowerCase().trim() || "";
}

export function getAdminArticleImage(article?: Pick<Article, "gambar" | "slug" | "judul">): string {
    if (article?.gambar) {
        return article.gambar;
    }

    const slugKey = normalize(article?.slug);
    if (slugKey && ARTICLE_IMAGE_BY_SLUG[slugKey]) {
        return ARTICLE_IMAGE_BY_SLUG[slugKey];
    }

    const title = normalize(article?.judul);
    if (title) {
        const keywordMatch = ARTICLE_IMAGE_BY_KEYWORD.find((entry) => title.includes(entry.keyword));
        if (keywordMatch) {
            return keywordMatch.path;
        }
    }

    return "/img/panduan_lengkap_berkemah.jpg";
}

export function getAdminWisataImage(wisata?: Pick<Wisata, "gambar" | "slug" | "nama">): string {
    const mapped = getDestinationImage(wisata);
    if (mapped) {
        return mapped;
    }

    const nameKey = normalize(wisata?.nama);
    if (nameKey && WISATA_IMAGE_BY_NAME[nameKey]) {
        return WISATA_IMAGE_BY_NAME[nameKey];
    }

    return "/img/gunung.jpg";
}

export function getAdminGalleryImage(item: Pick<Galeri, "namaFile"> | null | undefined, index: number): string {
    if (item?.namaFile) {
        return item.namaFile;
    }

    return ADMIN_GALLERY_FALLBACK_IMAGES[index % ADMIN_GALLERY_FALLBACK_IMAGES.length];
}
