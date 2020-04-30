export default function ServiceTenantIdentifier(req, res, next) {
  if (req.header("tenant")) {
    req.tenant = {
      key: req.header("tenant")
    };
  } else {
    return res.status(403).json({
      error: "Tenant Access Denied"
    });
  }
  next();
}
