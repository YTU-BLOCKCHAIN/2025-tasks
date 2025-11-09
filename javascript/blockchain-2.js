const crypto = require('crypto');

/** * Bu dosyada Proof of Work ile çalışan bir blockchain yapısı oluşturacağız.
 * Boşlukları doldurun ve kodu çalışır hale getirin
 */

// 1. Block sınıfını tanımla
class Block {
    // Obje yaratılırken çalışan fonksiyon
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp; // Blok oluşturulma zamanı
        this.data = data; // Blok verileri
        this.previousHash = previousHash; // Önceki bloğun hash'i
        this.nonce = 0; // Madencilik için kullanılacak sayaç
        this.hash = this.calculateHash(); // Blok hash'i
    }

    // calculateHash() metodunu tamamlayın.
    // index, timestamp, data, previousHash ve nonce değerlerini birleştirip hash oluşturun.
    calculateHash() {
        return crypto.createHash('sha256')
            .update(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce) // Buraya tüm verileri string olarak ekle
            .digest('hex');
    }

    // mineBlock(difficulty) metodunu tamamlayın.
    // Hash, difficulty kadar "0" ile başlayana kadar nonce değerini artırın.
    mineBlock(difficulty) {
        // difficulty kadar "0" içeren bir string oluştururuz.
        const target = Array(difficulty + 1).join("0");

        // Hash, hedef string ile başlamadığı sürece döngüyü çalıştır.
        while (this.hash.substring(0, difficulty) !== target) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log(`Blok ${this.index} kazıldı! Hash: ${this.hash}`);
    }
}

// 2. Blockchain sınıfını tanımla
class Blockchain {
    constructor() {
        // Blok zincirini başlatırken ilk blok oluşturulur
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 3; // Hash'in başında olması gereken "0" sayısı (Zorluk seviyesi)
    }

    // İlk blok (Genesis block)
    createGenesisBlock() {
        // Index: 0, Data: "Genesis Block", PreviousHash: "0"
        return new Block(0, new Date().toString(), "Genesis Block", "0");
    }

    // Son bloğu döndür
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // 3. Yeni blok ekleme fonksiyonu
    addBlock(newBlock) {
        // newBlock.previousHash değerini güncelleyin (son bloğun hash'i)
        newBlock.previousHash = this.getLatestBlock().hash;

        // newBlock.mineBlock(difficulty) metodunu çağırarak bloğu kazın
        console.log(`Blok ${newBlock.index} kazılmaya başlıyor... (Difficulty: ${this.difficulty})`);
        newBlock.mineBlock(this.difficulty);

        // zincire ekleyin
        this.chain.push(newBlock);

        console.log(`Blok ${newBlock.index} eklendi!\n`);
    }

    // Zinciri doğrulama fonksiyonu
    isChainValid() {
        // Genesis bloğunu atlayarak 1. indexten başla
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

        return true; // Hatalı bir durum yoksa true döndürün.
    }
}

// // Blockchain'i test edelim
let myChain = new Blockchain();

// İki yeni blok ekleyin. Örn:
// Not: Date.now() yerine Date().toString() kullanmak daha iyi olabilir.
// Çünkü constructor'da timestamp alıyor ve bunu hash'e dahil ediyor.
myChain.addBlock(new Block(1, new Date().toString(), { from: "Ali", amount: 10, to: "Veli" }));
myChain.addBlock(new Block(2, new Date().toString(), { from: "Ayşe", amount: 20, to: "Mehmet" }));

// zinciri ekrana yazdır
console.log("\n### Blockchain yapısı ###");
// console.log(JSON.stringify(myChain, null, 2)); // Zincir çok uzun olabileceği için yazdırılmaz, ama isterseniz açabilirsiniz.

// zinciri kontrol et
console.log("\n### Zincir Kontrolü ###");
console.log("Zincir geçerli mi?", myChain.isChainValid()); // true dönmeli

// Zinciri bozmayı deneyin (isteğe bağlı)
console.log("\n### Zinciri Bozma Denemesi (Manipülasyon) ###");
// ikinci bloğun (index 1) verisini değiştiriyoruz
myChain.chain[1].data = { from: "Hacker", to: "Kendisi", amount: 9999 }; 
// Veri değişti, hash değişmeli. Ancak biz mineBlock() metodunu çağırmadık, hash aynı kaldı.

console.log("Zincir bozulduktan sonra geçerli mi?", myChain.isChainValid()); // false dönmeli
