let promoClickCount = 0;
const defaultPromoText = (document.getElementById("promoMessage")
    ? document.getElementById("promoMessage").innerHTML
    : "Klik tombol di bawah ini untuk melihat promo spesial hari ini.");

//Fungsi untuk menampilkan promo hari ini menggunakan percabangan if
function tampilkanPromo() {
    const promoEl = document.getElementById("promoMessage");
    if (!promoEl) return;

    promoClickCount++;

    if (promoClickCount === 1) {
        let hari = new Date().getDay();
        let promo = "";

        if (hari === 0 || hari === 6) {
            promo = "Diskon 25% untuk semua level pedas!.";
        } else {
            promo = "Beli 3 gratis 1 untuk Seblak Level 5.";
        }

        promoEl.innerHTML = promo;
    } else if (promoClickCount === 2) {
        promoEl.innerHTML = defaultPromoText;
        promoClickCount = 0;
    }
}

// Fungsi format rupiah dengan titik pemisah ribuan
function formatRupiah(angka) {
    return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Fungsi parsing input rupiah menjadi angka utuh
function parseRupiah(value) {
    const angka = value.replace(/\D/g, '');
    return angka === '' ? 0 : Number(angka);
}

// Fungsi untuk format input pembayaran secara realtime
function formatUangBayar(input) {
    const angka = parseRupiah(input.value);
    if (input.value.trim() === '') {
        input.value = '';
    } else {
        input.value = angka === 0 ? '0' : formatRupiah(angka);
    }
}

//Daftar menu seblak favorit beserta harga dan status diskon
let menuFavorit = [
    {nama: "Seblak Kerupuk", harga: 17000, diskon: true}, //diskon 25%
    {nama: "Seblak Ceker", harga: 18000, diskon: false},
    {nama: "Seblak Kikil", harga: 20000, diskon: false},
    {nama: "Seblak Bakso", harga: 17000, diskon: true}, //diskon 25%
];

let totalHargaSetelahDiskon = null;

// pastikan menu hanya di-render saat tombol ditekan
let menuShown = false;

function tampilkanMenu() {
    const listMenu = document.getElementById("listMenu");
    const pilihMenu = document.getElementById("pilihMenu");
    const tombol = document.querySelector('#menu button');

    if (!listMenu || !pilihMenu) return;

    if (!menuShown) {
        // tampilkan menu
        menuFavorit.forEach(function (item, index) {
            //Menambahkan ke List
            let li = document.createElement("li");
            li.textContent = `${item.nama} - Rp${formatRupiah(item.harga)}`;
            listMenu.appendChild(li);

            //Menambahkan Dropdown Pilihan Menu
            let option = document.createElement("option");
            option.value = index; //Menyimpan index sebagai value
            option.textContent = item.nama;
            pilihMenu.appendChild(option);
        });

        menuShown = true;
        if (tombol) tombol.textContent = "Sembunyikan Menu";
    } else {
        // kembalikan tampilan semula (bersihkan list dan dropdown)
        listMenu.innerHTML = '';
        pilihMenu.innerHTML = '';

        // tambahkan kembali placeholder pada dropdown
        let placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = 'Pilih menu';
        pilihMenu.appendChild(placeholder);

        menuShown = false;
        if (tombol) tombol.textContent = "Tampilkan Menu";
    }
}

// Fungsi untuk memeriksa jumlah pesanan dan menghitung total bayar
function cekPesanan() {
    const pilihMenu = document.getElementById("pilihMenu");
    const inputJumlah = document.getElementById("inputJumlah");
    const hasilPesanan = document.getElementById("hasilPesanan");
    const totalBayar = document.getElementById("totalBayar");
    const uangBayar = document.getElementById("uangBayar");
    const hasilKembalian = document.getElementById("hasilKembalian");

    const menuValue = pilihMenu.value.trim();
    const jumlahValue = inputJumlah.value.trim();

    // Reset hasil pembayaran
    totalHargaSetelahDiskon = null;
    totalBayar.innerHTML = '';
    hasilKembalian.innerHTML = '';
    uangBayar.value = '';

    // Jika menu dan jumlah sama-sama kosong
    if (menuValue === '' && jumlahValue === '') {
        hasilPesanan.innerHTML =
            "Status: Isi jumlah dan pilihan menu terlebih dahulu.";
        return;
    }

    // Jika menu belum dipilih
    if (menuValue === '') {
        hasilPesanan.innerHTML =
            "Status: Pilih menu Seblak terlebih dahulu.";
        return;
    }

    // Jika jumlah belum diisi
    if (jumlahValue === '') {
        hasilPesanan.innerHTML =
            "Status: Isi jumlah pesanan terlebih dahulu.";
        return;
    }

    const menuIndex = Number(menuValue);
    const jumlah = Number(jumlahValue);

    // Validasi jumlah
    if (isNaN(jumlah) || jumlah < 1) {
        hasilPesanan.innerHTML =
            "Status: Jumlah pesanan minimal 1.";
        return;
    }

    // Maksimal 20 porsi
    if (jumlah > 20) {
        hasilPesanan.innerHTML =
            "Status: Pesanan terlalu banyak! Maksimal 20 porsi.";
        return;
    }

    // Ambil menu
    const menuPilihan = menuFavorit[menuIndex];

    if (!menuPilihan) {
        hasilPesanan.innerHTML =
            "Status: Pilih menu Seblak yang valid.";
        return;
    }

    // Harga menu
    let hargaPerItem = menuPilihan.harga;

    // Diskon 25%
    if (menuPilihan.diskon) {
        hargaPerItem = hargaPerItem * 0.75;
    }

    // Hitung total
    const total = hargaPerItem * jumlah;

    totalHargaSetelahDiskon = Math.round(total);

    // Tampilkan status pesanan
    hasilPesanan.innerHTML =
        `Status: Pesanan ${menuPilihan.nama} sebanyak ${jumlah} porsi telah diterima.`;

    // Tampilkan total pembayaran
    totalBayar.innerHTML =
        `Total yang harus dibayar: Rp${formatRupiah(totalHargaSetelahDiskon)}`;
}

// Fungsi untuk menghitung kembalian
function hitungKembalian() {
    const hasilKembalian = document.getElementById("hasilKembalian");
    const inputUang = document.getElementById("uangBayar");

    // Belum melakukan pemesanan
    if (totalHargaSetelahDiskon === null) {
        hasilKembalian.innerHTML =
            "Status: Isi jumlah dan pilihan menu terlebih dahulu.";
        return;
    }

    // Uang pembayaran belum diisi
    if (inputUang.value.trim() === '') {
        hasilKembalian.innerHTML =
            "Status: Isi jumlah uang pembayaran terlebih dahulu.";
        return;
    }

    const uangBayar = parseRupiah(inputUang.value);

    if (isNaN(uangBayar) || uangBayar < 0) {
        hasilKembalian.innerHTML =
            "Status: Masukkan jumlah uang yang valid.";
        return;
    }

    const kembalian = uangBayar - totalHargaSetelahDiskon;

    if (kembalian < 0) {
        hasilKembalian.innerHTML =
            `Uang Anda kurang. Kurang Rp${formatRupiah(
                Math.abs(kembalian)
            )}`;
    } else {
        hasilKembalian.innerHTML =
            `Kembalian Anda: Rp${formatRupiah(kembalian)}`;
    }
    });
});
