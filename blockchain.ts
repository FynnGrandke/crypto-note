import * as crypto from 'crypto'

class BlockchainBlock {
  index: number
  timestamp: Date
  data: Object
  previousHash: string
  hash = crypto.createHash('sha256')

  constructor(index, timestamp, data, previousHash = '') {
    this.index = index
    this.timestamp = timestamp
    this.data = data
    this.previousHash = previousHash
    this.setHash()
  }

  getHash() {
    return this.hash.digest('hex')
  }

  setHash() {
    this.hash.update(
      this.index.toString() +
        this.timestamp.toISOString() +
        this.previousHash +
        JSON.stringify(this.data)
    )
  }
}

class Blockchain {
  blockchain: BlockchainBlock[]

  constructor() {
    this.blockchain = [this.genesisBlock()]
  }

  addNewBlock(block: BlockchainBlock) {
    this.blockchain.push({ ...block })
  }

  genesisBlock() {
    return new BlockchainBlock(0, new Date(), 'Initializing Blockchain', 0)
  }

  getLatestBlock() {
    return this.blockchain[this.blockchain.length - 1]
  }
}