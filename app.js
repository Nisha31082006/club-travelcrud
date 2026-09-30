const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const MONGO_URI = process.env.MONGO_URI || 'mongodb://user_453w2gmu3:p453w2gmu3@db01.dbhost.dev:5050/db_453w2gmu3?authSource=db_453w2gmu3';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((err) => console.error('MongoDB connection error:', err));

const memberSchema = new mongoose.Schema({
  memberId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  clubName: { type: String, required: true },
  yearOfStudy: { type: Number, required: true },
  role: { type: String, required: true },
  points: { type: Number, required: true },
  interests: { type: [String], required: true },
  status: { type: String, required: true }
});
const ClubMember = mongoose.model('ClubMember', memberSchema);

const travelBuddySchema = new mongoose.Schema({
  buddyId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  destination: { type: String, required: true },
  age: { type: Number, required: true },
  budget: { type: Number, required: true },
  tripDuration: { type: String, required: true },
  interests: { type: [String], required: true },
  status: { type: String, required: true }
});
const TravelBuddy = mongoose.model('TravelBuddy', travelBuddySchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/ping', (req, res) => {
    res.send('pong');
});

app.post('/api/member-crud', async (req, res) => {
  try {
    const { action, memberId, name, clubName, yearOfStudy, role, points, interests, status } = req.body;
    let formattedInterests = typeof interests === 'string' ? interests.split(',').map(s => s.trim()) : interests;

    if (action === 'create') {
      const newMember = new ClubMember({ memberId, name, clubName, yearOfStudy, role, points, interests: formattedInterests, status });
      await newMember.save();
      res.json({ success: true, message: "Member created successfully!" });
    } else if (action === 'read') {
      const member = await ClubMember.findOne({ memberId });
      res.json({ success: true, data: member || "Member not found" });
    } else if (action === 'update') {
      const updated = await ClubMember.findOneAndUpdate(
        { memberId }, 
        { name, clubName, yearOfStudy, role, points, interests: formattedInterests, status }
      );
      res.json({ success: true, message: "Member updated successfully!", data: updated });
    } else if (action === 'delete') {
      await ClubMember.findOneAndDelete({ memberId });
      res.json({ success: true, message: "Member deleted successfully!" });
    }
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.post('/api/buddy-crud', async (req, res) => {
  try {
    const { action, buddyId, name, destination, age, budget, tripDuration, interests, status } = req.body;
    let formattedInterests = typeof interests === 'string' ? interests.split(',').map(s => s.trim()) : interests;

    if (action === 'create') {
      const newBuddy = new TravelBuddy({ buddyId, name, destination, age, budget, tripDuration, interests: formattedInterests, status });
      await newBuddy.save();
      res.json({ success: true, message: "Travel Buddy created successfully!" });
    } else if (action === 'read') {
      const buddy = await TravelBuddy.findOne({ buddyId });
      res.json({ success: true, data: buddy || "Travel Buddy not found" });
    } else if (action === 'update') {
      const updated = await TravelBuddy.findOneAndUpdate(
        { buddyId }, 
        { name, destination, age, budget, tripDuration, interests: formattedInterests, status }
      );
      res.json({ success: true, message: "Travel Buddy updated successfully!", data: updated });
    } else if (action === 'delete') {
      await TravelBuddy.findOneAndDelete({ buddyId });
      res.json({ success: true, message: "Travel Buddy deleted successfully!" });
    }
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});