# Deployment Guide - Witness Chicago

## Overview

This guide covers secure deployment of the Witness Chicago platform using the recommended architecture: GitHub Pages + Cloudflare + Azure Functions.

## Prerequisites

- GitHub account
- Cloudflare account (Pro plan recommended for advanced security features)
- Azure account
- Domain name registered through privacy-focused registrar
- PGP key pair for civil rights attorneys

## Phase 1: Domain and DNS Setup

### 1. Domain Registration
- Use privacy-focused registrar (Njalla, 1984 Hosting, or similar)
- Enable domain privacy protection
- Consider registering multiple TLD variants

### 2. Cloudflare Setup
```bash
# Add domain to Cloudflare
# Configure DNS records:
# A record: @ -> GitHub Pages IP (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153)
# CNAME record: www -> username.github.io
```

### 3. Privacy Configuration
```bash
# Cloudflare Settings:
# SSL/TLS: Full (strict)
# Always Use HTTPS: On
# HSTS: On (max-age: 31536000, includeSubDomains, preload)
# Minimum TLS Version: 1.2
# TLS 1.3: On
```

## Phase 2: GitHub Pages Setup

### 1. Repository Configuration
```bash
git clone https://github.com/your-org/witness-chicago-frontend.git
cd witness-chicago-frontend

# Configure GitHub Pages
# Settings > Pages > Source: Deploy from a branch
# Branch: main / root
# Custom domain: witnesschicago.org
```

### 2. GitHub Actions for Deployment
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Build
        run: npm run build
        
      - name: Security scan
        run: npm audit --audit-level moderate
        
      - name: Setup Pages
        uses: actions/configure-pages@v4
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
          
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## Phase 3: Cloudflare Security Configuration

### 1. Security Headers
Configure in Cloudflare Rules:
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### 2. Content Security Policy
```
default-src 'self'; 
script-src 'self'; 
style-src 'self' 'unsafe-inline'; 
img-src 'self' data: blob:; 
connect-src 'self' https://api.witnesschicago.org; 
font-src 'self'; 
frame-ancestors 'none'; 
base-uri 'self'; 
form-action 'self'
```

### 3. Privacy Settings
```bash
# Cloudflare Analytics: Off
# Browser Insights: Off
# Always Online: Off (to prevent caching sensitive content)
# IP Geolocation: Off
```

### 4. Rate Limiting
```bash
# Configure rate limiting rules:
# Form submissions: 5 per minute per IP
# Page requests: 30 per minute per IP
# API calls: 10 per minute per IP
```

## Phase 4: Backend API Setup (Azure Functions)

### 1. Azure Function App Creation
```bash
# Create resource group
az group create --name witness-chicago --location eastus

# Create storage account
az storage account create \
  --name witnesschicagostorage \
  --resource-group witness-chicago \
  --location eastus \
  --sku Standard_LRS

# Create function app
az functionapp create \
  --resource-group witness-chicago \
  --consumption-plan-location eastus \
  --runtime node \
  --runtime-version 18 \
  --functions-version 4 \
  --name witness-chicago-api \
  --storage-account witnesschicagostorage
```

### 2. Function Configuration
```javascript
// function.json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post"]
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}

// index.js (simplified)
module.exports = async function (context, req) {
    // Validate request
    // Store encrypted data
    // Send to legal team
    // Return response
    context.res = {
        status: 200,
        body: { success: true, reportId: generateId() }
    };
};
```

### 3. Security Configuration
```bash
# Configure CORS
az functionapp cors add \
  --resource-group witness-chicago \
  --name witness-chicago-api \
  --allowed-origins https://witnesschicago.org

# Configure custom domain
az functionapp config hostname add \
  --resource-group witness-chicago \
  --webapp-name witness-chicago-api \
  --hostname api.witnesschicago.org
```

## Phase 5: Monitoring and Security

### 1. Cloudflare Analytics
```bash
# Enable security analytics only:
# Security Events: On
# Bot Management: On
# DDoS Protection: On
# Web Application Firewall: On
```

### 2. Azure Monitoring
```bash
# Enable Application Insights
az monitor app-insights component create \
  --app witness-chicago-insights \
  --location eastus \
  --resource-group witness-chicago \
  --application-type web
```

### 3. Security Monitoring
```bash
# Set up alerts for:
# - Unusual traffic patterns
# - Failed authentication attempts
# - Rate limit violations
# - SSL certificate expiration
```

## Phase 6: Testing and Validation

### 1. Security Testing
```bash
# SSL Labs test
curl -s "https://api.ssllabs.com/api/v3/analyze?host=witnesschicago.org"

# Security headers test
curl -I https://witnesschicago.org

# OWASP ZAP scan
docker run -t owasp/zap2docker-stable zap-baseline.py -t https://witnesschicago.org
```

### 2. Performance Testing
```bash
# Lighthouse audit
npx lighthouse https://witnesschicago.org --output html --output-path ./lighthouse-report.html

# Core Web Vitals
npx web-vitals-cli https://witnesschicago.org
```

### 3. Accessibility Testing
```bash
# axe-core testing
npx @axe-core/cli https://witnesschicago.org

# Manual testing with screen readers
# - NVDA (Windows)
# - VoiceOver (macOS)
# - Orca (Linux)
```

## Phase 7: Legal and Compliance

### 1. Privacy Policy
- Draft comprehensive privacy policy
- Include data handling procedures
- Specify encryption methods
- Detail legal request procedures

### 2. Terms of Service
- User responsibilities
- Service limitations
- Liability disclaimers
- Jurisdiction specifications

### 3. Legal Team Setup
- Distribute private keys securely
- Set up secure communication channels
- Establish data access procedures
- Create incident response plan

## Phase 8: Launch Checklist

### Pre-Launch
- [ ] SSL certificate installed and tested
- [ ] Security headers configured
- [ ] CSP policy tested
- [ ] Form submission working
- [ ] File upload tested
- [ ] Encryption verified
- [ ] Mobile responsiveness confirmed
- [ ] Accessibility audit passed
- [ ] Performance metrics meet targets
- [ ] Legal documents reviewed
- [ ] Attorney key distribution complete

### Launch
- [ ] DNS propagation verified
- [ ] Monitoring systems active
- [ ] Backup procedures tested
- [ ] Incident response plan activated
- [ ] Legal team notified
- [ ] Community outreach prepared

### Post-Launch
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Verify security logs
- [ ] Test form submissions
- [ ] Monitor legal requests
- [ ] Update security documentation

## Emergency Procedures

### Security Incident Response
1. Isolate affected systems
2. Preserve evidence
3. Notify legal team
4. Document incident
5. Implement fixes
6. Review and improve

### Data Breach Protocol
1. Assess scope and impact
2. Notify relevant parties
3. Preserve encryption integrity
4. Review access logs
5. Implement additional safeguards
6. Update policies and procedures

## Maintenance Schedule

### Daily
- Monitor error logs
- Check security alerts
- Verify SSL certificate status

### Weekly
- Review access logs
- Update dependencies
- Test backup procedures

### Monthly
- Security audit
- Performance review
- Legal compliance check

### Quarterly
- Penetration testing
- Key rotation procedures
- Policy review and updates

## Contact Information

- **Technical Issues:** tech@witnesschicago.org
- **Security Concerns:** security@witnesschicago.org
- **Legal Matters:** legal@witnesschicago.org
- **Emergency Contact:** [Secure contact method]

## Additional Resources

- [OWASP Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [Cloudflare Security Documentation](https://developers.cloudflare.com/security/)
- [Azure Security Best Practices](https://docs.microsoft.com/en-us/azure/security/)
