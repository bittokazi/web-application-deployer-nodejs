export default function TenantIdentifierInterceptor(req, res, next) {
  console.log(req.subdomains);
  const subdomainLength = 2;
  if (req.subdomains.length == subdomainLength && req.subdomains[0] != "www") {
    req.tenant = {
      key: req.subdomains[subdomainLength-1]
    };
  } else if (req.subdomains.length < subdomainLength && req.header("tenant") && req.header("tenant")!="null" && req.header("tenant")!="") {
    req.tenant = {
      key: req.header("tenant")
    };
  } else if (req.subdomains.length == subdomainLength && req.subdomains[0] == "www" && req.header("tenant") && req.header("tenant")!="null" && req.header("tenant")!="") {
    req.tenant = {
      key: req.header("tenant")
    };
  }
  console.log(req.header("tenant"));
  next();
}
