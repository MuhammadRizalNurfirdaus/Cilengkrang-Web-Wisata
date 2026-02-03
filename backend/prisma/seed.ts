import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.aktivitas.deleteMany();
  await prisma.pemesananSewaAlat.deleteMany();
  await prisma.detailPemesananTiket.deleteMany();
  await prisma.pembayaran.deleteMany();
  await prisma.pemesananTiket.deleteMany();
  await prisma.jadwalKetersediaanTiket.deleteMany();
  await prisma.jenisTiket.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.galeri.deleteMany();
  await prisma.sewaAlat.deleteMany();
  await prisma.wisata.deleteMany();
  await prisma.article.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.user.deleteMany();
  await prisma.pengaturanSitus.deleteMany();

  console.log("✅ Cleared existing data");

  // Create users with different roles
  const hashedPassword = await bcrypt.hash("password123", 10);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        nama: "Administrator",
        email: "admin@cilengkrang.com",
        password: hashedPassword,
        role: "admin",
        noHp: "081234567890",
        alamat: "Kantor Pengelola Cilengkrang",
      },
    }),
    prisma.user.create({
      data: {
        nama: "Kasir Cilengkrang",
        email: "kasir@cilengkrang.com",
        password: hashedPassword,
        role: "kasir",
        noHp: "081234567891",
        alamat: "Loket Tiket Cilengkrang",
      },
    }),
    prisma.user.create({
      data: {
        nama: "Owner Cilengkrang",
        email: "owner@cilengkrang.com",
        password: hashedPassword,
        role: "owner",
        noHp: "081234567892",
        alamat: "Kuningan, Jawa Barat",
      },
    }),
    prisma.user.create({
      data: {
        nama: "Pengunjung Demo",
        email: "user@cilengkrang.com",
        password: hashedPassword,
        role: "user",
        noHp: "081234567893",
        alamat: "Cirebon, Jawa Barat",
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create wisata (destinations)
  const wisataData = [
    {
      nama: "Curug Cilengkrang",
      slug: "curug-cilengkrang",
      deskripsi:
        "Curug Cilengkrang adalah air terjun yang memiliki ketinggian sekitar 30 meter dengan air yang jernih dan menyegarkan. Dikelilingi oleh hutan pinus yang asri, tempat ini sangat cocok untuk rekreasi keluarga dan fotografi alam. Suara gemericik air yang jatuh menciptakan suasana yang menenangkan dan menyejukkan jiwa.",
      gambar: null,
      lokasi: "Desa Pajambon, Kec. Kramatmulya, Kuningan",
      latitude: -6.9833,
      longitude: 108.4833,
      fasilitas: JSON.stringify([
        "Area Parkir Luas",
        "Toilet Umum",
        "Warung Makan",
        "Mushola",
        "Gazebo",
        "Spot Foto",
      ]),
      jamOperasi: "08:00 - 17:00 WIB",
      aktif: true,
    },
    {
      nama: "Pemandian Air Panas Alami",
      slug: "pemandian-air-panas-alami",
      deskripsi:
        "Nikmati sensasi berendam di kolam air panas alami yang langsung bersumber dari perut bumi. Air panas ini dipercaya memiliki kandungan mineral yang bermanfaat untuk kesehatan kulit dan meredakan pegal-pegal. Tersedia beberapa kolam dengan suhu berbeda yang dapat disesuaikan dengan preferensi pengunjung.",
      gambar: null,
      lokasi: "Area Pemandian Cilengkrang",
      latitude: -6.9845,
      longitude: 108.4840,
      fasilitas: JSON.stringify([
        "Kolam Air Panas",
        "Ruang Ganti",
        "Loker Penyimpanan",
        "Toilet",
        "Kantin",
        "Tempat Istirahat",
      ]),
      jamOperasi: "07:00 - 18:00 WIB",
      aktif: true,
    },
    {
      nama: "Camping Ground Pinus",
      slug: "camping-ground-pinus",
      deskripsi:
        "Rasakan pengalaman berkemah yang tak terlupakan di tengah hutan pinus yang sejuk. Area camping ini dilengkapi dengan fasilitas dasar seperti toilet dan sumber air bersih. Pada malam hari, Anda dapat menikmati indahnya langit malam yang bertabur bintang jauh dari polusi cahaya kota.",
      gambar: null,
      lokasi: "Hutan Pinus Cilengkrang",
      latitude: -6.9820,
      longitude: 108.4820,
      fasilitas: JSON.stringify([
        "Area Tenda",
        "Toilet Umum",
        "Sumber Air Bersih",
        "Api Unggun",
        "Penerangan Malam",
      ]),
      jamOperasi: "24 Jam (Check-in 14:00)",
      aktif: true,
    },
    {
      nama: "Trekking Trail",
      slug: "trekking-trail",
      deskripsi:
        "Jalur trekking sepanjang 3km yang akan membawa Anda menjelajahi keindahan hutan Cilengkrang. Sepanjang perjalanan, Anda akan menemukan berbagai jenis flora dan fauna endemik, serta pemandangan alam yang memukau. Cocok untuk pecinta hiking dan petualangan alam.",
      gambar: null,
      lokasi: "Jalur Trekking Cilengkrang",
      latitude: -6.9810,
      longitude: 108.4810,
      fasilitas: JSON.stringify([
        "Jalur Trekking",
        "Pos Istirahat",
        "Papan Petunjuk",
        "Pemandangan Alam",
      ]),
      jamOperasi: "06:00 - 16:00 WIB",
      aktif: true,
    },
  ];

  const wisata = await Promise.all(
    wisataData.map((w) => prisma.wisata.create({ data: w }))
  );

  console.log(`✅ Created ${wisata.length} wisata destinations`);

  // Create jenis tiket for each wisata
  for (const w of wisata) {
    await prisma.jenisTiket.createMany({
      data: [
        {
          namaLayananDisplay: `Tiket Masuk ${w.nama} (Hari Kerja)`,
          tipeHari: "HARI_KERJA",
          harga: 15000,
          deskripsi: `Tiket masuk ke ${w.nama} untuk hari Senin-Jumat`,
          aktif: true,
          wisataId: w.id,
        },
        {
          namaLayananDisplay: `Tiket Masuk ${w.nama} (Hari Libur)`,
          tipeHari: "HARI_LIBUR",
          harga: 25000,
          deskripsi: `Tiket masuk ke ${w.nama} untuk hari Sabtu, Minggu & Hari Libur Nasional`,
          aktif: true,
          wisataId: w.id,
        },
      ],
    });
  }

  console.log("✅ Created jenis tiket for all wisata");

  // Create articles
  const articles = await Promise.all([
    prisma.article.create({
      data: {
        judul: "Panduan Lengkap Berkunjung ke Lembah Cilengkrang",
        slug: "panduan-lengkap-berkunjung-ke-lembah-cilengkrang",
        ringkasan:
          "Tips dan informasi penting sebelum berkunjung ke destinasi wisata alam Lembah Cilengkrang.",
        isi: `
          <h2>Persiapan Sebelum Berkunjung</h2>
          <p>Lembah Cilengkrang merupakan destinasi wisata alam yang menawarkan berbagai atraksi seperti air terjun, pemandian air panas, dan area camping. Berikut panduan lengkap untuk memaksimalkan kunjungan Anda.</p>
          
          <h3>Yang Perlu Dibawa</h3>
          <ul>
            <li>Pakaian ganti untuk berendam</li>
            <li>Alas kaki yang nyaman untuk trekking</li>
            <li>Sunblock dan topi</li>
            <li>Kamera untuk mengabadikan momen</li>
            <li>Uang tunai secukupnya</li>
          </ul>
          
          <h3>Jam Operasional</h3>
          <p>Lembah Cilengkrang buka setiap hari mulai pukul 08:00 - 17:00 WIB. Untuk camping ground beroperasi 24 jam dengan check-in pukul 14:00.</p>
          
          <h3>Rute Menuju Lokasi</h3>
          <p>Dari pusat kota Kuningan, perjalanan memakan waktu sekitar 45 menit. Ikuti jalur menuju Kramatmulya, kemudian ikuti petunjuk arah ke Desa Pajambon.</p>
        `,
        penulis: "Tim Redaksi Cilengkrang",
        published: true,
      },
    }),
    prisma.article.create({
      data: {
        judul: "5 Spot Foto Instagramable di Cilengkrang",
        slug: "5-spot-foto-instagramable-di-cilengkrang",
        ringkasan:
          "Temukan lokasi-lokasi terbaik untuk foto aesthetic di kawasan wisata Cilengkrang.",
        isi: `
          <h2>Spot Foto Terbaik</h2>
          <p>Cilengkrang tidak hanya menawarkan keindahan alam, tapi juga berbagai spot foto yang sangat instagramable. Berikut 5 spot terbaik:</p>
          
          <h3>1. Curug Cilengkrang</h3>
          <p>Dengan latar belakang air terjun yang megah, spot ini menjadi favorit pengunjung.</p>
          
          <h3>2. Jembatan Gantung</h3>
          <p>Jembatan yang menghubungkan dua tebing ini memberikan pemandangan dramatis.</p>
          
          <h3>3. Hutan Pinus</h3>
          <p>Deretan pohon pinus yang tinggi menciptakan suasana magis, terutama saat kabut turun.</p>
          
          <h3>4. Gazebo Tepi Kolam</h3>
          <p>Dengan pantulan air yang indah, gazebo ini sangat cocok untuk foto sunset.</p>
          
          <h3>5. Area Camping</h3>
          <p>Foto dengan latar tenda dan langit malam berbintang akan menjadi kenangan tak terlupakan.</p>
        `,
        penulis: "Travel Blogger",
        published: true,
      },
    }),
    prisma.article.create({
      data: {
        judul: "Manfaat Kesehatan dari Air Panas Alami",
        slug: "manfaat-kesehatan-dari-air-panas-alami",
        ringkasan:
          "Ketahui berbagai manfaat kesehatan yang bisa Anda dapatkan dari berendam di air panas alami.",
        isi: `
          <h2>Terapi Air Panas</h2>
          <p>Pemandian air panas Cilengkrang mengandung mineral alami yang bermanfaat untuk kesehatan.</p>
          
          <h3>Manfaat untuk Tubuh</h3>
          <ul>
            <li>Melancarkan peredaran darah</li>
            <li>Meredakan nyeri otot dan sendi</li>
            <li>Membantu relaksasi dan mengurangi stres</li>
            <li>Membersihkan dan melembutkan kulit</li>
            <li>Meningkatkan kualitas tidur</li>
          </ul>
          
          <h3>Tips Berendam</h3>
          <p>Untuk hasil optimal, berendam selama 15-20 menit. Jangan lupa minum air putih sebelum dan sesudah berendam.</p>
        `,
        penulis: "Dr. Kesehatan",
        published: true,
      },
    }),
  ]);

  console.log(`✅ Created ${articles.length} articles`);

  // Create sewa alat (equipment rental)
  const sewaAlat = await Promise.all([
    prisma.sewaAlat.create({
      data: {
        namaItem: "Tenda Camping (4 Orang)",
        kategoriAlat: "Camping",
        deskripsi: "Tenda waterproof untuk 4 orang",
        hargaSewa: 100000,
        durasiHargaSewa: 1,
        satuanDurasiHarga: "HARI",
        stokTersedia: 10,
        kondisiAlat: "BAIK",
        aktif: true,
      },
    }),
    prisma.sewaAlat.create({
      data: {
        namaItem: "Pelampung Renang",
        kategoriAlat: "Renang",
        deskripsi: "Pelampung untuk anak-anak dan dewasa",
        hargaSewa: 15000,
        durasiHargaSewa: 1,
        satuanDurasiHarga: "JAM",
        stokTersedia: 20,
        kondisiAlat: "BAIK",
        aktif: true,
      },
    }),
    prisma.sewaAlat.create({
      data: {
        namaItem: "Tongkat Trekking",
        kategoriAlat: "Trekking",
        deskripsi: "Tongkat pendaki untuk jalur trekking",
        hargaSewa: 10000,
        durasiHargaSewa: 1,
        satuanDurasiHarga: "PEMINJAMAN",
        stokTersedia: 15,
        kondisiAlat: "BAIK",
        aktif: true,
      },
    }),
  ]);

  console.log(`✅ Created ${sewaAlat.length} rental items`);

  // Create pengaturan situs
  await prisma.pengaturanSitus.createMany({
    data: [
      {
        key: "nama_situs",
        value: "Lembah Cilengkrang",
        deskripsi: "Nama situs yang ditampilkan",
      },
      {
        key: "tagline",
        value: "Destinasi Wisata Alam Terbaik di Kuningan",
        deskripsi: "Tagline situs",
      },
      {
        key: "email_kontak",
        value: "info@cilengkrang.com",
        deskripsi: "Email kontak",
      },
      {
        key: "telepon_kontak",
        value: "+62 232 123 456",
        deskripsi: "Nomor telepon kontak",
      },
      {
        key: "alamat",
        value: "Desa Pajambon, Kec. Kramatmulya, Kab. Kuningan, Jawa Barat 45553",
        deskripsi: "Alamat lengkap",
      },
      {
        key: "jam_operasional",
        value: "Senin - Minggu: 08:00 - 17:00 WIB",
        deskripsi: "Jam operasional",
      },
    ],
  });

  console.log("✅ Created pengaturan situs");

  // Create sample feedback
  await prisma.feedback.createMany({
    data: [
      {
        userId: users[3].id,
        wisataId: wisata[0].id,
        komentar: "Tempatnya sangat indah dan sejuk! Cocok untuk refreshing dari kesibukan kota.",
        rating: 5,
      },
      {
        userId: users[3].id,
        wisataId: wisata[1].id,
        komentar: "Air panasnya sangat menyegarkan, badan jadi rileks setelah berendam.",
        rating: 4,
      },
    ],
  });

  console.log("✅ Created sample feedback");

  console.log("\n🎉 Database seeding completed!");
  console.log("\n📝 Default login credentials:");
  console.log("   Admin:  admin@cilengkrang.com / password123");
  console.log("   Kasir:  kasir@cilengkrang.com / password123");
  console.log("   Owner:  owner@cilengkrang.com / password123");
  console.log("   User:   user@cilengkrang.com / password123");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
