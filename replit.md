# SwasthBharath - Digital Health Ecosystem

## Overview

SwasthBharath is a comprehensive digital health platform designed for the Government of India to support citizens across all life stages. The application provides technology-enabled healthcare solutions, health information resources, and data-driven insights to transform India's healthcare landscape.

The platform follows a life-stage approach to healthcare, offering specialized services and information for each phase of human development from prenatal care to end-of-life support.

## System Architecture

### Frontend Architecture
- **Framework**: Static HTML templates with Jinja2 templating
- **CSS Framework**: Bootstrap 5.3.0 for responsive design
- **JavaScript**: Vanilla JavaScript for interactive features
- **Icons**: Font Awesome 6.4.0 for visual elements
- **Styling**: Custom CSS with government color scheme and accessibility features

### Backend Architecture
- **Framework**: Flask 3.1.1 (Python web framework)
- **Application Structure**: Modular design with separated concerns
  - `main.py`: Application entry point
  - `app.py`: Flask application configuration
  - `routes.py`: URL routing and view functions
  - `life_stages_data.py`: Static data management
- **Template Engine**: Jinja2 for dynamic content rendering
- **Static Assets**: CSS, JavaScript, and image files served via Flask

### Data Storage Solutions
- **Current**: Static data stored in Python dictionaries
- **Database Ready**: PostgreSQL configured in environment (psycopg2-binary included)
- **Prepared for**: Future database integration with proper ORM setup

## Key Components

### 1. Life Stages System
- Seven distinct life stages from prenatal to end-of-life care
- Each stage contains health ecosystem programs and frontier technologies
- Dynamic routing system converts URL parameters to data keys
- Navigation between adjacent life stages

### 2. Template System
- **Base Template**: Common layout with navigation and footer
- **Page Templates**: Specialized layouts for different content types
- **Component Reuse**: Consistent styling and structure across pages
- **Accessibility**: Skip links, proper ARIA labels, semantic HTML

### 3. API Layer
- RESTful endpoints for data retrieval
- Search functionality for technologies across life stages
- JSON responses for frontend consumption
- Prepared for future expansion

### 4. Content Management
- Structured data format for health ecosystems and technologies
- Centralized content management in Python modules
- Easy content updates without code changes
- Scalable data structure for future enhancements

## Data Flow

1. **User Request**: Browser sends request to Flask application
2. **Routing**: Flask routes handler processes URL and parameters
3. **Data Retrieval**: Application fetches relevant data from static storage
4. **Template Rendering**: Jinja2 processes templates with dynamic data
5. **Response**: Rendered HTML sent back to browser
6. **Client Interaction**: JavaScript handles user interactions and API calls

## External Dependencies

### Python Packages
- **Flask 3.1.1**: Web framework and routing
- **Flask-SQLAlchemy 3.1.1**: Database ORM (prepared for future use)
- **Gunicorn 23.0.0**: WSGI HTTP server for deployment
- **psycopg2-binary 2.9.10**: PostgreSQL adapter
- **email-validator 2.2.0**: Email validation utilities

### Frontend Libraries
- **Bootstrap 5.3.0**: Responsive CSS framework
- **Font Awesome 6.4.0**: Icon library
- **No additional JavaScript frameworks**: Vanilla JS approach for performance

### System Dependencies
- **Python 3.11**: Runtime environment
- **PostgreSQL**: Database server (configured but not yet implemented)
- **OpenSSL**: Security and encryption support

## Deployment Strategy

### Current Setup
- **Platform**: Replit autoscale deployment
- **Server**: Gunicorn WSGI server
- **Port**: 5000 (configurable)
- **Binding**: All network interfaces (0.0.0.0)
- **Features**: Auto-reload enabled for development

### Production Considerations
- **Scalability**: Autoscale deployment target configured
- **Process Management**: Gunicorn with multiple workers
- **Security**: Session secret key from environment variables
- **Monitoring**: Prepared for health checks and logging

### Environment Configuration
- **Nix Environment**: Stable 24.05 channel
- **Module System**: Python 3.11 with required packages
- **Package Management**: UV lock file for dependency resolution

## Changelog
- June 22, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.