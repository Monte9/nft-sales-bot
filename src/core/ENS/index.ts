import  Web3 from 'web3';

import { TwitterMention } from '../../types/NFTSalesBot';

// Guide: https://coderrocketfuel.com/article/configure-infura-with-web3-js-and-node-js
const INFURA_PROJECT_ID = 'd8661505caf449049ffa04aa5317afe2'
const web3 = new Web3(new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`));

// Compose a Reply for a Twitter Mention - Portfolio
export async function getWalletAddress(mention: TwitterMention): Promise<string> {
  let address = null
  const parsedWallet = parseENSName(mention.text) || parseENSName(mention.author.name)

  if (parsedWallet) {
    address = await web3.eth.ens.getAddress(parsedWallet[0])
    console.log(`Found ENS in username: ${parsedWallet[0]} / ${address}`)
  }

  if (!address) {
    throw new Error(`missing wallet address`)
  }

  return address
}

const parseENSName = (text: string) => {
  const values = text.split(' ')
  const match = values.map(value => {
    return value.match(/.*\.eth$/);
  })

  const cleanMatches = match.filter(collection => collection !== null)
  return cleanMatches[0]
}
