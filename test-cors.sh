#!/bin/bash

# Test if Render backend has deployed the CORS fix
echo "Testing CORS configuration..."
echo "================================"
echo ""

# Test OPTIONS request (CORS preflight)
echo "1. Testing CORS Preflight (OPTIONS request):"
response=$(curl -s -X OPTIONS https://property237.onrender.com/api/auth/signup/ \
  -H "Origin: https://property237.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: content-type" \
  -i 2>&1)

if echo "$response" | grep -q "access-control-allow-origin"; then
    echo "✅ CORS headers present!"
    echo "$response" | grep -i "access-control"
else
    echo "❌ CORS headers NOT found - Render deployment still in progress"
    echo "   Wait 2-3 more minutes and run this script again"
fi

echo ""
echo "2. Testing actual POST request:"
response=$(curl -s -X POST https://property237.onrender.com/api/auth/signup/ \
  -H "Origin: https://property237.vercel.app" \
  -H "Content-Type: application/json" \
  -d '{"phone_number":"test"}' \
  -w "\nHTTP Status: %{http_code}\n" 2>&1)

echo "$response" | tail -10

echo ""
echo "================================"
if echo "$response" | grep -q "errors"; then
    echo "✅ Backend is responding correctly!"
    echo "🎯 Sign-up should work now at: https://property237.vercel.app/sign-up"
else
    echo "⏳ Waiting for deployment..."
fi
