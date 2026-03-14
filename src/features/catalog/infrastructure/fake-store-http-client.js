export class FakeStoreHttpClient {
  constructor(baseUrl = "https://fakestoreapi.com") {
    this.baseUrl = baseUrl;
  }

  async get(path) {
    const response = await fetch(`${this.baseUrl}${path}`);

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    return response.json();
  }
}
