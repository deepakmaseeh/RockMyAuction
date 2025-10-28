#!/bin/bash

# n8n Search Agent Test Script
# Run this after setting up everything to validate the workflow

echo "🚀 Testing n8n Search Agent..."
echo "=================================="

# Test 1: Check if services are running
echo "📋 Step 1: Checking Docker services..."

if docker ps | grep -q "searxng"; then
    echo "✅ SearXNG container is running"
else
    echo "❌ SearXNG container is not running"
    echo "   Fix: cd ~/auction-search-agent/searxng && docker-compose up -d"
    exit 1
fi

if docker ps | grep -q "n8n"; then
    echo "✅ n8n container is running"
else
    echo "❌ n8n container is not running"
    echo "   Fix: cd ~/auction-search-agent/n8n && docker-compose up -d"
    exit 1
fi

echo ""

# Test 2: Check if SearXNG is accessible
echo "📋 Step 2: Testing SearXNG API..."

SEARXNG_RESPONSE=$(curl -s "http://localhost:8888/search?q=test&format=json" | jq -r '.results | length' 2>/dev/null)

if [ "$SEARXNG_RESPONSE" != "null" ] && [ "$SEARXNG_RESPONSE" -gt "0" ]; then
    echo "✅ SearXNG API is working (found $SEARXNG_RESPONSE results)"
else
    echo "❌ SearXNG API is not responding correctly"
    echo "   Fix: Wait 30 seconds and try again, or check http://localhost:8888"
    exit 1
fi

echo ""

# Test 3: Test Normal Search
echo "📋 Step 3: Testing Normal Search..."

NORMAL_SEARCH_RESPONSE=$(curl -s -X POST http://localhost:5678/webhook/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "luxury watches auction test",
    "searchType": "normal"
  }' | jq -r '.success' 2>/dev/null)

if [ "$NORMAL_SEARCH_RESPONSE" = "true" ]; then
    echo "✅ Normal search is working"
else
    echo "❌ Normal search failed"
    echo "   Check: n8n workflow is activated and Groq credentials are set"
    echo "   Test manually: curl -X POST http://localhost:5678/webhook/search -H 'Content-Type: application/json' -d '{\"query\":\"test\",\"searchType\":\"normal\"}'"
    exit 1
fi

echo ""

# Test 4: Test Deep Search
echo "📋 Step 4: Testing Deep Search..."

DEEP_SEARCH_RESPONSE=$(curl -s -X POST http://localhost:5678/webhook/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "vintage watch auction test",
    "searchType": "deep"
  }' | jq -r '.success' 2>/dev/null)

if [ "$DEEP_SEARCH_RESPONSE" = "true" ]; then
    echo "✅ Deep search is working"
else
    echo "❌ Deep search failed"
    echo "   Check: n8n workflow is activated and Groq credentials are set"
    exit 1
fi

echo ""

# Test 5: Full Response Test
echo "📋 Step 5: Testing Full Response Format..."

FULL_RESPONSE=$(curl -s -X POST http://localhost:5678/webhook/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "rolex auction prices 2024",
    "searchType": "normal"
  }')

echo "Sample Response:"
echo "$FULL_RESPONSE" | jq '.' 2>/dev/null || echo "$FULL_RESPONSE"

# Check required fields
REQUIRED_FIELDS=("success" "query" "response" "searchResults" "sourceAttribution")
RESPONSE_VALID=true

for field in "${REQUIRED_FIELDS[@]}"; do
    if echo "$FULL_RESPONSE" | jq -e ".$field" >/dev/null 2>&1; then
        echo "✅ Field '$field' present in response"
    else
        echo "❌ Field '$field' missing in response"
        RESPONSE_VALID=false
    fi
done

echo ""

if [ "$RESPONSE_VALID" = true ]; then
    echo "🎉 ALL TESTS PASSED!"
    echo ""
    echo "Your n8n Search Agent is working correctly!"
    echo ""
    echo "Next steps:"
    echo "1. Add this URL to your .env.local:"
    echo "   NEXT_PUBLIC_N8N_WEBHOOK_URL=http://localhost:5678/webhook/search"
    echo ""
    echo "2. Update your ChatWindow.jsx with the provided code"
    echo ""
    echo "3. Test with your chatbot interface"
    echo ""
    echo "Webhook URL: http://localhost:5678/webhook/search"
    echo ""
    echo "Test commands:"
    echo "Normal Search: curl -X POST http://localhost:5678/webhook/search -H 'Content-Type: application/json' -d '{\"query\":\"luxury watches\",\"searchType\":\"normal\"}'"
    echo "Deep Search:   curl -X POST http://localhost:5678/webhook/search -H 'Content-Type: application/json' -d '{\"query\":\"luxury watches\",\"searchType\":\"deep\"}'"
else
    echo "❌ SOME TESTS FAILED"
    echo ""
    echo "Check the following:"
    echo "1. n8n workflow is imported and activated"
    echo "2. Groq API credentials are configured in n8n"
    echo "3. Both Docker containers are running"
    echo "4. No firewall blocking ports 5678 or 8888"
fi

echo ""
echo "=================================="
echo "Test completed: $(date)"