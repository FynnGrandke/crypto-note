import * as crypto from 'crypto'

type InputBlock = {
  data: [
    {
      sender: string
      recipient: string
      amount: number
    }
  ]
}

type Block = InputBlock & {
  index: number
  timestamp: Date
  previousHash: string
}

class BlockchainBlock {
  index: number
  timestamp: Date
  data: Object
  previousHash: string
  hash: string
  nonce = 0

  constructor({ index, timestamp, data, previousHash = '' }: Block) {
    this.index = index
    this.timestamp = timestamp
    this.data = data
    this.previousHash = previousHash
    this.hash = this.createHash()
  }

  getHash() {
    return this.hash
  }

  createHash() {
    return crypto
      .createHash('sha256')
      .update(
        this.index.toString() +
          this.timestamp.toISOString() +
          this.previousHash +
          JSON.stringify(this.data) +
          this.nonce
      )
      .digest('hex')
  }

  proofOfWork(difficulty: number) {
    const zeroString = Array.from(new Array(difficulty), (_) => '0').join('')

    while (this.hash.substring(0, difficulty) !== zeroString) {
      this.nonce++
      console.log('current hash: ', this.hash)
      this.hash = this.createHash()
    }
  }
}

class Blockchain {
  blockchain: BlockchainBlock[]

  constructor() {
    this.blockchain = [this.genesisBlock()]
  }

  addNewBlock(InputBlock: InputBlock) {
    const previousBlock = this.getLatestBlock()
    const newIndex = previousBlock.index + 1
    const currentDate = new Date()
    const previousHash = previousBlock.getHash()

    const newBlock = new BlockchainBlock({
      ...InputBlock,
      index: newIndex,
      timestamp: currentDate,
      previousHash: previousHash,
    })

    newBlock.proofOfWork(3)

    this.blockchain.push(newBlock)
  }

  genesisBlock() {
    return new BlockchainBlock({
      // @ts-ignore For the genesis block we don't need sender etc.
      data: 'Initialize Blockchain',
      index: 0,
      timestamp: new Date(),
      previousHash: '0',
    })
  }

  getLatestBlock() {
    return this.blockchain[this.blockchain.length - 1]
  }

  validateChain() {
    return this.blockchain.every((block, idx) => {
      if (block.hash != block.createHash()) {
        return false
      }
      if (idx > 0 && block.previousHash != this.blockchain[idx - 1].hash) {
        return false
      }
      return true
    })
  }
}

const blockChain = new Blockchain()
console.log('initial block:', blockChain.getLatestBlock())
blockChain.addNewBlock({
  data: [{ sender: 'Fynn', recipient: 'Jenn', amount: 10 }],
})
console.log('first block:', blockChain.getLatestBlock())
console.log('first validate:', blockChain.validateChain())
