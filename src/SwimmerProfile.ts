import { Request } from "./Request";

export class SwimmerProfile extends Request {
  readonly timerange = 'sai';
  readonly go = 'profile';
  readonly idact = 'nat';
  
  static endpoint: string = 'nat_recherche.php';

  constructor() {
    super(SwimmerProfile.endpoint);
  }

  static getUrl(id: string | number): URL {
    const url = new URL('https://ffn.extranat.fr');
    url.pathname = `webffn/${SwimmerProfile.endpoint}`;
    url.searchParams.append('idrch_id', id.toString());

    return url;
  }

  async execute() {
    const { data } = await this.client.get(this.endpoint, {
      params: {
        ...this.getBaseOptions(),
      },
    });

    return data;
  }
}