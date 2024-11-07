[build]
  command = "npm run build"
  functions = "netlify/functions"
  publish = "dist"

[functions]
  node_bundler = "esbuild"
  external_node_modules = ["mercadopago"]

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[redirects]]
  from = "/api/payment/*"
  to = "/.netlify/functions/:splat"
  status = 200
  force = true

[build.environment]
  NODE_VERSION = "18"
