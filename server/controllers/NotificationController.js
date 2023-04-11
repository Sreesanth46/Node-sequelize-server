const nodeMailer = require('../utils/nodeMailer')
const db = require('../models');
const Notification = db.notification_master;

// Check if current date is in range
const isDateInRage = (startDate, endDate) => (dateToCheck) => {
    return dateToCheck >= startDate && dateToCheck <= endDate;
}

// Get current notification profile
exports.list = async (req, res, next) => {
    const notification = await Notification.findAll({ where: { status: 1 }});
    if(notification === null ) return res.status(400).json({message: "No notification found"});
    
    const currentDate = new Date()
    console.log(currentDate);
    let response = []
    notification.forEach(element => {
        const dateRange = isDateInRage(element.fromDate, element.toDate)
        const inRange = dateRange(currentDate)
        // if in range push notification to response
        if(inRange) response.push(element);
    });
    return res.status(200).json({ notification: response });
}