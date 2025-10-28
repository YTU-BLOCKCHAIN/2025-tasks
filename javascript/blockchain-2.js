// Bu dosyada Proof of Work ile çalışan bir blockchain yapısı oluşturacağız.
// Boşlukları doldurun ve kodu çalışır hale getirin

const crypto = require("crypto");

// 1. Block sınıfını tanımla
class Block {
  // Obje yaratılırken çalışan fonksiyon
  constructor(index, timestamp, data, previousHash = "") {
    this.index = index; // Blok numarası
    this.timestamp = timestamp; // Blok oluşturulma zamanı
    this.data = data; // Blok verileri
    this.previousHash = previousHash; // Önceki bloğun hash'i
    this.nonce = 0; // Madencilik için kullanılacak sayaç
    this.hash = this.calculateHash(); // Blok hash'i
  }

  // calculateHash() metodunu tamamlayın.
  // crypto modülünü ve SHA256 kullanarak hash oluşturun.
  // index, timestamp, data, previousHash ve nonce değerlerini birleştirip hash oluşturun.
  calculateHash() {
    // return crypto.createHash("sha256")
    //   .update(/* buraya blok verilerini string olarak ekle */)
    //   .digest("hex");
  }

  // mineBlock() metodunu tamamlayın.
  // Hash, difficulty kadar "0" ile başlayana kadar nonce değerini artırın.
  mineBlock(difficulty) {
    // while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
    //   this.nonce++;
    //   this.hash = this.calculateHash();
    // }
    // console.log(`Blok ${this.index} kazıldı: ${this.hash}`);
  }
}

// 2. Blockchain sınıfını tanımla
class Blockchain {
  constructor() {
    // Blok zincirini başlatırken ilk blok oluşturulur
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 3; // Hash'in başında olması gereken "0" sayısı
  }

  // İlk blok (Genesis Block)
  createGenesisBlock() {
    return new Block(0, Date.now(), "Genesis Block", "0");
  }

  // Son bloğu döndür
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  // 3. Yeni blok ekleme fonksiyonu
  addBlock(newBlock) {
    // newBlock.previousHash değerini güncelleyin (son bloğun hash'i)
    // newBlock.hash değerini yeniden hesaplayın
    // newBlock.mineBlock() metodunu çağırarak bloğu kazın
    // zincire ekleyin
    // console.log(`Blok ${newBlock.index} eklendi!`);
  }

  // Zinciri doğrulama fonksiyonu
  isChainValid() {
    // Tüm blokları kontrol edin:
    // Hash'ler doğru mu?
    // previousHash bir önceki bloğa eşit mi?
    // Hatalı bir durum varsa false döndürün, aksi halde true.
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const previous = this.chain[i - 1];

      if (current.hash !== current.calculateHash()) return false;
      if (current.previousHash !== previous.hash) return false;
    }
    return true;
  }
}

// Blockchain'i test edelim
let myChain = new Blockchain();

// İki yeni blok ekleyin. Örn:
// myChain.addBlock(new Block(1, Date.now(), { from: "Ali", to: "Veli", amount: 10 }));
// myChain.addBlock(new Block(2, Date.now(), { from: "Ayşe", to: "Mehmet", amount: 20 }));

// Zinciri ekrana yazdır
// console.log("\nBlockchain:", JSON.stringify(myChain, null, 2));

// Zinciri kontrol et
// console.log("\nChain geçerli mi?", myChain.isChainValid());

// Zinciri bozmayı deneyin (isteğe bağlı)
// myChain.chain[1].data = { from: "Hacker", to: "Kendisi", amount: 9999 };
// console.log("Chain geçerli mi?", myChain.isChainValid());
