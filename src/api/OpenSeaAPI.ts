import fetch from 'node-fetch';

export default class OpenSeaAPI {
  smartContract = null
  tokenId = null
  eventType = 'successful'

  constructor(smartContract, tokenId) {
    this.smartContract = smartContract;
    this.tokenId = tokenId;
  }
  
  async getNFT() {
    const url = 'https://api.opensea.io/api/v1/events';
    const params = `only_opensea=false&offset=0&limit=20&asset_contract_address=${this.smartContract}&event_type=${this.eventType}`
    
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
