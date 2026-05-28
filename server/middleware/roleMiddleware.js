const roleMiddleware = (...allowedRoles) => {

  return (req, res, next) => {

    try {

      if (!req.user) {

        return res.status(401).json({
          message: "Unauthorized"
        });
      }

      /*
      =========================
      CHECK ROLE
      =========================
      */

      if (
        !allowedRoles.includes(
          req.user.role
        )
      ) {

        return res.status(403).json({
          message:
            "Access Denied"
        });
      }

      next();

    } catch (error) {

      return res.status(500).json({
        message:
          "Role middleware error"
      });
    }
  };
};

module.exports = roleMiddleware;