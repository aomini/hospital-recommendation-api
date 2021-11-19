const fields = [
  {
    section: "General",
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
        type: "text",
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
    items: [
      {
        title: "ECG",
        code: "ecg",
        type: "radio",
        single: true,
      },
      {
        title: "ECHO",
        code: "echo",
        type: "radio",
        single: true,
      },
      {
        title: "EMG",
        code: "emg",
        type: "radio",
        single: true,
      },
      {
        title: "Endoscopy",
        code: "endoscopy",
        type: "radio",
        single: true,
      },
    ],
  },
  {
    section: "Staff Details",
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
];
