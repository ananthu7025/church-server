const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const churchController = require('../controllers/church');
const familyController = require('../controllers/family');
const eventController = require('../controllers/event');
const updateController = require('../controllers/update');

// // Admin routes
router.post('/admin/register', adminController.registerAdmin);// register new admin
router.post('/admin/login', adminController.loginAdmin); // login as admin 
router.post('/church/approve', adminController.approveChurch);// Approve Church
router.put('/admin/:churchId', adminController.updateChurch); // Update church details route
router.delete('/admin/:churchId', adminController.deleteChurch);// Delete church
// Church routes
router.post('/church/register', churchController.registerChurch); // regsiter as a new church
router.post('/church/login', churchController.loginChurch); // login church
router.post('/church/add-family', churchController.addFamily); // add familes
router.post('/church/bulk-add-families', churchController.bulkAddFamilies); // add a bluck of family
router.get('/church/get-all-families/:churchId', churchController.getAllFamilies); // add a bluck of family


// // Family routes
router.post('/family/verify-otp', familyController.verifyOTP); // family login verify otp
router.post('/family/verify-number', familyController.generateOTP); // family login generate otp
router.get('/family/get-my-family-details', familyController.getMyFamilyDetails); // get my family details

// Event routes
router.post('/church/create-event', eventController.createEvent);
router.post('/church/register-for-event', eventController.registerForEvent);
router.get('/event/details/:eventId', eventController.getEventDetails);

// Update routes
router.post('/church/create-update', updateController.createChurchUpdate);
router.get('/church/updates/:churchId', updateController.getChurchUpdates);

module.exports = router;
