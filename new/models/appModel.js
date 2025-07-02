const pool = require('../config/db');

exports.addDestination = async (name, description, image_url, location) => {
    const sql = `
        INSERT INTO destinations (name, description, image_url, location)
        VALUES (?, ?, ?, ?)
    `;
    const [result] = await pool.query(sql, [name, description, image_url, location]);

    return result;
};

exports.getAllDestinations = async () => {
    const sql = 'SELECT * FROM destinations ORDER BY id DESC';
    const [rows] = await pool.query(sql);
    return [rows]
}

exports.addTour = async (tourDetails) => {
    const sql = `
        INSERT INTO tours (
            name, 
            tour_slug,
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
            tour_image
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        tourDetails.name,
        tourDetails.destination_id,
        tourDetails.price,
        tourDetails.duration,
        tourDetails.start_date,
        tourDetails.end_date,
        tourDetails.max_participants,
        tourDetails.guide_name,
        tourDetails.transport_included,
        tourDetails.meals_included,
        tourDetails.highlights,
        tourDetails.itinerary,
        tourDetails.terms_and_conditions,
        tourDetails.tour_image,
    ];

    try {
        const [result] = await pool.query(sql, values);
        return {
            success: true,
            message: 'Tour added successfully',
            insertedId: result.insertId,
        };
    } catch (error) {
        console.error('Error adding tour:', error);
        throw new Error('Failed to add the tour.');
    }
};

exports.getTours = async () => {
    const sql = `
        SELECT 
            t.id,
            t.name AS tour_name,
            t.tour_slug,
            d.name AS destination_name,
            t.price,
            t.duration,
            t.start_date,
            t.end_date,
            t.max_participants,
            t.guide_name,
            t.transport_included,
            t.meals_included,
            t.highlights,
            t.itinerary,
            t.terms_and_conditions,
            t.tour_image,
            t.created_at,
            t.updated_at
        FROM tours t
        INNER JOIN destinations d ON t.destination_id = d.id
    `;

    try {
        const [rows] = await pool.query(sql);
        return [rows];
    } catch (error) {
        console.error('Error retrieving tours:', error);
        throw new Error('Failed to retrieve tours.');
    }
};

exports.getTourDetails = async (slug) => {
    const sql = `
        SELECT 
            t.id,
            t.name AS tour_name,
            t.tour_slug,
            d.name AS destination_name,
            t.price,
            t.duration,
            t.start_date,
            t.end_date,
            t.max_participants,
            t.guide_name,
            t.transport_included,
            t.meals_included,
            t.highlights,
            t.itinerary,
            t.terms_and_conditions,
            t.tour_image,
            t.created_at,
            t.updated_at
        FROM tours t
        INNER JOIN destinations d ON t.destination_id = d.id
        WHERE t.tour_slug = ?  -- Filter by the tour_slug
    `;

    try {
        const [rows] = await pool.query(sql, [slug]);  // Pass the slug parameter to the query
        return rows;  // Return the row(s) from the query
    } catch (error) {
        console.error('Error retrieving tour details:', error);
        throw new Error('Failed to retrieve tour details.');
    }
};

exports.bookTour = async (full_name, email, phone, departure_date, number_of_guests, more_info, tour_id) => {
    const sql = `
        INSERT INTO bookings (full_name, email, phone, departure_date, number_of_guests, more_info, tour_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(sql, [full_name, email, phone, departure_date, number_of_guests, more_info, tour_id]);

    return result;
};
