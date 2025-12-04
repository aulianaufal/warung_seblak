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

//Daftar menu seblak favorit beserta harga dan status diskon
let menuFavorit = [
    {nama: "Seblak Kerupuk", harga: 17000, diskon: true}, //diskon 25%
    {nama: "Seblak Ceker", harga: 18000, diskon: false},
    {nama: "Seblak Kikil", harga: 20000, diskon: false},
    {nama: "Seblak Bakso", harga: 17000, diskon: true}, //diskon 25%
];

let totalHargaSetelahDiskon = 12750; //variabel global untuk menyimpan total harga

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
    let menuIndex = Number(document.getElementById("pilihMenu").value);
    let jumlah = Number(document.getElementById("inputJumlah").value);
    let hasil = '';
    let total = 0;

    // cek jumlah pesanan
    if (isNaN(jumlah) || jumlah < 1) {
        alert ("Jumlah pesanan tidak boleh kurang dari satu.");
        return;
    }

    // memastikan pesanan tidak kosong
    if (jumlah > 20) {
        hasil = "Pesanan terlalu banyak! Maksimal 20 porsi.";
        document.getElementById("totalBayar").innerHTML = '';
        totalHargaSetelahDiskon = 0; // reset jika pesanan invalid
    } else {
        let menuPilihan = menuFavorit[menuIndex];
        if (!menuPilihan) {
            hasil = "Pilih menu yang valid.";
            document.getElementById("hasilPesanan").innerHTML = hasil;
            document.getElementById("totalBayar").innerHTML = '';
            totalHargaSetelahDiskon = 0; // reset
            return;
        }
        let hargaPerItem = menuPilihan.harga;

        // Cek apakah menu memiliki diskon
        if (menuPilihan.diskon) {
            hargaPerItem = hargaPerItem * 0.75; // Diskon 25%
        }
        total = hargaPerItem * jumlah;
        totalHargaSetelahDiskon = total; // Simpan total harga setelah diskon untuk perhitungan kembalian
        hasil = `Pesanan Anda sebanyak ${jumlah} porsi ${menuPilihan.nama} telah diterima!`;
        document.getElementById("totalBayar").innerHTML = `Total yang harus dibayar: Rp${formatRupiah(Math.round(total))}`;
        
        // reset input pembayaran dan hasil kembalian saat pesanan baru
        document.getElementById("uangBayar").value = '';
        document.getElementById("hasilKembalian").innerHTML = '';
    }
    document.getElementById("hasilPesanan").innerHTML = hasil;
}

// Fungsi untuk menghitung kembalian
function hitungKembalian() {
    let uangBayar = Number(document.getElementById("uangBayar").value);
    let kembalian = uangBayar - totalHargaSetelahDiskon;
    if (isNaN(uangBayar) || uangBayar === 0) {
        document.getElementById("hasilKembalian").innerHTML = "Masukkan jumlah uang yang valid.";
        return;
    }
    if (kembalian < 0) {
        document.getElementById("hasilKembalian").innerHTML = `Uang Anda kurang. Kurang Rp${formatRupiah(Math.round(Math.abs(kembalian)))}`;
    } else {
        document.getElementById("hasilKembalian").innerHTML = `Kembalian Anda: Rp${formatRupiah(Math.round(kembalian))}`;
    }
}

// non-reaktifkan tombol kembalian saat input kosong
document.addEventListener('DOMContentLoaded', function () {
    const inputUang = document.getElementById('uangBayar');
    const btnKembalian = document.querySelector('#order button[onclick="hitungKembalian()"]');

    if (!inputUang || !btnKembalian) return;

    function updateKembalianButtonState() {
        const empty = inputUang.value.trim() === '';
        btnKembalian.disabled = empty;
    }

    // inisialisasi keadaan tombol saat halaman dimuat
    updateKembalianButtonState();

    // update saat user mengetik / menghapus nilai
    inputUang.addEventListener('input', updateKembalianButtonState);

    // tambahan: cegah aksi bila tombol dinonaktifkan
    btnKembalian.addEventListener('click', function (e) {
        if (btnKembalian.disabled) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }
    });
});
