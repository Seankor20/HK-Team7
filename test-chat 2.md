# Testing the Real-Time Chat System

## Step 1: Database Setup
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the entire `database-setup.sql` content
4. Run the script
5. Check that all tables are created successfully

## Step 2: Enable Realtime
1. Go to Database → Replication
2. Click the Realtime tab
3. Enable realtime for these tables:
   - `messages`
   - `chatRooms` 
   - `roomParticipants`

## Step 3: Test Authentication
1. Make sure you have a user account in Supabase Auth
2. The system will automatically create a user profile when you first access it

## Step 4: Test Chat Rooms
1. Navigate to `/chat` in your app
2. You should see the three sections: General Announcements, Teacher Chat, Parents Chat
3. Try creating a new chat room in the Parents Chat section

## Step 5: Test Real-Time Messaging
1. Click on a chat room to enter it
2. Type a message and send it
3. Open another browser/incognito window
4. Navigate to the same chat room
5. Send a message from the second window
6. Verify messages appear in real-time in both windows

## Troubleshooting

### If you see "Authentication error":
- Check that you're logged in
- Verify your Supabase environment variables are correct

### If you see "Failed to load chat rooms":
- Check the browser console for specific error messages
- Verify the database tables were created correctly
- Check that RLS policies are in place

### If messages don't appear in real-time:
- Verify realtime is enabled for the tables
- Check browser console for connection status
- Ensure you're using the correct Supabase URL and keys

### If you can't create chat rooms:
- Check that the user profile was created successfully
- Verify RLS policies allow authenticated users to create rooms

## Console Logs to Watch For
The system now includes extensive logging. Look for:
- "Channel status: SUBSCRIBED" - Real-time connection successful
- "Sending message: [content]" - Message being sent
- "Message saved to database: [data]" - Message saved successfully
- "Broadcast result: ok" - Message broadcast successful
- "Received broadcast message: [payload]" - Message received in real-time

## Common Issues & Solutions

### Issue: "relation does not exist"
**Solution**: Run the database setup script again

### Issue: "permission denied"
**Solution**: Check RLS policies and ensure user is authenticated

### Issue: "realtime not enabled"
**Solution**: Enable realtime for the required tables in Supabase

### Issue: Messages not saving
**Solution**: Check that the user is a participant in the room
