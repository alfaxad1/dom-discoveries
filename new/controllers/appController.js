const AppModel = require('../models/appModel')
const { sendCustomerEmailOptions, adminEmailOptions } = require('../services/emailService');

exports.addDestination = async (req, res) => {
    const { name, description, location } = req.body;

    const image_url = req.files['image_url'] ? req.files['image_url'][0].filename : null;

    if (!name || typeof name !== 'string') {
        return res.status(400).json({ message: 'Destination name is required and must be a string.' });
    }

    if (!location || typeof location !== 'string') {
        return res.status(400).json({ message: 'Destination location is required and must be a string.' });
    }

    if (!image_url) {
        return res.status(400).json({ message: 'Destination photo is required.' });
    }

    try {
        const result = await AppModel.addDestination(name, description, image_url, location);
        res.status(200).json({message: "Destination Added"});
    } catch (error) {
        res.status(500).json({message: `Something went wrong!!! try again later: ${error}`});
    }
}

exports.getAllDestinations = async (req, res) => {
    try {
        const [result] = await AppModel.getAllDestinations();

        res.status(200).json({destinations:result})
    } catch (error) {
        res.status(500).json({message: `Something went wrong!!! try again later: ${error}`});
    }
}

exports.addTour = async (req, res) => {
    const {
        name,
        destination_id,
        price,
        duration,
        start_date,
        end_date,
        max_participants,
        guide_name,
        transport_included,
        meals_included,
        highlights,
        itinerary,
        terms_and_conditions,
    } = req.body; 

    // Retrieve image URL from uploaded files 
    const tour_image = req.files['tour_image'] ? req.files['tour_image'][0].filename : null;

    // Validate required fields
    if (!name || typeof name !== 'string') {
        return res.status(400).json({ message: 'Tour name is required and must be a string.' });
    }

    if (!destination_id || isNaN(destination_id)) {
        return res.status(400).json({ message: 'Valid destination ID is required.' });
    }

    if (!price || isNaN(price)) {
        return res.status(400).json({ message: 'Valid price is required.' });
    }

    if (!duration || typeof duration !== 'string') {
        return res.status(400).json({ message: 'Tour duration is required and must be a string.' });
    }

    if (!start_date || !Date.parse(start_date)) {
        return res.status(400).json({ message: 'Valid start date is required.' });
    }

    if (!end_date || !Date.parse(end_date)) {
        return res.status(400).json({ message: 'Valid end date is required.' });
    }

    if (!max_participants || isNaN(max_participants)) {
        return res.status(400).json({ message: 'Valid max participants count is required.' });
    }

    if (!tour_image) {
        return res.status(400).json({ message: 'Tour image is required.' });
    }

    try {
        const tourDetails = {
            name,
            tour_slug: createSlug(name),
            destination_id,
            price,
            duration,
            start_date,
            end_date,
            max_participants,
            guide_name,
            transport_included: transport_included === 'true',  
            meals_included: meals_included === 'true',  
            highlights,
            itinerary,
            terms_and_conditions,
            tour_image: tour_image,  
        };

        // Call model function to insert tour
        const result = await AppModel.addTour(tourDetails);

        res.status(200).json({ message: 'Tour added successfully', tourId: result.insertedId });
    } catch (error) {
        console.error('Error adding tour:', error);
        res.status(500).json({ message: `Something went wrong! Try again later: ${error.message}` });
    }
};

function createSlug(name) {
    return name
        .toLowerCase()              
        .replace(/[^a-z0-9\s]/g, '')   
        .replace(/\s+/g, '-')          
        .trim();                     
}

exports.getAllTour = async (req, res) => {
    try {
        // Retrieve tours from the model
        const [tours] = await AppModel.getTours();

        if (tours.length === 0) {
            return res.status(404).json({ message: 'No tours found.' });
        } 
        res.status(200).json({tours})
    } catch (error) {
        console.error('Error fetching tours:', error);
        res.status(500).json({ message: `Something went wrong!!! Try again later: ${error.message}` });
    }
};

exports.getAllDetails = async (req, res) => {
    const { slug } = req.query;

    console.log(slug)
    try {
        const tourDetails = await AppModel.getTourDetails(slug);  
        if (tourDetails.length === 0) {
            return res.status(404).json({ message: 'Tour not found' });
        }
        res.json(tourDetails[0]);   
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.bookTour = async (req, res) => {
    // Destructure required fields from req.body
    const { full_name, email, phone, departure_date, number_of_guests, more_info, tour_id } = req.body;

    // Validate input fields
    if (!full_name || typeof full_name !== 'string') {
        return res.status(400).json({ message: 'Full Name is required and must be a string.' });
    }

    if (!email || typeof email !== 'string') {
        return res.status(400).json({ message: 'Email Address is required and must be a string.' });
    }

    if (!phone || typeof phone !== 'string') {
        return res.status(400).json({ message: 'Phone Number is required and must be a string.' });
    }

    if (!departure_date || isNaN(new Date(departure_date))) {
        return res.status(400).json({ message: 'Valid Departure Date is required.' });
    }

    if (!number_of_guests ) {
        return res.status(400).json({ message: 'Number of Guests is required ' });
    }

    try {
         
        const result = await AppModel.bookTour(
            full_name, 
            email, 
            phone, 
            departure_date, 
            number_of_guests, 
            more_info, 
            tour_id
        );

        // Send a successful response
        res.status(200).json({ message: 'Booking successful', result });
        const message = `Hello ${full_name},\n\nYour booking for the tour is confirmed!\n\nTour Details:\nDeparture Date: ${departure_date}\nNumber of Guests: ${number_of_guests}\nMore Info: ${more_info}\n\nThank you for booking with us!\n\nBest regards,\nThe Team`; 
        const adminMessage = `A new booking has been made:\n\nCustomer Name: ${full_name}\nEmail: ${email}\nPhone: ${phone}\nDeparture Date: ${departure_date}\nNumber of Guests: ${number_of_guests}\nMore Info: ${more_info}\n\nPlease review and confirm the booking.`;
        await sendCustomerEmailOptions(email, message); 
        await adminEmailOptions("info@vacationmasters.co.ke", adminMessage); 
    } catch (error) {
        console.error('Error booking tour:', error);
        res.status(500).json({ message: `Something went wrong, please try again later: ${error.message}` });
    }
};

