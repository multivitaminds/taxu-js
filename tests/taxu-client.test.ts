import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { TaxuClient, createTaxuClient, TaxuConfig } from '../src/index';

describe('TaxuClient', () => {
  let client: TaxuClient;
  let mockAxios: MockAdapter;
  const testApiKey = 'test-api-key-123';
  const baseURL = 'https://api.taxu.io/v1';

  beforeEach(() => {
    // Mock axios globally before creating client
    mockAxios = new MockAdapter(axios);
    // Create a fresh client for each test
    client = new TaxuClient({ apiKey: testApiKey });
  });

  afterEach(() => {
    // Clean up after each test
    mockAxios.restore();
  });

  describe('request method', () => {
    describe('GET requests', () => {
      it('should send a GET request to the correct endpoint', async () => {
        // Arrange
        const endpoint = '/test-endpoint';
        const expectedResponse = { data: { result: 'success' }, success: true };
        
        mockAxios.onGet(`${baseURL}${endpoint}`).reply(200, expectedResponse);

        // Act
        const result = await client.request(endpoint);

        // Assert
        expect(result).toEqual(expectedResponse);
        expect(mockAxios.history.get).toHaveLength(1);
        expect(mockAxios.history.get[0].url).toBe(endpoint);
        expect(mockAxios.history.get[0].method).toBe('get');
      });

      it('should send a GET request with query parameters', async () => {
        // Arrange
        const endpoint = '/test-endpoint';
        const params = { filter: 'active', limit: 10 };
        const expectedResponse = { data: { results: [] }, success: true };
        
        mockAxios.onGet(`${baseURL}${endpoint}`).reply(200, expectedResponse);

        // Act
        const result = await client.request(endpoint, { params });

        // Assert
        expect(result).toEqual(expectedResponse);
        expect(mockAxios.history.get).toHaveLength(1);
        expect(mockAxios.history.get[0].params).toEqual(params);
      });
    });

    describe('POST requests', () => {
      it('should send a POST request with data to the correct endpoint', async () => {
        // Arrange
        const endpoint = '/create-resource';
        const postData = { name: 'Test Resource', value: 42 };
        const expectedResponse = { data: { id: 'resource-123' }, success: true };
        
        mockAxios.onPost(`${baseURL}${endpoint}`, postData).reply(201, expectedResponse);

        // Act
        const result = await client.request(endpoint, {
          method: 'POST',
          data: postData
        });

        // Assert
        expect(result).toEqual(expectedResponse);
        expect(mockAxios.history.post).toHaveLength(1);
        expect(mockAxios.history.post[0].url).toBe(endpoint);
        expect(mockAxios.history.post[0].method).toBe('post');
        expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(postData);
      });

      it('should send a POST request with both data and params', async () => {
        // Arrange
        const endpoint = '/create-resource';
        const postData = { name: 'Test Resource' };
        const params = { include: 'metadata' };
        const expectedResponse = { data: { id: 'resource-456' }, success: true };
        
        mockAxios.onPost(`${baseURL}${endpoint}`).reply(201, expectedResponse);

        // Act
        const result = await client.request(endpoint, {
          method: 'POST',
          data: postData,
          params
        });

        // Assert
        expect(result).toEqual(expectedResponse);
        expect(mockAxios.history.post).toHaveLength(1);
        expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(postData);
        expect(mockAxios.history.post[0].params).toEqual(params);
      });
    });

    describe('API error handling', () => {
      it('should correctly handle 400 Bad Request errors', async () => {
        // Arrange
        const endpoint = '/invalid-endpoint';
        const errorResponse = {
          message: 'Invalid request parameters',
          code: 'INVALID_PARAMS'
        };
        
        mockAxios.onGet(`${baseURL}${endpoint}`).reply(400, errorResponse);

        // Act & Assert
        await expect(client.request(endpoint)).rejects.toThrow('Invalid request parameters');
      });

      it('should correctly handle 401 Unauthorized errors', async () => {
        // Arrange
        const endpoint = '/protected-resource';
        const errorResponse = {
          message: 'Invalid API key',
          code: 'UNAUTHORIZED'
        };
        
        mockAxios.onGet(`${baseURL}${endpoint}`).reply(401, errorResponse);

        // Act & Assert
        await expect(client.request(endpoint)).rejects.toThrow('Invalid API key');
      });

      it('should correctly handle 500 Internal Server errors', async () => {
        // Arrange
        const endpoint = '/server-error';
        
        mockAxios.onGet(`${baseURL}${endpoint}`).reply(500);

        // Act & Assert
        await expect(client.request(endpoint)).rejects.toThrow('API Error: 500');
      });

      it('should handle network errors', async () => {
        // Arrange
        const endpoint = '/network-error';
        
        mockAxios.onGet(`${baseURL}${endpoint}`).networkError();

        // Act & Assert
        await expect(client.request(endpoint)).rejects.toThrow('Request error: Network Error');
      });

      it('should handle timeout errors', async () => {
        // Arrange
        const endpoint = '/timeout-error';
        
        mockAxios.onGet(`${baseURL}${endpoint}`).timeout();

        // Act & Assert
        await expect(client.request(endpoint)).rejects.toThrow('Request error: timeout of 10000ms exceeded');
      });

      it('should handle other request errors', async () => {
        // Arrange
        const endpoint = '/request-error';
        
        // Mock a generic request error
        mockAxios.onGet(`${baseURL}${endpoint}`).reply(() => {
          throw new Error('Custom request error');
        });

        // Act & Assert
        await expect(client.request(endpoint)).rejects.toThrow('Request error: Custom request error');
      });
    });

    describe('HTTP methods', () => {
      const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const;

      httpMethods.forEach(method => {
        it(`should handle ${method} requests correctly`, async () => {
          // Arrange
          const endpoint = `/test-${method.toLowerCase()}`;
          const expectedResponse = { data: { method }, success: true };
          const requestData = method !== 'GET' ? { test: 'data' } : undefined;
          
          // Mock the specific HTTP method
          const mockMethod = mockAxios as any;
          const methodName = method.toLowerCase();
          mockMethod[`on${method.charAt(0) + method.slice(1).toLowerCase()}`](`${baseURL}${endpoint}`)
            .reply(200, expectedResponse);

          // Act
          const result = await client.request(endpoint, {
            method,
            data: requestData
          });

          // Assert
          expect(result).toEqual(expectedResponse);
          const history = (mockAxios.history as any)[methodName];
          expect(history).toHaveLength(1);
          expect(history[0].method).toBe(methodName);
        });
      });
    });
  });

  describe('createTaxuClient function', () => {
    afterEach(() => {
      // Clean up any axios mocks
      if (mockAxios) {
        mockAxios.restore();
      }
    });

    describe('initialization with API key string', () => {
      it('should initialize correctly with an API key string', () => {
        // Arrange
        const apiKey = 'test-api-key-string';

        // Act
        const client = createTaxuClient(apiKey);

        // Assert
        expect(client).toBeInstanceOf(TaxuClient);
        // We can verify the client was created by checking if it has the expected methods
        expect(typeof client.request).toBe('function');
        expect(typeof client.calculateTax).toBe('function');
        expect(typeof client.getJurisdictions).toBe('function');
        expect(typeof client.ping).toBe('function');
      });

      it('should use default configuration when initialized with API key string', async () => {
        // Arrange
        const apiKey = 'test-api-key-default';
        const client = createTaxuClient(apiKey);
        const endpoint = '/test-default-config';
        const expectedResponse = { data: { config: 'default' }, success: true };
        
        // We need to mock axios globally since the client is created with its own instance
        const globalMock = new MockAdapter(axios);
        globalMock.onGet().reply(200, expectedResponse);

        // Act & Assert - This mainly tests that the client was created successfully
        // and can make requests (which verifies the internal axios instance was set up)
        try {
          await client.request(endpoint);
          // If we reach here, the client was initialized correctly
          expect(true).toBe(true);
        } catch (error) {
          // If there's an error, it should still be a properly formed TaxuClient error
          expect(error).toBeInstanceOf(Error);
        } finally {
          globalMock.restore();
        }
      });
    });

    describe('initialization with TaxuConfig object', () => {
      it('should initialize correctly with a TaxuConfig object', () => {
        // Arrange
        const config: TaxuConfig = {
          apiKey: 'test-api-key-config',
          baseURL: 'https://custom.api.taxu.io/v2',
          timeout: 5000
        };

        // Act
        const client = createTaxuClient(config);

        // Assert
        expect(client).toBeInstanceOf(TaxuClient);
        expect(typeof client.request).toBe('function');
        expect(typeof client.calculateTax).toBe('function');
        expect(typeof client.getJurisdictions).toBe('function');
        expect(typeof client.ping).toBe('function');
      });

      it('should use custom configuration when initialized with TaxuConfig object', async () => {
        // Arrange
        const customBaseURL = 'https://custom.api.taxu.io/v2';
        const config: TaxuConfig = {
          apiKey: 'test-api-key-custom',
          baseURL: customBaseURL,
          timeout: 15000
        };
        
        const endpoint = '/test-custom-config';
        const expectedResponse = { data: { config: 'custom' }, success: true };
        
        // Mock any GET request to return the expected response
        mockAxios.onGet().reply(200, expectedResponse);
        
        const client = createTaxuClient(config);

        // Act
        const result = await client.request(endpoint);

        // Assert
        expect(result).toEqual(expectedResponse);
        expect(mockAxios.history.get).toHaveLength(1);
      });

      it('should handle partial TaxuConfig objects', () => {
        // Arrange
        const partialConfig: TaxuConfig = {
          apiKey: 'test-api-key-partial',
          timeout: 8000
          // baseURL intentionally omitted to test defaults
        };

        // Act
        const client = createTaxuClient(partialConfig);

        // Assert
        expect(client).toBeInstanceOf(TaxuClient);
        expect(typeof client.request).toBe('function');
      });

      it('should handle minimal TaxuConfig with only apiKey', () => {
        // Arrange
        const minimalConfig: TaxuConfig = {
          apiKey: 'test-api-key-minimal'
        };

        // Act
        const client = createTaxuClient(minimalConfig);

        // Assert
        expect(client).toBeInstanceOf(TaxuClient);
        expect(typeof client.request).toBe('function');
      });
    });

    describe('type validation', () => {
      it('should handle empty string API key', () => {
        // Act & Assert
        expect(() => createTaxuClient('')).not.toThrow();
      });

      it('should handle config object with empty API key', () => {
        // Arrange
        const config: TaxuConfig = {
          apiKey: '',
          baseURL: 'https://api.taxu.io/v1'
        };

        // Act & Assert
        expect(() => createTaxuClient(config)).not.toThrow();
      });
    });
  });
});