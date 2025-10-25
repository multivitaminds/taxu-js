# @taxu/taxu-js

The official TypeScript/JavaScript SDK for the Taxu platform - AI-powered tax filing and accounting automation.

[![npm version](https://img.shields.io/npm/v/@taxu/taxu-js.svg)](https://www.npmjs.com/package/@taxu/taxu-js)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @taxu/taxu-js
```

or

```bash
yarn add @taxu/taxu-js
```

## Quick Start

```typescript
import { TaxuClient } from '@taxu/taxu-js';

const taxu = new TaxuClient({
  apiKey: 'your-api-key-here'
});

// Calculate tax for a transaction
const result = await taxu.calculateTax({
  amount: 100.00,
  currency: 'USD',
  jurisdiction: 'US'
});

console.log(`Tax: $${result.data.taxAmount}`);
console.log(`Total: $${result.data.totalAmount}`);
```

## Configuration

### Basic Configuration

```typescript
import { TaxuClient } from '@taxu/taxu-js';

const taxu = new TaxuClient({
  apiKey: 'sk_test_...',  // Your API key from taxu.io
  baseURL: 'https://api.taxu.io/v1', // Optional: Custom API URL
  timeout: 10000 // Optional: Request timeout in ms
});
```

### Environment Variables

You can also set your API key using environment variables:

```bash
export TAXU_API_KEY=sk_test_...
```

```typescript
const taxu = new TaxuClient({
  apiKey: process.env.TAXU_API_KEY!
});
```

## API Reference

### Calculate Tax

Calculate tax for a given amount and jurisdiction using Taxu's AI-powered engine.

```typescript
const result = await taxu.calculateTax({
  amount: 100.00,
  currency: 'USD',
  jurisdiction: 'US',
  taxType: 'sales' // Optional
});

// Response
{
  data: {
    originalAmount: 100.00,
    taxAmount: 8.50,
    totalAmount: 108.50,
    taxRate: 0.085,
    jurisdiction: 'US',
    calculationId: 'calc_abc123'
  },
  success: true
}
```

### Get Jurisdictions

Fetch all supported tax jurisdictions.

```typescript
const jurisdictions = await taxu.getJurisdictions();

// Response
{
  data: ['US', 'CA', 'GB', 'AU', 'DE', 'FR'],
  success: true
}
```

### Health Check

Check API connectivity and service status.

```typescript
const status = await taxu.ping();

// Response
{
  data: {
    timestamp: '2024-01-15T10:30:00Z'
  },
  success: true
}
```

## Usage Examples

### React/Next.js Example

Perfect for integrating Taxu's AI-powered tax calculations into your e-commerce platform:

```typescript
import { TaxuClient } from '@taxu/taxu-js';
import { useState, useEffect } from 'react';

function TaxCalculator() {
  const [taxu] = useState(() => new TaxuClient({
    apiKey: process.env.NEXT_PUBLIC_TAXU_API_KEY!
  }));
  
  const [result, setResult] = useState(null);

  const calculateTax = async (amount: number) => {
    try {
      const response = await taxu.calculateTax({
        amount,
        currency: 'USD',
        jurisdiction: 'US'
      });
      setResult(response.data);
    } catch (error) {
      console.error('Tax calculation failed:', error);
    }
  };

  return (
    <div>
      <button onClick={() => calculateTax(100)}>
        Calculate Tax for $100
      </button>
      {result && (
        <p>Tax: ${result.taxAmount}, Total: ${result.totalAmount}</p>
      )}
    </div>
  );
}
```

### Node.js Backend Example

Integrate with your existing accounting workflow:

```typescript
import express from 'express';
import { TaxuClient } from '@taxu/taxu-js';

const app = express();
const taxu = new TaxuClient({
  apiKey: process.env.TAXU_API_KEY!
});

app.post('/calculate-tax', async (req, res) => {
  try {
    const { amount, jurisdiction } = req.body;
    
    const result = await taxu.calculateTax({
      amount,
      currency: 'USD',
      jurisdiction
    });
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## TypeScript Support

This SDK is written in TypeScript and includes full type definitions.

```typescript
import { 
  TaxuClient, 
  TaxCalculationRequest, 
  TaxCalculationResult,
  TaxuConfig 
} from '@taxu/taxu-js';

// All interfaces are fully typed
const config: TaxuConfig = {
  apiKey: 'sk_test_...'
};

const request: TaxCalculationRequest = {
  amount: 100,
  currency: 'USD',
  jurisdiction: 'US'
};
```

## Error Handling

The SDK provides detailed error information:

```typescript
try {
  const result = await taxu.calculateTax({ 
    amount: 100, 
    currency: 'USD' 
  });
} catch (error) {
  if (error.message.includes('API Error')) {
    // Handle API errors (4xx, 5xx responses)
    console.error('API Error:', error.message);
  } else if (error.message.includes('Network error')) {
    // Handle network connectivity issues
    console.error('Network Error:', error.message);
  } else {
    // Handle other errors
    console.error('Request Error:', error.message);
  }
}
```

## Features

This SDK gives you access to Taxu's comprehensive AI-powered financial platform:

- **Smart Tax Calculations** - AI automatically determines correct tax rates
- **Multi-Jurisdiction Support** - Handle taxes across different states/countries  
- **Real-time Processing** - Get instant tax calculations for checkout flows
- **Expense Categorization** - AI-powered transaction categorization
- **Receipt OCR** - Extract data from receipts with computer vision
- **Cash Flow Predictions** - ML-powered financial forecasting

## About Taxu

Taxu is an AI-powered tax and accounting platform trusted by 50,000+ businesses to automate their financial operations. We process $2B+ in transactions with 99.9% uptime and bank-level security.

**Platform Features:**
- Automated bookkeeping and expense tracking
- AI-powered tax filing (W-2, 1099, 941, and more)
- Real-time financial reports and cash flow forecasting  
- Invoice management and customer tracking
- SOC 2 certified security

## Support

- 📚 [Documentation](https://docs.taxu.io)
- 🌐 [Taxu Platform](https://taxu.io)
- 📧 [Developer Support](mailto:developers@taxu.io)
- 🐛 [Report Issues](https://github.com/multivitaminds/taxu-js/issues)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT © [Taxu](https://taxu.io)