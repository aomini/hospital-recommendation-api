const { Lookup, LookupValue } = require("@hospital-api/server/models");

const getEquipments = async () => {
  const lookup = await Lookup.findOne({
    where: {
      code: "clinical_laboratory_equipments",
    },
  });
  const equipments = await LookupValue.findAll({
    where: {
      lookup_id: lookup.id,
    },
  });

  return equipments.map((x) => x.id);
};

const getDepartments = async () => {
  const lookup = await Lookup.findOne({
    where: {
      code: "clinical_laboratory_equipments",
    },
  });
  const equipments = await LookupValue.findAll({
    where: {
      lookup_id: lookup.id,
    },
  });

  return equipments.map((x) => x.id);
};

/** General */
const computeFakeData = async () => {
  return {
    key_highlights: [
      "Known for bones treatment",
      "Popular for management",
      "Big parking area",
      "Low cost better service",
      "Large number of beds, wards & private rooms",
      "More than enough ambulances",
    ],
    owner_nam: [
      "Ram Bahadar Karki",
      "Hari Shrestha",
      "Tika Ram Basnet",
      "Dinesh Prajapati",
      "Sita Pokhrel",
      "Ram Baran Timalsina",
      "Navraj Poudel",
    ],
    owner_background: [
      "Entrepreneur",
      "Businessman",
      "Doctor",
      "Return from foreign country",
      "Studied at Europe",
      "Graduated from USA",
    ],
    /** Location and space */
    built_up_area: [
      "120 sq.",
      "80 sq.",
      "140 sq.",
      "300 sq.",
      "170 sq.",
      "230 sq.",
      "93 sq.",
      "134 sq.",
      "121 sq.",
    ],
    open_space_area: [
      "20 sq.",
      "10 sq.",
      "40 sq.",
      "30 sq.",
      "17 sq.",
      "22 sq.",
      "12 sq.",
      "8 sq.",
      "16 sq.",
    ],
    availability_of_public_transportation: [true, false],
    easy_access_from_all_points_of_valley: [true, false],
    traffic_congestion: [true, false],
    less_air_pollution: [true, false],
    less_noise_pollution: [true, false],
    encouragement_of_sustainable_use_of_resources: [true, false],
    enough_car_bike_parking: [true, false],
    can_be_accessed_from_multiple_directions: [true, false],
    cafeteria_for_visitors: [true, false],
    Waiting_room_for_visitors: [true, false],
    sufficient_waiting_area: [true, false],
    /** Infrastructure and equipments */
    number_of_beds: [
      40, 50, 60, 70, 80, 90, 44, 52, 58, 68, 78, 80, 87, 92, 93, 95, 97, 98,
      110, 102, 104, 112, 77, 81, 82, 93, 94, 95, 96, 88, 89, 35, 36, 37, 38,
      39,
    ],
    number_of_hospital_rooms: [
      15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
      33, 34, 35, 36, 37, 38,
    ],
    number_of_operating_theatre: [4, 5, 6, 7, 8, 9, 10, 11],
    number_of_ambulances: [3, 4, 5, 6, 7, 8, 9, 10, 11],
    number_of_ventilators: [3, 4, 5, 6, 7, 8, 9, 10, 11],
    number_of_special_care_beds: [3, 4, 5, 6, 7],
    number_of_private_vip_cabins: [2, 3, 4, 5, 6, 7],

    /** Staff Details */
    number_of_doctors: [3, 4, 5, 6, 7, 8, 9, 10, 11],
    number_of_nurses: [
      15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
    ],
    number_of_assistants: [
      15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
    ],
    /** Capacity Utilization */
    number_of_out_patients: [
      40, 50, 60, 70, 80, 90, 44, 52, 58, 68, 78, 80, 87, 92, 93, 95, 97, 98,
      110, 102, 104, 112, 77, 81, 82, 93, 94, 95, 96, 88, 89, 35, 36, 37, 38,
      39,
    ],
    number_of_in_patients: [
      40, 50, 60, 70, 80, 90, 44, 52, 58, 68, 78, 80, 87, 92, 93, 95, 97, 98,
      110, 102, 104, 112, 77, 81, 82, 93, 94, 95, 96, 88, 89, 35, 36, 37, 38,
      39,
    ],
    number_of_recurring_patients: [
      40, 50, 60, 70, 80, 90, 44, 52, 58, 68, 78, 80, 87, 92, 93, 95, 97, 98,
      110, 102, 104, 112, 77, 81, 82, 93, 94, 95, 96, 88, 89, 35, 36, 37, 38,
      39,
    ],
    /** System and process */
    easy_appointment_booking_over_internet: [true, false],
    mobile_app: [true, false],
    public_noticeboard_and_easy_to_navigate_directions: [true, false],
    internation_relation_desk: [true, false],
    enough_consulting_time_with_doctors: [true, false],
    implementation_of_emr: [true, false],
    telemedine_facility_for_remote_patients: [true, false],
    food_catering_services_to_patients: [true, false],
    laundry_services_to_patients: [true, false],
    "247_in_house_specialists": [true, false],
    availability_of_treatment_packages_for_ipd: [true, false],
    average_time_take_for_discharge: [
      "20 min",
      "30 min",
      "40 min",
      "50 min",
      "1 hr",
      "1hr 10 min",
      "1hr 20 min",
      "2 hr",
    ],
    average_length_of_stay: [
      "1 day",
      "2 days",
      "3 days",
      "4 days",
      "5 days",
      "6 days",
      "1 week",
      "2 weeks",
      "3 weeks",
    ],
    mortality_rate: [3, 4, 5, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    patient_safety_guidelines_and_goals: [
      "Wear masks",
      "Constant sanitization",
      "Cleanliness",
      "Room fragnance",
      "Bathroom cleanliness five times a day",
      "Constant floor sweeping with phenoyl",
    ],
    patient_family_education: [true, false],
    /** key_specialists */
    /** Clinical Departments */
    clinical_laboratory_equipments_field: await getEquipments(),
    clinical_departments_field: await getDepartments(),
    /** Other Facilities */
    number_of_pharmacies_inside_hospital: [1, 2, 3, 4, 5],
    number_of_discounted_pharmacies: [1, 2, 3, 4, 5],
    number_of_pharmacies_within_200m_radius: [1, 2, 3, 4, 5],
    atm_machines_with_200m_radius: [1, 2, 3, 4, 5],
    restaurants_with_100m_radius: [1, 2, 3, 4, 5],
    /** Franchise and branches */
    franchise_to_3rd_party: [true, false],
    number_of_branches_or_franchies: [1, 2, 3, 4, 5, 6, 7],
    number_of_checkup_clinics: [1, 2, 3, 4, 5, 6, 7],
    number_of_official_branches: [1, 2, 3, 4, 5, 6, 7],
    /** Miscellaneous */
    buildings_1km_radius: [
      3000, 3214, 3100, 3200, 3300, 3400, 3500, 3550, 3600, 3700, 3800, 3900,
      4000,
    ],
    buildings_3km_radius: [
      4100, 4214, 4150, 4200, 4300, 4400, 4500, 4550, 4600, 4700, 4800, 4900,
      4000,
    ],
    buildings_5km_radius: [
      6100, 6214, 7150, 8200, 7300, 8400, 9500, 9550, 9600, 9700, 8800, 9900,
      10000,
    ],
    space_for_growth_and_expansion: [true, false],
    helipad: [true, false],
    doctor_on_call: [true, false],
    home_care_counselling: [true, false],
    ai_and_future_ready_health: [true, false],
    sanitization_and_cleanliness: [true, false],
    /** Environmenal impacts */
    environmental_pollution: [true, false],
    harm_to_historical_and_cultural_assets: [true, false],
  };
};

/** Generates fake data */
const getFakeValues = async () => {
  let data = {};
  const fakeData = await computeFakeData();
  for (let key in fakeData) {
    if (
      [
        "clinical_laboratory_equipments_field",
        "clinical_departments_field",
      ].includes(key)
    ) {
      const randomKey = Math.floor(Math.random() * fakeData[key].length) + 0;
      data[key] = [fakeData[key][randomKey]];
    } else {
      const randomKey = Math.floor(Math.random() * fakeData[key].length) + 0;
      data[key] = fakeData[key][randomKey];
    }
  }
  return data;
};

module.exports = getFakeValues;
