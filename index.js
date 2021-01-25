/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const passport = require('passport');
const AtlassianStrategy = require('passport-atlassian-oauth2');
var profileData;

// Configure Atlassian OOuth2 strategy for use by Passport.
passport.use(new AtlassianStrategy({
  clientID: 'keeL5Ne1bv4bwhskjKGRdYZ1kkOgQufz',
  clientSecret: 'k-UOpaxpek7kFDIYOg9Z9kbXDlmjyJzSdUohOxLsSy0lCOQyAZxHxgKKd3LtS2gI',
  callbackURL: '/auth/atlassian/callback',
  scope: 'offline_access read:me',
}, (accessToken, refreshToken, profile, cb) => {
  // Profile should be stored to the database in real applications
  console.log(JSON.stringify(profile, null, 2));
  profileData = JSON.stringify(profile, null, 2)
  cb(null, profile);
}));

// Dummy serialization/desiarialization
passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((obj, cb) => cb(null, obj));

const app = express();
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/atlassian', passport.authenticate('atlassian'));

app.get('/auth/atlassian/callback', passport.authenticate('atlassian', { failureRedirect: '/error' }), (req, res) => {
  // Successfull authorization, redirect user to profile page
  res.redirect('/profile-page');
});

app.get('/profile-page', (req, res) => {
  res.send(profileData);
});

app.get('/error', (req, res) => {
  res.send('Authorization error :(');
});

app.listen(8080, () => console.log('server started on port 8080'));
