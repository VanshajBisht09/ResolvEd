const axios = require('axios');

const testDelete = async () => {
    try {
        const API_URL = 'http://localhost:5000/api/college/members';
        const headers = { 'x-mock-role': 'admin' };

        // 1. Fetch Users
        console.log('Fetching users...');
        const listResponse = await axios.get(API_URL, { headers });
        const users = listResponse.data;
        console.log(`Found ${users.length} users.`);

        if (users.length === 0) {
            console.log('No users to delete.');
            return;
        }

        // 2. Pick a victim (The one we just created in bulk test, or random)
        // Let's pick one with email 'test1@uni.edu' if exists, or just the last one
        let victim = users.find(u => u.email === 'test1@uni.edu');
        if (!victim) victim = users[0];

        console.log(`Attempting to delete: ${victim.firstName} (${victim._id})`);

        // 3. Delete
        const deleteUrl = `${API_URL}/${victim._id}`;
        console.log(`DELETE ${deleteUrl}`);
        
        try {
            const delResponse = await axios.delete(deleteUrl, { headers });
            console.log('Delete Success:', delResponse.data);
        } catch (delErr) {
            console.error('Delete Failed:', delErr.response ? delErr.response.data : delErr.message);
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
};

testDelete();
