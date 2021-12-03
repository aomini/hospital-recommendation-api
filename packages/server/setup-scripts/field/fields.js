const fields = [
  {
    section: "General",
    code: "general",
    items: [
      {
        title: "Name of Hospital",
        code: "name_of_hospital",
        type: "text",
      },
      {
        title: "Latitude",
        code: "latitude",
        type: "number",
      },
      {
        title: "Longitude",
        code: "longitude",
        type: "number",
      },
      {
        title: "Address",
        code: "address",
        type: "text",
      },
      {
        title: "Phone Number",
        code: "phone_number",
        type: "text",
        masking: "phone",
      },
      {
        title: "Website",
        code: "website",
        type: "text",
        masking: "website",
      },
      {
        title: "Key Highlights",
        code: "key_highlights",
        type: "textarea",
      },
      {
        title: "Owner Name",
        code: "owner_nam",
        type: "text",
      },
      {
        title: "Owner Background",
        code: "owner_background",
        type: "textarea",
      },
    ],
  },
  // Location & space
  {
    section: "Location and Space",
    code: "location_and_space",
    items: [
      {
        title: "Built up Area",
        code: "built_up_area",
        type: "text",
      },
      {
        title: "Open Space Area",
        code: "open_space_area",
        type: "text",
      },
      {
        title: "Availability of Public Transportation",
        code: "availability_of_public_transportation",
        type: "radio",
        single: true,
      },
      {
        title: "Easy access from all points of Valley",
        code: "easy_access_from_all_points_of_valley",
        type: "radio",
        single: true,
      },
      {
        title: "Traffic Congestion",
        code: "traffic_congestion",
        type: "radio",
        single: true,
      },
      {
        title: "Less Air Pollution",
        code: "less_air_pollution",
        type: "radio",
        single: true,
      },
      {
        title: "Less Noise Pollution",
        code: "less_noise_pollution",
        type: "radio",
        single: true,
      },
      {
        title: "Encouragement of Sustainable use of Resources",
        code: "encouragement_of_sustainable_use_of_resources",
        type: "radio",
        single: true,
      },
      {
        title: "Enough Car/Bike Parking",
        code: "enough_car_bike_parking",
        type: "radio",
        single: true,
      },
      {
        title: "Can be Accesed from Multiple Directions",
        code: "can_be_accessed_from_multiple_directions",
        type: "radio",
        single: true,
      },
      {
        title: "Cafeteria for Visitors",
        code: "cafeteria_for_visitors",
        type: "radio",
        single: true,
      },
      {
        title: "Waiting Room for Visitors",
        code: "Waiting_room_for_visitors",
        type: "radio",
        single: true,
      },
      {
        title: "Sufficient Waiting Area",
        code: "sufficient_waiting_area",
        type: "radio",
        single: true,
      },
      {
        title: "Distance from Thankot",
        code: "distance_from_thankot",
        type: "text",
        hasLatLng: true,
      },
      {
        title: "Distance from Koteshwor",
        code: "distance_from_koteshwor",
        type: "text",
        hasLatLng: true,
      },
      {
        title: "Distance from Sanga",
        code: "distance_from_sanga",
        type: "text",
        hasLatLng: true,
      },
      {
        title: "Distance from Airport",
        code: "distance_from_airport",
        type: "text",
        hasLatLng: true,
      },
    ],
  },
  {
    section: "Infrastructure and equipments",
    code: "infrastructure_and_equipments",
    items: [
      {
        title: "Number of Beds",
        code: "number_of_beds",
        type: "number",
      },
      {
        title: "Number of Hospital Rooms",
        code: "number_of_hospital_rooms",
        type: "number",
      },
      {
        title: "Number of Operating Theatre",
        code: "number_of_operating_theatre",
        type: "number",
      },
      {
        title: "Number of Ambulancess",
        code: "number_of_ambulances",
        type: "number",
      },
      {
        title: "Number of Ventilators",
        code: "number_of_ventilators",
        type: "number",
      },
      {
        title: "Number of special care beds",
        subtitle: "CCU, ICU, SICU, High Care, Observation, etc",
        code: "number_of_special_care_beds",
        type: "number",
      },
      {
        title: "Number of Private and VIP cabins",
        code: "number_of_private_vip_cabins",
        type: "number",
      },
    ],
  },
  {
    section: "Clinical Laboratory Equipments",
    code: "clinical_laboratory_equipments",
    /** parent section is for children */
    // parentSection: "Infrastructure and equipments",
    lookup_code: "clinical_laboratory_equipments",
    fromLookup: true,
    multiple: true,
    items: [
      {
        title: "Clinical Laboratory Equipments",
        code: "clinical_laboratory_equipments_field",
        type: "text",
      },
    ],
  },
  {
    section: "Staff Details",
    code: "staff_details",
    items: [
      {
        title: "Number of Doctors",
        code: "number_of_doctors",
        type: "number",
      },
      {
        title: "Number of Nurses",
        code: "number_of_nurses",
        type: "number",
      },
      {
        title: "Number of Assistants",
        code: "number_of_assistants",
        type: "number",
      },
    ],
  },
  {
    section: "Capacity Utilization",
    code: "capacity_utilization",
    items: [
      {
        title: "Number of Out Patients",
        code: "number_of_out_patients",
        type: "number",
      },
      {
        title: "Number of In Patients",
        code: "number_of_in_patients",
        type: "number",
      },
      {
        title: "Number of recurring Patients",
        code: "number_of_recurring_patients",
        type: "number",
      },
    ],
  },
  {
    section: "System and Process",
    code: "system_and_process",
    items: [
      {
        title: "Easy Appointment Booking Over Internet",
        code: "easy_appointment_booking_over_internet",
        type: "radio",
        single: true,
      },
      {
        title: "Mobile App",
        code: "mobile_app",
        type: "radio",
        single: true,
      },
      {
        title: "Public Noticeboard and Easy to Navigate Directions",
        code: "public_noticeboard_and_easy_to_navigate_directions",
        type: "radio",
        single: true,
      },
      {
        title: "International Relations Desk",
        code: "internation_relation_desk",
        type: "radio",
        single: true,
      },
      {
        title: "Enough Consulting Time with Doctors",
        code: "enough_consulting_time_with_doctors",
        type: "radio",
        single: true,
      },
      {
        title: "Implementation of EMR",
        code: "implementation_of_emr",
        type: "radio",
        single: true,
      },
      {
        title: "Telemedine Facility for Remote patients",
        code: "telemedine_facility_for_remote_patients",
        type: "radio",
        single: true,
      },
      {
        title: "Food Catering services to patients",
        code: "food_catering_services_to_patients",
        type: "radio",
        single: true,
      },
      {
        title: "Laundry services to patients",
        code: "laundry_services_to_patients",
        type: "radio",
        single: true,
      },
      {
        title: "24/7 in house specialists",
        code: "247_in_house_specialists",
        type: "radio",
        single: true,
      },
      {
        title: "Availability of treatment packages for IPD",
        code: "availability_of_treatment_packages_for_ipd",
        type: "radio",
        single: true,
      },
      {
        title: "Average Time Taken for Discharge",
        code: "average_time_take_for_discharge",
        type: "text",
      },
      {
        title: "Average Length of Stay",
        code: "average_length_of_stay",
        type: "text",
      },
      {
        title: "Mortality rate",
        subtitle: "%",
        code: "mortality_rate",
        type: "number",
      },
      {
        title: "Patient Safety Guidelines and Goals",
        code: "patient_safety_guidelines_and_goals",
        type: "textarea",
      },
      {
        title: "Patient Family Education",
        code: "patient_family_education",
        type: "radio",
        single: true,
      },
    ],
  },
  {
    section: "Key specialists",
    code: "key_specialists",
    multiple: true,
    composite: true,
    items: [
      {
        title: "Doctor Name",
        code: "doctor_name",
        type: "text",
      },
      {
        title: "Availability",
        code: "doctor_availability",
        type: "text",
      },
      {
        title: "Key Specialization",
        code: "key_specialization",
        type: "text",
      },
    ],
  },
  {
    section: "Clinical Departments",
    code: "clinical_departments",
    lookup_code: "clinical_departments",
    fromLookup: true,
    multiple: true,
    items: [
      {
        title: "Clinical Departments",
        code: "clinical_departments_field",
        type: "text",
      },
    ],
  },
  {
    section: "Other Facilities",
    code: "other_facilities",
    items: [
      {
        title: "Number of Pharmacies Inside Hospital",
        code: "number_of_pharmacies_inside_hospital",
        type: "number",
      },
      {
        title: "Number of Discounted Pharmacies",
        code: "number_of_discounted_pharmacies",
        type: "number",
      },
      {
        title: "Number of Pharmacies within 200m radius",
        code: "number_of_pharmacies_within_200m_radius",
        type: "number",
      },
      {
        title: "ATM machines within 200m radius",
        subtitle: "from Gate",
        code: "atm_machines_with_200m_radius",
        type: "number",
      },
      {
        title: "Restaurants / Convenience Store Nearby",
        subtitle: "100m Radius",
        code: "restaurants_with_100m_radius",
        type: "number",
      },
    ],
  },
  {
    section: "Franchise & Branches",
    code: "franchise_and_branches",
    items: [
      {
        title: "Franchise to 3rd party",
        code: "franchise_to_3rd_party",
        type: "radio",
        single3: true,
      },
      {
        title: "Number of Branches/Franchies",
        code: "number_of_branches_or_franchies",
        type: "number",
      },
      {
        title: "Number of Checkup Clinics",
        code: "number_of_checkup_clinics",
        type: "number",
      },
      {
        title: "Number of Official Branches",
        code: "number_of_official_branches",
        type: "number",
      },
    ],
  },
  {
    section: "User Reviews",
    code: "user_reviews",
    invisible: true,
  },
  {
    section: "Miscellaneous",
    code: "miscellaneous",
    items: [
      {
        title: "Buildings 1KM Radius",
        code: "buildings_1km_radius",
        type: "number",
      },
      {
        title: "Buildings 3KM Radius",
        code: "buildings_3km_radius",
        type: "number",
      },
      {
        title: "Buildings 5KM Radius",
        code: "buildings_5km_radius",
        type: "number",
      },
      {
        title: "Traffic data",
        code: "traffic_data",
        type: "number",
        invisible: true,
      },
      {
        title: "Space for Growth and Expansion",
        code: "space_for_growth_and_expansion",
        type: "radio",
        single: true,
      },
      {
        title: "Helipad",
        code: "helipad",
        type: "radio",
        single: true,
      },
      {
        title: "Doctor on Call",
        code: "doctor_on_call",
        type: "radio",
        single: true,
      },
      {
        title: "Home care counselling",
        code: "home_care_counselling",
        type: "radio",
        single: true,
      },
      {
        title: "AI and Future Ready Health",
        code: "ai_and_future_ready_health",
        type: "radio",
        single: true,
      },
      {
        title: "Sanitation and Cleanliness",
        code: "sanitization_and_cleanliness",
        type: "radio",
        single: true,
      },
    ],
  },
  {
    section: "Environmental impacts",
    code: "environmental_impacts",
    items: [
      {
        title: "pollution",
        subtitle: "Risk of Pollution and Contaminated Land",
        code: "environmental_pollution",
        type: "radio",
        single: true,
      },
      {
        title: "Harm to Historical and Cultural Assets",
        code: "harm_to_historical_and_cultural_assets",
        type: "radio",
        single: true,
      },
      {
        title: "Remarks",
        subtitle: "Comments about the Impacts",
        code: "environmental_remarks",
        type: "textarea",
      },
    ],
  },
];
module.exports = fields;
