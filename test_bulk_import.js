const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const testImport = async () => {
    try {
        // Create a dummy CSV
        const csvContent = "FirstName,LastName,Email,Role\nTest,User,test.bulk@example.com,student";
        const filePath = path.join(__dirname, 'test_members.csv');
        fs.writeFileSync(filePath, csvContent);

        const form = new FormData();
        form.append('file', fs.createReadStream(filePath));

        console.log('Sending Bulk Import Request...');
        const response = await axios.post('http://localhost:5000/api/college/members/bulk', form, {
            headers: {
                ...form.getHeaders(),
                'x-mock-role': 'admin'
            }
        });

        console.log('Response:', response.data);
        
        // Cleanup
        fs.unlinkSync(filePath);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
};

testImport();
