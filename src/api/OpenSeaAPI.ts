import fetch from 'node-fetch';
import OpenSeaSale from '../types/OpenSeaSale';

export default class OpenSeaAPI {
  boredApeContract = '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d'
  blueBeamsApeId = '5828'
  eventType = 'successful'
  
  async getNFT(): Promise<[OpenSeaSale]> {
    const url = 'https://api.opensea.io/api/v1/events';
    const params = `only_opensea=false&offset=0&limit=20&asset_contract_address=${this.boredApeContract}&token_id=${this.blueBeamsApeId}&event_type=${this.eventType}`
    
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
