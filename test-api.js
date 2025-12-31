// Quick API test script
const baseUrl = 'http://localhost:5500';

async function testAPI() {
    console.log('🧪 Testing Subscription Tracker API...\n');
    
    try {
        // Test 1: Root endpoint
        console.log('1️⃣ Testing root endpoint...');
        const response1 = await fetch(baseUrl);
        const text1 = await response1.text();
        console.log('✅ Root:', text1);
        
        // Test 2: Sign in (assuming user exists)
        console.log('\n2️⃣ Testing sign-in...');
        const signInResponse = await fetch(`${baseUrl}/api/v1/auth/sign-in`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'password123'
            })
        });
        
        if (signInResponse.ok) {
            const signInData = await signInResponse.json();
            console.log('✅ Sign-in successful');
            
            const token = signInData.data.token;
            
            // Test 3: Get subscriptions (protected route)
            console.log('\n3️⃣ Testing protected route (subscriptions)...');
            const subsResponse = await fetch(`${baseUrl}/api/v1/subscriptions`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (subsResponse.ok) {
                const subsData = await subsResponse.json();
                console.log('✅ Subscriptions endpoint working');
                console.log('📊 Analytics:', subsData.analytics);
            } else {
                console.log('❌ Subscriptions endpoint failed');
            }
            
            // Test 4: Create subscription
            console.log('\n4️⃣ Testing create subscription...');
            const createResponse = await fetch(`${baseUrl}/api/v1/subscriptions`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: 'Test Netflix',
                    price: 15.99,
                    currency: 'USD',
                    frequency: 'monthly',
                    category: 'entertainment',
                    payment: 'Credit Card',
                    startDate: new Date().toISOString()
                })
            });
            
            if (createResponse.ok) {
                const createData = await createResponse.json();
                console.log('✅ Subscription created successfully');
            } else {
                const errorData = await createResponse.json();
                console.log('❌ Create subscription failed:', errorData);
            }
            
        } else {
            console.log('❌ Sign-in failed');
        }
        
        console.log('\n🎉 API testing completed!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testAPI();