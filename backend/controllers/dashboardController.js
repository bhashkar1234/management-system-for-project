const Communication = require('../models/Communication');
const Company = require('../models/Company');
const CommunicationMethod = require('../models/CommunicationMethod');

exports.getDashboardData = async (req, res) => {
    try {
        const companies = await Company.find(); // Fetch all companies
        if (!companies.length) {
            console.error('No companies found');
            return res.status(404).json({ message: 'No companies found' });
        }

        const dashboardData = await Promise.all(companies.map(async (company) => {
            // Fetch last 5 communications, populate the 'type' field with CommunicationMethod data
            const lastCommunications = await Communication.find({ companyId: company._id })
                .sort({ date: -1 })
                .limit(5)
                .populate('type', 'name description sequence mandatory'); // Populating communication method data

            // Log the communications to check population
            console.log('Last Communications for company', company.name, lastCommunications);

            // Fetch the next scheduled communication, populate the 'type' field
            const nextCommunication = await Communication.findOne({ companyId: company._id })
                .sort({ date: 1 })
                .populate('type', 'name description sequence mandatory'); // Populating communication method data

            console.log('Next Scheduled Communication Query:', nextCommunication);
            console.log('Next Scheduled Communication for company', company.name, nextCommunication);

            const formatDate = (date) => {
                if (date && date instanceof Date) {
                    return date.toISOString().split('T')[0]; // Format date (yyyy-mm-dd)
                }
                return null; // Return null if date is undefined or invalid
            };

            // Helper function to safely get type name
            const getTypeName = (type) => {
                if (type && type.name) {
                    return type.name; // Return the name if type exists
                }
                return 'Unknown'; // Return 'Unknown' if type is null or doesn't have a name
            };

            return {
                companyName: company.name,
                lastFiveCommunications: lastCommunications.map(comm => ({
                    type: getTypeName(comm.type), // Safely get the type name
                    description: comm.type ? comm.type.description : 'No Description', // Handle null type
                    date: formatDate(comm.startDate), // Accessing the correct date field
                })),
                nextScheduledCommunication: nextCommunication ? {
                    type: getTypeName(nextCommunication.type), // Safely get the type name
                    description: nextCommunication.type ? nextCommunication.type.description : 'No Description', // Handle null type
                    date: formatDate(nextCommunication.startDate), // Accessing the correct date field
                } : null
            };
        }));

        res.status(200).json(dashboardData);
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
    }
};
