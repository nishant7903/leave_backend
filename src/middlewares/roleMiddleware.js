const roleCheck = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403);
            throw new Error('Forbidden: You do not have the required permissions to perform this action.');
        }
        next();
    };
};

export { roleCheck };
