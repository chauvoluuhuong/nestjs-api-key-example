// Simple test script to demonstrate the API key functionality
// Make sure the server is running on http://localhost:3000

const BASE_URL = "http://localhost:3000";

// Helper function to make HTTP requests
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    console.log(`${options.method || "GET"} ${url}:`);
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));
    console.log("---");

    return { response, data };
  } catch (error) {
    console.error("Error:", error.message);
    return { error };
  }
}

async function testApiKeySystem() {
  console.log("🚀 Testing NestJS API Key System\n");

  // 1. Test basic endpoint (no auth required)
  console.log("1. Testing basic endpoint (no auth required)");
  await makeRequest(`${BASE_URL}/`);

  // 2. Create an API key
  console.log("2. Creating an API key");
  const createResponse = await makeRequest(`${BASE_URL}/api-keys`, {
    method: "POST",
    body: JSON.stringify({
      name: "Test API Key",
      description: "Test key for demonstration",
      scopes: ["read", "write"],
      expiresAt: "2025-12-31T23:59:59.000Z",
    }),
  });

  if (createResponse.error || !createResponse.data.key) {
    console.log(
      "❌ Failed to create API key. Make sure MongoDB is running and the server is started."
    );
    return;
  }

  const apiKey = createResponse.data.key;
  const apiKeyId = createResponse.data.apiKey._id;
  console.log(`✅ Created API key: ${apiKey}`);

  // 3. Test protected endpoint with API key
  console.log("3. Testing protected endpoint with API key");
  await makeRequest(`${BASE_URL}/protected`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  // 4. Test admin endpoint (should work with write scope)
  console.log("4. Testing admin endpoint");
  await makeRequest(`${BASE_URL}/admin`, {
    headers: {
      "X-API-Key": apiKey,
    },
  });

  // 5. Test analytics endpoint (should fail - no analytics scope)
  console.log(
    "5. Testing analytics endpoint (should fail - no analytics scope)"
  );
  await makeRequest(`${BASE_URL}/analytics`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  // 6. Update API key scopes
  console.log("6. Updating API key scopes to include analytics");
  await makeRequest(`${BASE_URL}/api-keys/${apiKeyId}/scopes`, {
    method: "PATCH",
    body: JSON.stringify({
      scopes: ["read", "write", "analytics"],
    }),
  });

  // 7. Test analytics endpoint again (should work now)
  console.log("7. Testing analytics endpoint again (should work now)");
  await makeRequest(`${BASE_URL}/analytics`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  // 8. Get API key usage statistics
  console.log("8. Getting API key usage statistics");
  await makeRequest(`${BASE_URL}/api-keys/${apiKeyId}/usage`);

  // 9. List all API keys
  console.log("9. Listing all API keys");
  await makeRequest(`${BASE_URL}/api-keys`);

  // 10. Deactivate API key
  console.log("10. Deactivating API key");
  await makeRequest(`${BASE_URL}/api-keys/${apiKeyId}/deactivate`, {
    method: "PATCH",
  });

  // 11. Test with deactivated key (should fail)
  console.log("11. Testing with deactivated key (should fail)");
  await makeRequest(`${BASE_URL}/protected`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  console.log("🎉 Test completed!");
}

// Run the test if this script is executed directly
if (typeof require !== "undefined" && require.main === module) {
  // For Node.js environment, we need to install fetch
  if (typeof fetch === "undefined") {
    console.log(
      "❌ This script requires fetch API. Install node-fetch or use Node.js 18+"
    );
    console.log("Run: npm install node-fetch");
    process.exit(1);
  }

  testApiKeySystem().catch(console.error);
}

module.exports = { testApiKeySystem };
