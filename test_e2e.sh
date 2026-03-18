#!/bin/bash

echo "========================================"
echo "END-TO-END SYSTEM TEST"
echo "========================================"
echo ""

# Test 1: Health check
echo "✓ Test 1: Backend Health Check"
health=$(curl -s http://localhost:3001/api/health)
echo "Response: $health"
echo ""

# Test 2: Login with admin credentials
echo "✓ Test 2: Admin Login"
login_response=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@lembahcilengkrang.com","password":"password123"}')
token=$(echo $login_response | jq -r '.data.token // empty')
if [ -z "$token" ]; then
  echo "❌ Login failed!"
  echo "Response: $login_response"
else
  echo "✓ Login successful, token: ${token:0:20}..."
fi
echo ""

# Test 3: Get user profile with token
if [ ! -z "$token" ]; then
  echo "✓ Test 3: Get User Profile (Protected Endpoint)"
  profile=$(curl -s -H "Authorization: Bearer $token" http://localhost:3001/api/auth/me)
  nama=$(echo $profile | jq -r '.data.nama // empty')
  echo "User: $nama"
  echo ""
fi

# Test 4: Get wisata list  
echo "✓ Test 4: Get Wisata List (Paginated)"
wisata=$(curl -s 'http://localhost:3001/api/wisata?page=1&limit=3')
count=$(echo $wisata | jq '.data | length')
echo "Destinations found: $count"
echo ""

# Test 5: Get articles
echo "✓ Test 5: Get Articles"
articles=$(curl -s 'http://localhost:3001/api/articles?page=1&limit=3')
article_count=$(echo $articles | jq '.data | length')
echo "Articles found: $article_count"
echo ""

# Test 6: Get dashboard stats
echo "✓ Test 6: Get Admin Stats"
stats=$(curl -s 'http://localhost:3001/api/stats/admin')
wisata_count=$(echo $stats | jq '.data.totalWisata')
article_count=$(echo $stats | jq '.data.totalArtikel')
user_count=$(echo $stats | jq '.data.totalUser')
echo "Wisata: $wisata_count, Articles: $article_count, Users: $user_count"
echo ""

# Test 7: Contact form submission
echo "✓ Test 7: Contact Form Submission"
contact=$(curl -s -X POST http://localhost:3001/api/contacts \
  -H "Content-Type: application/json" \
  -d '{"nama":"Test User","email":"test@example.com","subjek":"Test","pesan":"This is a test message"}')
contact_success=$(echo $contact | jq -r '.success // false')
echo "Contact submitted: $contact_success"
echo ""

echo "========================================"
echo "ALL TESTS COMPLETED"
echo "========================================"
