// Comprehensive Updates Data for CitizensConnect
// Contains latest information for different update categories

export const updatesCategories = {
  government_initiatives: {
    title: "Government Initiatives",
    icon: "🏛️",
    color: "#6a47f2",
    description: "Track progress on government projects and civic initiatives in your area",
    lastUpdated: "2024-11-29",
    availableDateRange: {
      earliest: "2024-10-01",
      latest: "2024-11-29",
      totalDays: 60
    },
    availableOptions: ["Last 7 Days", "Last 30 Days", "Last 60 Days", "Custom Range"],
    updates: [
      {
        id: "smart_city_vijayawada",
        title: "Smart City Vijayawada - Phase 2 Launch",
        date: "2024-11-28",
        priority: "high",
        location: "Vijayawada, Andhra Pradesh",
        summary: "The Andhra Pradesh government has launched Phase 2 of the Smart City Vijayawada project, focusing on digital infrastructure and citizen services.",
        details: "Phase 2 includes implementation of smart traffic management systems, IoT-enabled waste management, digital payment gateways for municipal services, and AI-powered citizen service centers. The project aims to improve quality of life for 1.2 million residents with an investment of ₹1,200 crores.",
        status: "In Progress",
        timeline: "Expected completion: March 2025",
        contact: "Smart City Vijayawada Office: +91-866-1234567",
        source: "Andhra Pradesh Government",
        url: "https://ap.gov.in/smart-city-vijayawada"
      },
      {
        id: "digital_literacy_program",
        title: "National Digital Literacy Mission",
        date: "2024-11-25",
        priority: "medium",
        location: "All India",
        summary: "Ministry of Education launches nationwide digital literacy program targeting 10 million rural citizens.",
        details: "The program aims to provide free digital skills training to citizens above 50 years and rural youth. Training modules include smartphone usage, online banking, government service portals, and cyber safety. The initiative is part of the broader Digital India mission.",
        status: "Active",
        timeline: "Phase 1: December 2024 - June 2025",
        contact: "Digital Literacy Helpline: 1800-XXX-XXXX",
        source: "Ministry of Education",
        url: "https://digitalindia.gov.in/literacy-mission"
      },
      {
        id: "rural_electricity",
        title: "24/7 Power Supply to Rural Areas",
        date: "2024-11-20",
        priority: "high",
        location: "Rural Andhra Pradesh",
        summary: "Government achieves 100% electrification in remaining rural pockets of Andhra Pradesh.",
        details: "The last-mile connectivity project has brought reliable power supply to 5,000 previously unelectrified villages. The initiative includes solar-powered mini-grids for remote areas and smart metering for efficient power distribution.",
        status: "Completed",
        timeline: "Completed: November 2024",
        contact: "APEPDCL Rural Division: +91-866-XXXXXXX",
        source: "Andhra Pradesh Energy Department",
        url: "https://apedpcl.gov.in/rural-electricity"
      },
      {
        id: "swachh_bharat_2",
        title: "Swachh Bharat Mission 2.0",
        date: "2024-11-15",
        priority: "medium",
        location: "All India",
        summary: "Union Government extends Swachh Bharat Mission with focus on sustainability and waste management.",
        details: "Phase 2 emphasizes solid waste management, plastic waste reduction, and sustainable sanitation practices. The mission includes construction of 10 lakh household toilets, 5 lakh community toilets, and establishment of 1,500 waste processing facilities across India.",
        status: "Active",
        timeline: "2024-2029",
        contact: "Swachh Bharat Mission: +91-11-XXXXXXXX",
        source: "Ministry of Jal Shakti",
        url: "https://swachhbharatmission.gov.in"
      },
      {
        id: "ayushman_bharat",
        title: "Ayushman Bharat Health Infrastructure Mission",
        date: "2024-11-10",
        priority: "high",
        location: "All India",
        summary: "Government launches ₹64,000 crore health infrastructure mission to strengthen primary healthcare.",
        details: "The mission aims to establish 3 lakh health and wellness centers across India, upgrade district hospitals, and create a network of medical colleges. Focus areas include telemedicine, digital health records, and preventive healthcare initiatives.",
        status: "Active",
        timeline: "2024-2027",
        contact: "Ministry of Health: +91-11-XXXXXXXX",
        source: "Ministry of Health & Family Welfare",
        url: "https://ab-hwc.gov.in"
      },
      {
        id: "pm_gati_shakti",
        title: "PM Gati Shakti - National Infrastructure Pipeline",
        date: "2024-11-05",
        priority: "high",
        location: "All India",
        summary: "Multi-modal connectivity infrastructure project to boost economic growth.",
        details: "The project integrates road, rail, air, water, and digital connectivity infrastructure. Phase 2 focuses on completing 2,000 km of expressways, 1,500 km of railway lines, and establishing 100 new airports across India.",
        status: "In Progress",
        timeline: "2024-2030",
        contact: "PM Gati Shakti Mission: +91-11-XXXXXXXX",
        source: "Ministry of Home Affairs",
        url: "https://gati-shakti.gov.in"
      },
      {
        id: "skill_india_mission",
        title: "Skill India Mission - Phase 3",
        date: "2024-10-25",
        priority: "medium",
        location: "All India",
        summary: "Launch of Phase 3 of Skill India mission targeting 5 crore youth by 2025.",
        details: "The mission focuses on industry-relevant skill training in emerging sectors like AI, renewable energy, and digital technologies. Includes establishment of 1,000 new skill development centers and partnerships with 500+ companies for apprenticeship programs.",
        status: "Active",
        timeline: "2024-2025",
        contact: "Skill India Helpline: 1800-XXX-XXXX",
        source: "Ministry of Skill Development",
        url: "https://skillindia.gov.in"
      },
      {
        id: "green_hydrogen_mission",
        title: "National Green Hydrogen Mission",
        date: "2024-10-15",
        priority: "high",
        location: "All India",
        summary: "Government announces ₹19,700 crore mission to establish green hydrogen production capacity.",
        details: "The mission aims to produce 5 million tonnes of green hydrogen annually by 2030. Includes establishment of 5 green hydrogen hubs, development of electrolyser manufacturing capacity, and creation of 1 lakh jobs in the green energy sector.",
        status: "Planning",
        timeline: "2024-2030",
        contact: "Ministry of New & Renewable Energy: +91-11-XXXXXXXX",
        source: "Ministry of New & Renewable Energy",
        url: "https://mnre.gov.in/green-hydrogen"
      }
    ]
  },
  issue_resolutions: {
    title: "Issue Resolutions",
    icon: "✅",
    color: "#10b981",
    description: "Get notified when your reported issues are resolved by authorities",
    lastUpdated: "2024-11-29",
    availableDateRange: {
      earliest: "2024-10-15",
      latest: "2024-11-29",
      totalDays: 45
    },
    availableOptions: ["Last 7 Days", "Last 30 Days", "Last 45 Days", "Custom Range"],
    updates: [
      {
        id: "pothole_mg_road_resolved",
        title: "MG Road Potholes Repaired",
        date: "2024-11-29",
        priority: "high",
        location: "MG Road, Vijayawada",
        summary: "Potholes reported by citizens on MG Road have been completely repaired.",
        details: "Following multiple citizen reports through CitizensConnect, the Vijayawada Municipal Corporation deployed repair crews within 48 hours. The work involved resurfacing 2.5 km of road stretch and implementing permanent asphalt solutions. Traffic flow has improved by 40% in the area.",
        status: "Resolved",
        timeline: "Reported: Nov 20 → Resolved: Nov 29",
        contact: "VMC Engineering Division: +91-866-XXXXXXX",
        source: "Vijayawada Municipal Corporation",
        resolution: "Complete repair and resurfacing",
        citizen_impact: "Improved road safety and reduced vehicle damage"
      },
      {
        id: "street_light_park_street_fixed",
        title: "Park Street Lighting Restored",
        date: "2024-11-28",
        priority: "medium",
        location: "Park Street, Vijayawada",
        summary: "Non-functional street lights replaced and electrical system upgraded.",
        details: "The street lighting issue reported through CitizensConnect has been resolved. Faulty LED lights were replaced with energy-efficient solar-powered alternatives. The entire electrical network was upgraded to prevent future failures. Safety has improved significantly in the residential area.",
        status: "Resolved",
        timeline: "Reported: Nov 15 → Resolved: Nov 28",
        contact: "APEPDCL Street Lighting: +91-866-XXXXXXX",
        source: "Andhra Pradesh State Electricity Board",
        resolution: "Complete replacement with solar LED lights",
        citizen_impact: "Enhanced night-time safety and reduced energy costs"
      },
      {
        id: "garbage_sector7_resolved",
        title: "Sector 7 Waste Collection Regularized",
        date: "2024-11-26",
        priority: "high",
        location: "Sector 7, Vijayawada",
        summary: "Municipal corporation has regularized waste collection services in Sector 7.",
        details: "Following citizen complaints about irregular waste collection, the municipal corporation has deployed additional collection vehicles and increased frequency to daily pickups. Smart bins with fill-level sensors have been installed to optimize collection routes and reduce overflow incidents.",
        status: "Resolved",
        timeline: "Reported: Nov 10 → Resolved: Nov 26",
        contact: "VMC Sanitation Department: +91-866-XXXXXXX",
        source: "Vijayawada Municipal Corporation",
        resolution: "Daily collection schedule implemented with smart monitoring",
        citizen_impact: "Cleaner environment and improved public health"
      },
      {
        id: "water_supply_benz_circle",
        title: "Water Supply Issue at Benz Circle",
        date: "2024-11-25",
        priority: "urgent",
        location: "Benz Circle, Vijayawada",
        summary: "Low pressure water supply issue has been addressed with pipeline repairs.",
        details: "The water supply problem reported by multiple citizens has been resolved through emergency pipeline repairs. The issue was caused by a damaged main pipeline that was replaced during overnight maintenance. Water pressure has been restored to normal levels across the affected area.",
        status: "Resolved",
        timeline: "Reported: Nov 22 → Resolved: Nov 25",
        contact: "VWWS Water Supply: +91-866-XXXXXXX",
        source: "Vijayawada Water Works & Sewerage",
        resolution: "Pipeline repair and pressure restoration",
        citizen_impact: "Normal water supply restored to 500+ households"
      },
      {
        id: "traffic_signal_madurawada",
        title: "Traffic Signal Malfunction Fixed",
        date: "2024-11-22",
        priority: "high",
        location: "Madurawada Junction, Visakhapatnam",
        summary: "Traffic signal at Madurawada junction has been repaired and synchronized.",
        details: "The malfunctioning traffic signal that caused multiple accidents has been completely repaired. New LED signals with backup power systems have been installed. Signal timing has been optimized to reduce congestion during peak hours.",
        status: "Resolved",
        timeline: "Reported: Nov 18 → Resolved: Nov 22",
        contact: "Traffic Police Control: 100",
        source: "Visakhapatnam Traffic Police",
        resolution: "Complete signal replacement and synchronization",
        citizen_impact: "Reduced accidents and improved traffic flow"
      },
      {
        id: "sewage_overflow_kakinada",
        title: "Sewage Overflow in Kakinada Resolved",
        date: "2024-11-20",
        priority: "urgent",
        location: "Temple Street, Kakinada",
        summary: "Emergency sewage overflow issue has been completely resolved.",
        details: "The sewage overflow caused by blocked drainage lines has been cleared. Emergency repair crews worked overnight to replace damaged pipes and install new drainage grates. The area has been sanitized and monitored for 48 hours post-repair.",
        status: "Resolved",
        timeline: "Reported: Nov 19 → Resolved: Nov 20",
        contact: "Kakinada Municipality: +91-884-XXXXXXX",
        source: "Kakinada Municipal Corporation",
        resolution: "Drainage system repair and sanitization",
        citizen_impact: "Restored hygiene and prevented health hazards"
      },
      {
        id: "power_outage_guntur",
        title: "Power Outage in Guntur Rural Areas",
        date: "2024-11-18",
        priority: "high",
        location: "Rural Guntur District",
        summary: "Power supply restored to 15 villages after transformer repair.",
        details: "The power outage affecting 15 villages was caused by a damaged transformer. Emergency repair teams replaced the faulty transformer and upgraded the distribution lines. Backup power systems have been installed to prevent future outages.",
        status: "Resolved",
        timeline: "Reported: Nov 16 → Resolved: Nov 18",
        contact: "APEPDCL Rural Division: +91-863-XXXXXXX",
        source: "Andhra Pradesh State Electricity Board",
        resolution: "Transformer replacement and line upgrades",
        citizen_impact: "Power restored to 25,000+ residents"
      },
      {
        id: "illegal_parking_enforcement",
        title: "Illegal Parking Crackdown in Tirupati",
        date: "2024-11-15",
        priority: "medium",
        location: "Temple Road, Tirupati",
        summary: "Traffic police successfully cleared illegal parking causing congestion.",
        details: "Following multiple complaints about illegal parking blocking Temple Road, traffic police conducted a special enforcement drive. Over 50 vehicles were towed and 200+ parking tickets issued. Designated parking zones have been marked with clear signage.",
        status: "Resolved",
        timeline: "Reported: Nov 10 → Resolved: Nov 15",
        contact: "Tirupati Traffic Police: 100",
        source: "Tirupati Traffic Police Department",
        resolution: "Enforcement action and parking zone designation",
        citizen_impact: "Improved traffic flow and pedestrian safety"
      }
    ]
  },
  community_events: {
    title: "Community Events",
    icon: "🎉",
    color: "#f59e0b",
    description: "Stay updated on local events, meetings, and community gatherings",
    lastUpdated: "2024-12-05",
    availableDateRange: {
      earliest: "2024-10-20",
      latest: "2024-12-15",
      totalDays: 56
    },
    availableOptions: ["Last 7 Days", "Last 30 Days", "Last 60 Days", "Custom Range", "Upcoming Events"],
    updates: [
      {
        id: "citizen_awareness_workshop",
        title: "Digital Literacy Workshop for Seniors",
        date: "2024-12-01",
        priority: "medium",
        location: "Community Hall, Vijayawada",
        summary: "Free digital literacy workshop for senior citizens aged 60+.",
        details: "The Vijayawada Municipal Corporation is organizing a comprehensive digital literacy program for senior citizens. The workshop will cover smartphone usage, online banking, government app navigation, and cyber safety awareness. Refreshments and study materials will be provided free of cost.",
        status: "Upcoming",
        timeline: "Date: December 1, 2024 | Time: 10:00 AM - 4:00 PM",
        contact: "VMC Community Services: +91-866-XXXXXXX",
        source: "Vijayawada Municipal Corporation",
        registration: "Walk-in registration available",
        capacity: "100 participants",
        highlights: ["Free training", "Certified completion", "Follow-up support"]
      },
      {
        id: "environmental_awareness",
        title: "World Environment Day Celebration",
        date: "2024-11-30",
        priority: "medium",
        location: "Indira Gandhi Municipal Stadium, Vijayawada",
        summary: "Massive tree plantation drive and environmental awareness program.",
        details: "Celebrate World Environment Day with a community tree plantation drive. The event includes environmental awareness sessions, eco-friendly competitions, and distribution of 1,000 saplings to participating families. Local environmentalists and government officials will participate.",
        status: "Upcoming",
        timeline: "Date: November 30, 2024 | Time: 8:00 AM - 12:00 PM",
        contact: "Environment Department: +91-866-XXXXXXX",
        source: "Andhra Pradesh Environment Department",
        activities: ["Tree plantation", "Awareness sessions", "Eco-competitions"],
        expected_participants: "2,000+ citizens"
      },
      {
        id: "health_camp_rural",
        title: "Free Health Camp in Rural Areas",
        date: "2024-12-02",
        priority: "high",
        location: "Primary Health Center, Ibrahimpatnam",
        summary: "Comprehensive health checkup camp for rural communities.",
        details: "The Andhra Pradesh Health Department is organizing a mega health camp in rural areas. Services include general health checkups, blood pressure monitoring, diabetes screening, dental care, and eye testing. Specialist doctors from various fields will be available. Free medicines will be distributed.",
        status: "Upcoming",
        timeline: "Date: December 2, 2024 | Time: 9:00 AM - 5:00 PM",
        contact: "Health Department: +91-866-XXXXXXX",
        source: "Andhra Pradesh Health Department",
        services: ["General checkup", "Blood tests", "Dental care", "Eye testing", "Free medicines"],
        target_audience: "Rural communities within 50km radius"
      },
      {
        id: "citizen_police_meet",
        title: "Citizens-Police Interface Meeting",
        date: "2024-12-05",
        priority: "medium",
        location: "Police Headquarters, Vijayawada",
        summary: "Monthly citizens-police interaction to discuss community safety and concerns.",
        details: "The Vijayawada Police Department organizes monthly interface meetings with citizens to discuss safety concerns, crime prevention, and community policing initiatives. Local residents can voice their concerns directly to police officials and get updates on ongoing safety measures.",
        status: "Upcoming",
        timeline: "Date: December 5, 2024 | Time: 6:00 PM - 8:00 PM",
        contact: "Police Control Room: 100",
        source: "Vijayawada Police Department",
        agenda: ["Crime statistics review", "Safety measures update", "Citizen concerns discussion"],
        registration_required: true
      },
      {
        id: "yoga_day_celebration",
        title: "International Yoga Day Celebration",
        date: "2024-11-25",
        priority: "medium",
        location: "Ladies Club Ground, Vijayawada",
        summary: "Community yoga session and wellness workshop to celebrate International Yoga Day.",
        details: "Join the community celebration of International Yoga Day with certified yoga instructors. The event includes morning yoga sessions, meditation workshops, and wellness consultations. Free yoga mats and refreshments will be provided.",
        status: "Completed",
        timeline: "Date: November 25, 2024 | Time: 6:00 AM - 10:00 AM",
        contact: "Health & Wellness Department: +91-866-XXXXXXX",
        source: "Vijayawada Municipal Corporation",
        activities: ["Yoga sessions", "Meditation", "Wellness consultations"],
        participants: "500+ citizens"
      },
      {
        id: "blood_donation_camp",
        title: "Mega Blood Donation Camp",
        date: "2024-11-20",
        priority: "high",
        location: "District Hospital, Guntur",
        summary: "Emergency blood donation camp organized in response to recent accidents.",
        details: "Following multiple road accidents in the region, a mega blood donation camp was organized. Over 300 donors participated, collecting 250+ units of blood. The camp included health checkups and blood group identification for all participants.",
        status: "Completed",
        timeline: "Date: November 20, 2024 | Time: 9:00 AM - 5:00 PM",
        contact: "District Hospital: +91-863-XXXXXXX",
        source: "Guntur District Administration",
        impact: "250+ blood units collected",
        donors: "300+ participants"
      },
      {
        id: "cultural_festival",
        title: "Diwali Cultural Festival",
        date: "2024-11-15",
        priority: "medium",
        location: "Victoria Jubilee Museum, Vijayawada",
        summary: "Traditional Diwali celebrations with cultural performances and community feast.",
        details: "The Diwali festival featured traditional dance performances, music concerts, and a community feast. Cultural programs showcased local art forms, folk dances, and traditional crafts. Free meals were served to 1,000+ attendees.",
        status: "Completed",
        timeline: "Date: November 15, 2024 | Time: 5:00 PM - 10:00 PM",
        contact: "Cultural Department: +91-866-XXXXXXX",
        source: "Andhra Pradesh Tourism & Culture",
        highlights: ["Traditional dances", "Music concerts", "Community feast"],
        attendees: "1,000+ citizens"
      },
      {
        id: "career_guidance_seminar",
        title: "Youth Career Guidance Seminar",
        date: "2024-11-10",
        priority: "medium",
        location: "JNTU College Auditorium, Kakinada",
        summary: "Career guidance session for college students with industry experts.",
        details: "Industry leaders and education experts provided guidance on career opportunities in emerging fields. Topics included AI/ML careers, renewable energy jobs, digital marketing, and entrepreneurship. Interactive Q&A sessions and resume workshops were conducted.",
        status: "Completed",
        timeline: "Date: November 10, 2024 | Time: 10:00 AM - 4:00 PM",
        contact: "College Administration: +91-884-XXXXXXX",
        source: "JNTU Kakinada",
        topics: ["AI/ML careers", "Renewable energy", "Digital marketing", "Entrepreneurship"],
        participants: "400+ students"
      },
      {
        id: "women_empowerment_workshop",
        title: "Women Empowerment Workshop",
        date: "2024-12-08",
        priority: "medium",
        location: "Women Development Center, Visakhapatnam",
        summary: "Skill development and empowerment workshop for women entrepreneurs.",
        details: "A comprehensive workshop focusing on business skills, financial literacy, and digital marketing for women. Sessions include practical training on starting online businesses, social media marketing, and accessing government schemes for women entrepreneurs.",
        status: "Upcoming",
        timeline: "Date: December 8, 2024 | Time: 9:00 AM - 5:00 PM",
        contact: "Women Development Center: +91-891-XXXXXXX",
        source: "Andhra Pradesh Women & Child Welfare",
        focus_areas: ["Business skills", "Financial literacy", "Digital marketing"],
        target_group: "Women entrepreneurs and aspiring businesswomen"
      },
      {
        id: "sports_tournament",
        title: "Inter-Colony Sports Tournament",
        date: "2024-12-12",
        priority: "medium",
        location: "Municipal Sports Complex, Tirupati",
        summary: "Annual sports tournament promoting community health and fitness.",
        details: "The tournament features cricket, volleyball, and athletics events for different age groups. Teams from various colonies participate in friendly competitions. Medals, certificates, and refreshments will be provided to all participants.",
        status: "Upcoming",
        timeline: "Date: December 12-14, 2024",
        contact: "Sports Department: +91-877-XXXXXXX",
        source: "Tirupati Municipal Corporation",
        sports: ["Cricket", "Volleyball", "Athletics"],
        categories: ["Under-14", "Under-18", "Adults", "Seniors"]
      }
    ]
  },
  website_updates: {
    title: "Website Updates",
    icon: "🚀",
    color: "#dc2626",
    description: "Stay informed about new features, improvements, and platform enhancements",
    lastUpdated: "2024-11-29",
    availableDateRange: {
      earliest: "2024-10-01",
      latest: "2024-11-29",
      totalDays: 59
    },
    availableOptions: ["Last 7 Days", "Last 30 Days", "Last 60 Days", "Custom Range", "Feature Updates"],
    updates: [
      {
        id: "online_issues_feature",
        title: "Online Issues Collection System",
        date: "2024-11-29",
        priority: "high",
        location: "CitizensConnect Platform",
        summary: "New feature added to collect and display issues from online news sources and government updates.",
        details: "CitizensConnect now automatically collects civic issues from news APIs, government RSS feeds, and social media reports. The system categorizes issues by priority and location, providing citizens with comprehensive information about ongoing civic matters. Issues are updated daily and include resolution tracking.",
        status: "Live",
        timeline: "Launched: November 29, 2024",
        contact: "Support Team: support@citizensconnect.in",
        source: "CitizensConnect Development Team",
        features: ["Daily updates", "Priority categorization", "Source attribution", "Resolution tracking"],
        impact: "Enhanced transparency and citizen awareness"
      },
      {
        id: "indian_political_info",
        title: "Comprehensive Indian Political Information",
        date: "2024-11-29",
        priority: "high",
        location: "CitizensConnect Platform",
        summary: "Complete political representatives database for all Indian states and union territories.",
        details: "The Representatives section now includes comprehensive information about all Indian political leaders, from national figures to state governments. Features include searchable state information, ruling and opposition parties, political alliances, and direct links to official profiles.",
        status: "Live",
        timeline: "Launched: November 29, 2024",
        contact: "Support Team: support@citizensconnect.in",
        source: "CitizensConnect Development Team",
        coverage: ["28 States", "8 Union Territories", "6 Major Parties", "National Leaders"],
        features: ["Advanced search", "Alliance filtering", "Real-time updates"]
      },
      {
        id: "mobile_optimization",
        title: "Mobile App Optimization",
        date: "2024-11-25",
        priority: "medium",
        location: "CitizensConnect Platform",
        summary: "Enhanced mobile experience with improved responsiveness and touch controls.",
        details: "The CitizensConnect platform has been fully optimized for mobile devices. Improvements include faster loading times, improved touch interactions, offline capability for issue reporting, and enhanced accessibility features for users with disabilities.",
        status: "Live",
        timeline: "Released: November 25, 2024",
        contact: "Mobile Support: mobile@citizensconnect.in",
        source: "CitizensConnect Development Team",
        improvements: ["50% faster loading", "Offline reporting", "Voice-to-text", "Screen reader support"],
        compatibility: "Android 8.0+, iOS 12.0+"
      },
      {
        id: "notification_system",
        title: "Smart Notification System",
        date: "2024-11-20",
        priority: "medium",
        location: "CitizensConnect Platform",
        summary: "Intelligent notification system for personalized updates and alerts.",
        details: "Users can now receive personalized notifications about issues in their locality, government initiatives in their area, and updates on their reported issues. The system uses location-based intelligence and user preferences to deliver relevant information.",
        status: "Live",
        timeline: "Released: November 20, 2024",
        contact: "Notifications: alerts@citizensconnect.in",
        source: "CitizensConnect Development Team",
        features: ["Location-based alerts", "Issue status updates", "Emergency notifications", "Customizable preferences"],
        privacy: "GDPR compliant with user consent"
      },
      {
        id: "date_filtering_updates",
        title: "Advanced Date Filtering System",
        date: "2024-11-29",
        priority: "medium",
        location: "CitizensConnect Platform",
        summary: "New date filtering functionality allows users to view updates from specific time periods.",
        details: "The Updates section now includes comprehensive date filtering with preset options (Last 7, 30, 60, 90 days) and custom date range selection. Users can filter updates by specific time periods to find relevant information quickly.",
        status: "Live",
        timeline: "Launched: November 29, 2024",
        contact: "Support Team: support@citizensconnect.in",
        source: "CitizensConnect Development Team",
        features: ["Date range filtering", "Preset time periods", "Custom date selection", "Category-specific date ranges"],
        user_benefit: "Easier access to time-specific information"
      },
      {
        id: "enhanced_comment_system",
        title: "Enhanced Comment and Like System",
        date: "2024-11-29",
        priority: "medium",
        location: "CitizensConnect Platform",
        summary: "Improved comment system with like functionality and better user interaction.",
        details: "Comments now support liking, with visual indicators for user engagement. Users can see their own comments highlighted, track likes on comments, and enjoy improved discussion experience with better visual hierarchy and interaction feedback.",
        status: "Live",
        timeline: "Launched: November 29, 2024",
        contact: "Support Team: support@citizensconnect.in",
        source: "CitizensConnect Development Team",
        features: ["Comment liking", "User comment highlighting", "Like counters", "Enhanced visual design"],
        improvement: "Better community engagement and interaction"
      },
      {
        id: "accessibility_improvements",
        title: "Accessibility and Performance Updates",
        date: "2024-11-15",
        priority: "medium",
        location: "CitizensConnect Platform",
        summary: "Major accessibility improvements and performance optimizations implemented.",
        details: "Enhanced accessibility features including better screen reader support, improved keyboard navigation, and WCAG 2.1 AA compliance. Performance optimizations include lazy loading, code splitting, and faster API responses.",
        status: "Live",
        timeline: "Released: November 15, 2024",
        contact: "Accessibility Team: accessibility@citizensconnect.in",
        source: "CitizensConnect Development Team",
        improvements: ["WCAG 2.1 AA compliance", "Screen reader support", "Keyboard navigation", "Performance optimization"],
        impact: "Improved accessibility for all users"
      },
      {
        id: "data_security_updates",
        title: "Enhanced Data Security and Privacy",
        date: "2024-11-10",
        priority: "high",
        location: "CitizensConnect Platform",
        summary: "Major security enhancements and privacy policy updates implemented.",
        details: "Implemented end-to-end encryption for user data, enhanced authentication systems, and updated privacy policies. New GDPR compliance features include data export/deletion options and improved consent management.",
        status: "Live",
        timeline: "Released: November 10, 2024",
        contact: "Security Team: security@citizensconnect.in",
        source: "CitizensConnect Development Team",
        security_features: ["End-to-end encryption", "Enhanced authentication", "GDPR compliance", "Data export options"],
        privacy: "Complete user data protection and control"
      },
      {
        id: "api_integration_expansion",
        title: "Expanded Government API Integration",
        date: "2024-10-25",
        priority: "medium",
        location: "CitizensConnect Platform",
        summary: "Integration with additional government APIs for comprehensive service delivery.",
        details: "Added integration with multiple government service APIs including DigiLocker, UMANG, and state-specific services. Users can now access government certificates, apply for services, and track applications directly through the platform.",
        status: "Live",
        timeline: "Released: October 25, 2024",
        contact: "Integration Team: integration@citizensconnect.in",
        source: "CitizensConnect Development Team",
        integrations: ["DigiLocker", "UMANG platform", "State government APIs", "Document services"],
        benefit: "One-stop access to government services"
      },
      {
        id: "multilingual_support",
        title: "Multi-language Support Launch",
        date: "2024-10-15",
        priority: "medium",
        location: "CitizensConnect Platform",
        summary: "Platform now supports multiple Indian languages for better accessibility.",
        details: "Added support for 12 Indian languages including Hindi, Telugu, Tamil, Bengali, Marathi, Gujarati, Kannada, Malayalam, Odia, Punjabi, Assamese, and Urdu. Users can switch languages and receive localized content and notifications.",
        status: "Live",
        timeline: "Released: October 15, 2024",
        contact: "Localization Team: localization@citizensconnect.in",
        source: "CitizensConnect Development Team",
        languages: ["Hindi", "Telugu", "Tamil", "Bengali", "Marathi", "Gujarati", "Kannada", "Malayalam", "Odia", "Punjabi", "Assamese", "Urdu"],
        reach: "Improved accessibility for 95% of Indian population"
      }
    ]
  }
};

// Helper functions
export const getUpdatesByCategory = (categoryKey) => {
  return updatesCategories[categoryKey]?.updates || [];
};

export const getRecentUpdates = (limit = 10) => {
  const allUpdates = Object.values(updatesCategories).flatMap(cat =>
    cat.updates.map(update => ({ ...update, category: cat.title, categoryKey: Object.keys(updatesCategories).find(key => updatesCategories[key] === cat) }))
  );

  return allUpdates
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
};

export const getUpdatesByPriority = (priority) => {
  const allUpdates = Object.values(updatesCategories).flatMap(cat => cat.updates);
  return allUpdates.filter(update => update.priority === priority);
};

export const getUpdatesByLocation = (location) => {
  const allUpdates = Object.values(updatesCategories).flatMap(cat => cat.updates);
  return allUpdates.filter(update =>
    update.location.toLowerCase().includes(location.toLowerCase())
  );
};

export const getCategoryStats = () => {
  return Object.entries(updatesCategories).map(([key, category]) => ({
    key,
    title: category.title,
    icon: category.icon,
    color: category.color,
    updateCount: category.updates.length,
    recentUpdate: category.updates[0]?.date || null
  }));
};
