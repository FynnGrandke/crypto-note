import * as crypto from 'crypto'

type InputBlock = {
  data: {
    sender: string
    recipient: string
    amount: number
  }
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
          JSON.stringify(this.data)
      )
      .digest('hex')
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

    this.blockchain.push(
      new BlockchainBlock({
        ...InputBlock,
        index: newIndex,
        timestamp: currentDate,
        previousHash: previousHash,
      })
    )
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
}

const blockChain = new Blockchain()
console.log(blockChain.getLatestBlock())
blockChain.addNewBlock({
  data: { sender: 'Fynn', recipient: 'Jenn', amount: 10 },
})
console.log(blockChain.getLatestBlock())
