
const Joi = require('joi');

const validatePaymentData = (req, res, next) => {
    const schema = Joi.object({
        amount: Joi.number().positive().required(),
        currency: Joi.string().valid('NGN').default('NGN'),
        pitchId: Joi.string().required(),
        selectedDate: Joi.date().iso().required(),
        selectedSlots: Joi.array().items(Joi.string()).min(1).required(),
        customerEmail: Joi.string().email().required(),
        customerPhone: Joi.string().pattern(/^[0-9+\-\s()]+$/).required(),
        customerName: Joi.string().min(2).required(),
        paymentMethod: Joi.string().valid('card', 'banktransfer', 'ussd').default('card')
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            error: 'Validation error',
            details: error.details.map(detail => detail.message)
        });
    }

    req.body = value;
    next();
};

const validateBookingData = (req, res, next) => {
    const schema = Joi.object({
        pitchId: Joi.string().required(),
        date: Joi.date().iso().required(),
        timeSlots: Joi.array().items(Joi.string()).min(1).required(),
        customerName: Joi.string().min(2).required(),
        customerEmail: Joi.string().email().optional(),
        customerPhone: Joi.string().pattern(/^[0-9+\-\s()]+$/).optional(),
        totalAmount: Joi.number().positive().required()
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            error: 'Validation error',
            details: error.details.map(detail => detail.message)
        });
    }

    req.body = value;
    next();
};

module.exports = {
    validatePaymentData,
    validateBookingData
};
const validatePaymentData = (req, res, next) => {
    const { amount, pitchId, selectedDate, selectedSlots, customerEmail, customerPhone, customerName } = req.body;

    // Basic validation
    if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Valid amount is required' });
    }

    if (!pitchId) {
        return res.status(400).json({ error: 'Pitch ID is required' });
    }

    if (!selectedDate) {
        return res.status(400).json({ error: 'Date is required' });
    }

    if (!selectedSlots || !Array.isArray(selectedSlots) || selectedSlots.length === 0) {
        return res.status(400).json({ error: 'Time slots are required' });
    }

    if (!customerEmail || !customerEmail.includes('@')) {
        return res.status(400).json({ error: 'Valid email is required' });
    }

    if (!customerPhone) {
        return res.status(400).json({ error: 'Phone number is required' });
    }

    if (!customerName) {
        return res.status(400).json({ error: 'Customer name is required' });
    }

    next();
};

module.exports = { validatePaymentData };
