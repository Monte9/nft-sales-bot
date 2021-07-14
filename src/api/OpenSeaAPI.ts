import fetch from 'node-fetch';

const COLLECTIONS = {
  'boredapeyachtclub': {
    contract: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
  },
  'cool-cats-nft': {
    contract: '0x1a92f7381b9f03921564a437210bb9396471050c',
  },
  'cryptopunks': {
    contract: '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb',
  },
  'meebits': {
    constract: '0x7bd29408f11d2bfc23c34f18275bbf23bb716bc7'
  }
}

export default class OpenSeaAPI {
  smartContract = '0x7bd29408f11d2bfc23c34f18275bbf23bb716bc7'
  tokenId = '8426'
  eventType = 'successful'
  
  async getNFT() {
    const url = 'https://api.opensea.io/api/v1/events';
    const params = `only_opensea=false&offset=0&limit=20&asset_contract_address=${this.smartContract}&token_id=${this.tokenId}&event_type=${this.eventType}`
    
    const options = {
      method: 'GET', 
      headers: {
        Accept: 'application/json'
      }
    };
    
    return await fetch(`${url}?${params}`, options)
      .then(res => res.json())
      .catch(err => console.error('error:' + err));
  }
}
