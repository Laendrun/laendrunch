

exports.get_role_id = (req, res, next) => {
    res.status(200).json({
        role_id: req.user.role_id
    })
}