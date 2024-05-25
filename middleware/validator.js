import createError from "http-errors";
import joi from "joi";

const validateRegisterUser = (req, res, next) => {
    const validationSchema = joi.object({
        username: joi.string().required().trim().min(3).disallow(""),
        fullName: joi.string().required().trim().min(3).disallow(""),
        bio: joi.string().trim().min(10).disallow(""),
        avatar: joi.string().default("photo.png"),
        coverPhoto: joi.string().default("photo.png"),
        password: joi.string().required().min(3).max(16),
        email: joi.string().required().email().disallow("")
    })

    const { error, value } = validationSchema.validate(req.body);
    if (error) {
        return next(createError(422, error.message))
    }
    req.body = value;
    next();
}

const validateLoginUser = (req, res, next) => {
    const validationSchema = joi.object({
        password: joi.string().required().min(3).max(16),
        email: joi.string().required().email().disallow("")
    })

    const { error, value } = validationSchema.validate(req.body);
    if (error) {
        return next(createError(422, error.message))
    }
    req.body = value;
    next();
}

const validateFetchReq = (req, res, next) => {
    const validationSchema = joi.object({
        page: joi.number().default(1).disallow(0),
        limit: joi.number().default(10).disallow(0),
        sort: joi.string().default("asc").disallow(""),
        type: joi.string().default("public").disallow(""),
        id: joi.string(),
    })

    const { error, value } = validationSchema.validate(req.query);
    if (error) {
        return next(createError(422, error.message))
    }

    console.log(value.type);
    if (value.type === "private" && value.id === undefined || value.id === "") {
        return next(createError(422, "id required."))
    }

    req.query = value;
    next()
}


export { validateRegisterUser, validateLoginUser, validateFetchReq };