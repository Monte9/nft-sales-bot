import fetch from 'node-fetch';

export default class OpenSeaAPI {
  constructor() {
    this.boredApeContract = '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d'
    this.blueBeamsApeId = '5828'
    this.eventType = 'successful'
  }

  async getNFT() {
    const url = `https://api.opensea.io/api/v1/events?only_opensea=false&offset=0&limit=20&asset_contract_address=${this.boredApeContract}&token_id=${this.blueBeamsApeId}&event_type=${this.eventType}`;
    const options = {
      method: 'GET', 
      headers: {
        Accept: 'application/json'
      }
    };
    
    return await fetch(url, options)
      .then(res => res.json())
      .catch(err => console.error('error:' + err));
  }
}
