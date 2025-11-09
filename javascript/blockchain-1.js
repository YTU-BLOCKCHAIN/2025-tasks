const crypto = require('crypto');

// 1. Block sınıfını tanımla
class Block {
    // Obje yaratılırken çalışan fonksiyon
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index; // Blok numarası
        this.timestamp = timestamp; // Blok oluşturulma zamanı
        this.data = data; // Blok verileri
        this.previousHash = previousHash; // Önceki bloğun hash'i
        this.hash = this.calculateHash(); // Blok hash'i
    }

    // crypto modülünü ve SHA256 kullanarak hash oluşturun.
    calculateHash() {
        // Blok verilerini (index, timestamp, data, previousHash) birleştirip SHA256 ile hash'le.
        return crypto.createHash('sha256')
            .update(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)) // buraya blok verilerini string olarak ekle
            .digest('hex');
    }
}

// 2. Blockchain sınıfını tanımla
class Blockchain {
    constructor() {
        // Blok zincirini başlatırken ilk blok oluşturulur
        this.chain = [this.createGenesisBlock()];
    }

    // İlk blok (Genesis Block)
    createGenesisBlock() {
        // Yeni bir Block nesnesi döndürün.
        // index: 0, data: "Genesis Block", previoushash: "0"
        return new Block(0, new Date().toString(), "Genesis Block", "0");
    }

    // Son bloğu döndür
    getLatestBlock() {
        return this.chain[this.chain.length - 1]; // zincirin son bloğunu döndür
    }

    // 3. Yeni blok ekleme fonksiyonu
    addBlock(newBlock) {
        // newBlock.previousHash değerini güncelleyin (son bloğun hash'i)
        newBlock.previousHash = this.getLatestBlock().hash;

        // newBlock.hash değerini yeniden hesaplayın
        newBlock.hash = newBlock.calculateHash();

        // zincire ekleyin
        this.chain.push(newBlock);

        console.log(`Blok ${newBlock.index} eklendi!`);
    }

    // Zinciri doğrulama fonksiyonu
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // 1. Blok hash'i doğru mu? (Yeniden hesaplanan hash ile mevcut hash aynı mı?)
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                console.log(`HATA: Blok ${i} - Hash geçerli değil.`);
                return false;
            }

            // 2. previousHash bir önceki bloğa eşit mi?
            if (currentBlock.previousHash !== previousBlock.hash) {
                console.log(`HATA: Blok ${i} - Önceki Blok Hash'i geçerli değil.`);
                return false;
            }
        }

        // Hatalı bir durum yoksa true döndürün.
        return true;
    }
}

// // Blockchain'i test edelim
let myChain = new Blockchain();

// İki yeni blok ekleyin. Örn:
myChain.addBlock(new Block(1, new Date().toString(), { amount: 10, from: "Ali", to: "Veli" }));
myChain.addBlock(new Block(2, new Date().toString(), { amount: 20, from: "Ayşe", to: "Mehmet" }));

// zinciri ekrana yazdır
console.log("\n### Blockchain yapısı ###");
console.log(JSON.stringify(myChain, null, 2));

// zinciri kontrol et
console.log("\n### Zincir Kontrolü ###");
console.log("Zincir geçerli mi?", myChain.isChainValid());

// Zinciri bozmayı deneyin (isteğe bağlı)
console.log("\n### Zinciri Bozma Denemesi (Manipülasyon) ###");
// ikinci bloğun (index 1) verisini değiştiriyoruz
myChain.chain[1].data = { amount: 9999, from: "Hacker", to: "Kendisi" };
// Hash'i yeniden hesaplamadığımız için, zincir artık geçersiz olmalı.

console.log("Zincir bozulduktan sonra geçerli mi?", myChain.isChainValid());
// Artık isChainValid() metodu, hash'ler uyuşmadığı için false döndürecektir.
