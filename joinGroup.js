const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// 1. Initialize the client with local session management
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true, // Set to false if you want to visually see the browser open
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// 2. Generate a QR Code in your terminal to link your testing WhatsApp account
client.on('qr', (qr) => {
    console.log('Scan this QR code with your phone to log into the testing account:');
    qrcode.generate(qr, { small: true });
});

// 3. Confirm connection
client.on('ready', async () => {
    console.log('Client is successfully authenticated and ready!');

    // INSERT THE INVITE LINK HERE
    // Format can be the full URL (https://whatsapp.com) or just the unique token suffix
    const inviteLinkOrCode = "https://whatsapp.com"; 

    // Extract just the alphanumeric code from the link
    const inviteCode = inviteLinkOrCode.replace('https://chat.whatsapp.com/', '');

    console.log(`Attempting to join group using invite code: ${inviteCode}`);

    try {
        // Submit the join request directly to WhatsApp servers via the API
        // This simulates a user clicking "Join Chat" in a browser
        await client.acceptInvite(inviteCode);
        console.log('Success! The account has successfully joined the group.');
    } catch (error) {
        console.error('Failed to join group:', error.message);
        console.log('Possible causes: The link was revoked by an admin, the group is full, or it requires Admin Approval.');
    } finally {
        // Gracefully shut down the automation client
        await client.destroy();
    }
});

// Start the client authentication process
client.initialize();
