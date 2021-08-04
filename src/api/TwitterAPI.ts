import Twit from 'twit';

export default class TwitterAPI {
  consumer_key = null
  consumer_secret = null
  access_token = null
  access_token_secret = null
  api = null

  constructor(consumer_key, consumer_secret, access_token, access_token_secret) {
    this.consumer_key = consumer_key;
    this.consumer_secret = consumer_secret;
    this.access_token = access_token;
    this.access_token_secret = access_token_secret;

    this.api = new Twit({
      consumer_key: this.consumer_key,
      consumer_secret: this.consumer_secret,
      access_token: this.access_token,
      access_token_secret: this.access_token_secret,
      timeout_ms: 60 * 1000,
      strictSSL: true,
    });
  }

  postTweet(content) {
    this.api.post('statuses/update', { status: content }, function(err, data, response) {
      if (err != null) {
        console.log("Oops! Unable to post the Tweet:", err.allErrors[0] && err.allErrors[0].message)
      } else {
        console.log("Tweet Posted:", `https://twitter.com/${data.user.screen_name}/status/${data.id_str}\n`)
      }
    })
  }
}
