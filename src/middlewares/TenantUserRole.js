import pg from "../engine/PgPromise";

export default function TenantUserRole(req, res, next) {
  if (req.user != undefined) {
    if (req.user.role != "superAdmin") {
      if (
        req.tenant == undefined ||
        req.tenant.key == "null" ||
        req.tenant.key == ""
      ) {
        return res.status(201).json({
          action: "selectTenant"
        });
      }
      pg.query("SELECT id FROM companies WHERE key = $1 ", [req.tenant.key])
        .then(result => {
          if (result.length > 0) {
            console.log(result);
            pg.query(
              "SELECT role FROM CompanyUsers WHERE userId = $1 AND companyId = $2",
              [req.user.id, result[0].id]
            )
              .then(result2 => {
                console.log(result2);
                if (result2.length > 0) {
                  req.user.role = result2[0].role;
                  next();
                } else {
                  return res.status(403).json({
                    error: "Tenant Access Denied"
                  });
                  //next();
                }
              })
              .catch(function(error) {
                console.log(error);
                req.user = undefined;
                next();
              });
          } else {
            next();
          }
        })
        .catch(function(error) {
          console.log(error);
          next();
        });
    } else {
      next();
    }
  }
}
