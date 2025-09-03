# Witness Chicago

A secure, privacy-focused platform for documenting civil rights violations during federal law enforcement operations in Chicago.

## Mission Statement

Witness Chicago provides a safe, anonymous way for individuals to report civil rights violations by federal agents and law enforcement. All submissions are encrypted and made available to civil rights attorneys and advocacy organizations to support legal action and accountability.

## Project Overview

### Core Features

- **Single-page application** with comprehensive incident reporting form
- **End-to-end encryption** protecting all submitted data
- **Anonymous submission** with optional contact information
- **Multi-media support** for photos, videos, and documents
- **Mobile-optimized** responsive design
- **Accessibility compliant** (WCAG 2.1 AA)
- **Attack-resistant** with DDoS protection and anti-spam measures

### Form Fields

#### Personal Information (Optional)
- Submitter name
- Contact information (email/phone)
- Relationship to incident (witnessed/involved)

#### Incident Details
- Date and time of incident
- Location (address/intersection/area)
- Brief description of events
- Names of individuals involved (if known)

#### Incident Classification
**Type of Violations (checkboxes):**
- Unlawful detention/arrest
- Excessive force
- Search without warrant
- Seizure of property
- Denial of medical care
- Denial of legal representation
- Intimidation/harassment
- Other civil rights violations

**Agencies Involved (checkboxes):**
- Federal agents (unidentified)
- ICE
- FBI
- DEA
- ATF
- National Guard
- Local police
- Private contractors
- Unknown/unmarked

**Outcomes (checkboxes):**
- Physical injuries
- Arrests made
- Property damage
- Property seized
- Medical attention required
- Legal representation requested

#### Media Upload
- Photos
- Videos
- Documents
- Audio recordings
- Other evidence

#### Consent & Follow-up
- Privacy policy acknowledgment
- Optional: Request follow-up upload link via email

## Technical Architecture

### Frontend Stack
- **Framework:** Vanilla JavaScript or lightweight React build
- **Styling:** Tailwind CSS for responsive design
- **Build:** Vite for optimized bundling
- **Encryption:** WebCrypto API for client-side encryption
- **Forms:** Client-side validation with accessibility features

### Security & Privacy Design

#### Client-Side Encryption
- **Implementation:** All sensitive data encrypted in browser before transmission
- **Algorithm:** AES-256-GCM with RSA-4096 key exchange
- **Key Management:** Public key embedded in frontend, private key held by legal team
- **Zero-knowledge:** Hosting provider cannot decrypt submissions

#### Privacy Protection
- **No IP logging:** Cloudflare configured to not store visitor IPs
- **No analytics:** No Google Analytics, social media pixels, or tracking
- **Minimal metadata:** Only essential technical logs retained
- **Tor-friendly:** Compatible with Tor browser and VPNs

#### Attack Resistance
- **DDoS protection:** Cloudflare's enterprise-grade protection
- **Rate limiting:** Per-IP submission limits
- **CAPTCHA:** hCaptcha for spam prevention (privacy-focused alternative)
- **Content Security Policy:** Strict CSP headers
- **HTTPS only:** HSTS with preload directive

### Backend Architecture

#### Option 1: Serverless + Encrypted Storage (Recommended)
**Stack:**
- **Frontend:** GitHub Pages via Cloudflare
- **API:** Azure Functions (serverless)
- **Storage:** Azure Blob Storage with customer-managed keys
- **Database:** Azure Cosmos DB with encryption at rest

**Advantages:**
- No persistent servers to compromise
- Automatic scaling
- Encrypted storage with keys controlled by legal team
- Geographically distributed
- Cost-effective

#### Option 2: Self-Hosted Encrypted Backend
**Stack:**
- **Frontend:** GitHub Pages via Cloudflare
- **API:** Node.js on hardened Linux server
- **Storage:** Encrypted filesystem with LUKS
- **Database:** PostgreSQL with transparent data encryption

**Advantages:**
- Full control over infrastructure
- No third-party data processors
- Custom security hardening

**Disadvantages:**
- Requires dedicated security maintenance
- Single point of failure
- Higher operational overhead

### Data Flow

1. **User submits form** → Client-side validation
2. **Data encryption** → WebCrypto API encrypts all sensitive fields
3. **Transmission** → Encrypted payload sent to API endpoint
4. **Server processing** → Minimal metadata extraction, file storage
5. **Legal access** → Attorneys decrypt data using private key
6. **Follow-up** → Optional encrypted email with upload link

### Hosting & Infrastructure

#### Recommended: GitHub Pages + Cloudflare + Azure
- **Frontend:** GitHub Pages (free, reliable)
- **CDN/Proxy:** Cloudflare (privacy settings, DDoS protection)
- **Backend:** Azure Functions (serverless, encrypted)
- **Storage:** Azure with customer-managed encryption keys

#### DNS & Domain
- **Domain registration:** Privacy-focused registrar (Njalla, 1984 Hosting)
- **DNS:** Cloudflare with privacy proxy
- **SSL/TLS:** Cloudflare Universal SSL + HSTS

### Legal & Compliance Considerations

#### Data Protection
- **Encryption:** End-to-end encryption prevents subpoena compliance for content
- **Metadata:** Minimal logging reduces discoverable information
- **Jurisdiction:** Consider hosting in privacy-friendly jurisdictions
- **Warrant canary:** Public transparency about legal requests

#### Subpoena Resistance
- **Technical measures:** Encryption keys held separately from hosting
- **Legal structure:** Data controller separate from hosting provider
- **Documentation:** Clear policies on data handling and legal responses

## Development Roadmap

### Phase 1: MVP (Weeks 1-2)
- [ ] Basic form with all required fields
- [ ] Client-side encryption implementation
- [ ] File upload functionality
- [ ] Mobile-responsive design
- [ ] Basic accessibility features

### Phase 2: Security Hardening (Weeks 3-4)
- [ ] Security audit and penetration testing
- [ ] CAPTCHA integration
- [ ] Rate limiting implementation
- [ ] Content Security Policy
- [ ] Privacy policy and legal documentation

### Phase 3: Production Deployment (Week 5)
- [ ] Domain registration and DNS setup
- [ ] Cloudflare configuration
- [ ] Backend deployment and testing
- [ ] SSL/TLS configuration
- [ ] Monitoring and alerting setup

### Phase 4: Launch & Monitoring (Week 6+)
- [ ] Soft launch with legal partners
- [ ] Security monitoring implementation
- [ ] Performance optimization
- [ ] Documentation for legal team
- [ ] Incident response procedures

## Security Checklist

### Frontend Security
- [ ] Content Security Policy implemented
- [ ] No inline scripts or styles
- [ ] Subresource Integrity for all external resources
- [ ] HTTPS enforcement with HSTS
- [ ] No sensitive data in localStorage/sessionStorage

### Backend Security
- [ ] Input validation and sanitization
- [ ] Rate limiting and DDoS protection
- [ ] Secure headers (OWASP recommendations)
- [ ] Regular security updates
- [ ] Encrypted storage with separate key management

### Operational Security
- [ ] Regular security audits
- [ ] Incident response plan
- [ ] Secure deployment pipeline
- [ ] Monitoring and alerting
- [ ] Backup and recovery procedures

## Privacy Features

- **No user tracking:** No cookies, analytics, or fingerprinting
- **IP address protection:** Cloudflare configured not to log visitor IPs
- **Tor compatibility:** Fully functional through Tor browser
- **Minimal data collection:** Only essential information requested
- **Encryption by default:** All sensitive data encrypted before transmission

## Standards Compliance

### Web Content Accessibility Guidelines (WCAG 2.1 AA)
- **Keyboard navigation:** Full functionality without mouse
- **Screen reader support:** Semantic HTML with ARIA labels
- **Color contrast:** 4.5:1 minimum ratio for all text
- **Focus management:** Clear focus indicators and logical tab order
- **Alternative text:** Descriptive alt text for all images
- **Form labels:** Explicit labels for all form controls
- **Error handling:** Clear, accessible error messages
- **Resize compatibility:** 200% zoom without horizontal scrolling
- **Multiple languages:** Spanish translation (Phase 2)
- **Low bandwidth:** Optimized for slow connections
- **Offline capability:** Service worker for form completion

### OWASP Application Security Verification Standard (ASVS 4.0)
**Level 2 Standard (Recommended for sensitive applications)**

#### V1: Architecture, Design and Threat Modeling
- [ ] Security architecture documentation
- [ ] Threat model with data flow diagrams
- [ ] Security controls verification

#### V2: Authentication
- [ ] No authentication required (anonymous submission)
- [ ] Optional contact info with secure handling

#### V3: Session Management
- [ ] Stateless design (no sessions)
- [ ] Secure token handling for follow-up links

#### V4: Access Control
- [ ] Principle of least privilege
- [ ] Secure direct object references

#### V5: Validation, Sanitization and Encoding
- [ ] Input validation on all user data
- [ ] Output encoding for all dynamic content
- [ ] File upload validation and sandboxing

#### V7: Error Handling and Logging
- [ ] Generic error messages (no information leakage)
- [ ] Security event logging
- [ ] No sensitive data in logs

#### V8: Data Protection
- [ ] Client-side encryption implementation
- [ ] Secure data classification
- [ ] Memory clearing after processing

#### V9: Communication
- [ ] HTTPS everywhere with HSTS
- [ ] Certificate pinning
- [ ] Secure TLS configuration (TLS 1.3)

#### V10: Malicious Code
- [ ] Code integrity verification
- [ ] Subresource Integrity (SRI)
- [ ] Content Security Policy (CSP)

#### V11: Business Logic
- [ ] Rate limiting and anti-automation
- [ ] Sequential processing validation
- [ ] Business rule enforcement

#### V12: Files and Resources
- [ ] Secure file upload handling
- [ ] File type validation
- [ ] Malware scanning

#### V13: API and Web Service
- [ ] RESTful API security
- [ ] Request/response validation
- [ ] Rate limiting per endpoint

#### V14: Configuration
- [ ] Secure build and deployment
- [ ] Environment separation
- [ ] Security header configuration

### NIST Cybersecurity Framework (CSF 2.0)
**Core Functions Implementation**

#### GOVERN (GV)
- **GV.OC-01:** Organizational cybersecurity strategy
- **GV.RM-01:** Risk management strategy
- **GV.SC-01:** Cybersecurity supply chain risk management

#### IDENTIFY (ID)
- **ID.AM-01:** Asset inventory and management
- **ID.RA-01:** Vulnerability identification and analysis
- **ID.SC-01:** Supply chain risk assessment

#### PROTECT (PR)
- **PR.AC-01:** Access control management
- **PR.DS-01:** Data security and encryption
- **PR.IP-01:** Baseline configuration maintenance
- **PR.PT-01:** Protective technology implementation

#### DETECT (DE)
- **DE.AE-01:** Anomaly detection
- **DE.CM-01:** Network monitoring
- **DE.DP-01:** Detection process testing

#### RESPOND (RS)
- **RS.RP-01:** Response planning
- **RS.CO-01:** Response coordination
- **RS.AN-01:** Response analysis

#### RECOVER (RC)
- **RC.RP-01:** Recovery planning
- **RC.IM-01:** Recovery improvements
- **RC.CO-01:** Recovery coordination

### SEO and Metadata Standards (Schema.org)
#### Structured Data Markup
- **Organization schema:** NGO/NonProfit markup
- **WebSite schema:** Site navigation and search
- **WebPage schema:** Page-specific metadata
- **BreadcrumbList schema:** Navigation structure

#### Open Graph Protocol
- **og:title:** Witness Chicago - Report Civil Rights Violations
- **og:description:** Secure platform for documenting federal law enforcement violations
- **og:type:** website
- **og:url:** Canonical URL
- **og:image:** Social sharing image
- **og:site_name:** Witness Chicago

#### Twitter Card Markup
- **twitter:card:** summary_large_image
- **twitter:title:** Page-specific titles
- **twitter:description:** Compelling descriptions
- **twitter:image:** Optimized social images

#### Technical SEO
- **Meta robots:** Appropriate indexing directives
- **Canonical URLs:** Prevent duplicate content
- **XML sitemap:** Search engine discovery
- **robots.txt:** Crawler guidance
- **Page speed:** Core Web Vitals optimization

### Privacy Standards (ISO/IEC 27001 & 27701)
#### ISO/IEC 27001 (Information Security Management)
- **A.5.1:** Information security policies
- **A.6.1:** Organization of information security
- **A.8.1:** Asset management
- **A.10.1:** Cryptography
- **A.12.1:** Operational security
- **A.13.1:** Communications security
- **A.14.1:** System acquisition and development
- **A.16.1:** Information security incident management

#### ISO/IEC 27701 (Privacy Information Management)
- **A.7.2.1:** Data processing records
- **A.7.3.1:** Data subject rights
- **A.7.4.1:** Privacy by design
- **A.8.2.1:** Data breach notification
- **A.8.3.1:** Data protection impact assessment

### Web Performance Standards (Core Web Vitals)
#### Loading Performance
- **Largest Contentful Paint (LCP):** < 2.5 seconds
- **First Input Delay (FID):** < 100 milliseconds
- **Cumulative Layout Shift (CLS):** < 0.1

#### Additional Metrics
- **First Contentful Paint (FCP):** < 1.8 seconds
- **Time to Interactive (TTI):** < 3.5 seconds
- **Total Blocking Time (TBT):** < 200 milliseconds

### Content Security Standards
#### Content Security Policy (CSP) Level 3
- **default-src:** 'self'
- **script-src:** 'self' with nonce-based inline scripts
- **style-src:** 'self' 'unsafe-inline' (for critical CSS)
- **img-src:** 'self' data: blob:
- **connect-src:** 'self' [API endpoints]
- **font-src:** 'self'
- **frame-ancestors:** 'none'
- **base-uri:** 'self'
- **form-action:** 'self'

#### HTTP Security Headers (OWASP Secure Headers Project)
- **Strict-Transport-Security:** max-age=31536000; includeSubDomains; preload
- **X-Frame-Options:** DENY
- **X-Content-Type-Options:** nosniff
- **Referrer-Policy:** strict-origin-when-cross-origin
- **Permissions-Policy:** Restrictive feature policy

## Legal Framework

### Terms of Service
- Clear explanation of data handling
- Limitations of legal protection
- User responsibilities and risks

### Privacy Policy
- Detailed data processing explanation
- Encryption and security measures
- Legal request handling procedures
- User rights and data retention

### Attorney Access
- Secure key distribution to verified attorneys
- Access logging and audit trails
- Data sharing agreements with legal organizations

## Contact & Support

For legal organizations seeking access or technical support:
- **Legal inquiries:** [legal@witnesschicago.org]
- **Technical issues:** [tech@witnesschicago.org]
- **Security concerns:** [security@witnesschicago.org]

## Contributing

This project prioritizes security and privacy. All contributors must:
- Sign security-focused contribution agreement
- Follow secure coding practices
- Submit to security review process
- Maintain confidentiality of sensitive implementation details

## License

[License to be determined - likely GPL v3 or similar copyleft license]

---

**⚠️ Security Notice:** This application is designed to protect civil liberties but cannot guarantee absolute security. Users should consider their personal safety and use additional privacy tools (VPN, Tor) when accessing this service.

**🛡️ Legal Disclaimer:** This platform is for documenting civil rights violations. Users should consult with attorneys about their specific legal situations and rights.