
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
