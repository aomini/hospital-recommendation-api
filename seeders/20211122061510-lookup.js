"use strict";
const { User, Lookup } = require("../models");

const clinicalLabEquipments = [
  "ECG",
  "ECHO",
  "EMG",
  "Endoscopy",
  "USG",
  "MRI",
  "CT Scan",
  "X-Ray",
  "USG",
];

const clinicalDepartments = [
  "Cancer Care",
  "Cardiac Sciences",
  "Diagnostic Medicine",
  "Digestive Diseases",
  "Emergency Medicine & Pre Hospital Care",
  "ENT-Head & Neck Surgery",
  "Internal Medicine, Endocrinology & Wellness",
  "Neurosciences",
  "Peri Operative Medicine",
  "Physiotherapy & Rehabilitation",
  "Renal Sciences",
  "Rheumatology and Clinical immunology",
  "Clinical Nutrition and Dietetics",
  "Critical Care",
  "Dentistry",
  "Dermatology",
  "General Surgery",
  "Gynecology and Obstetrics",
  "Laboratory Medicine & Pathology",
  "Neuro-psychiatry",
  "Ophthalmology",
  "Orthopedics and Joint Reconstruction",
  "Paediatrics and Neonatology",
  "Plastic Reconstructive and Cosmetic Surgery",
  "Pulmonology",
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const user = await User.findOne({ where: { username: "rootuser" } });
    const equipmentLookup = await Lookup.create({
      name: "clinical laboratory equipments",
      code: "clinical_laboratory_equipments",
      userc_id: user.id,
    });

    const departmentLookup = await Lookup.create({
      name: "clinical departments",
      code: "clinical_departments",
      userc_id: user.id,
    });

    const equipmentValues = clinicalLabEquipments.map((x) => ({
      label: x,
      value: x,
      lookup_id: equipmentLookup.id,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    const departmentValues = clinicalDepartments.map((x) => ({
      label: x,
      value: x,
      lookup_id: departmentLookup.id,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    await queryInterface.bulkInsert("lookup_values", [
      ...equipmentValues,
      ...departmentValues,
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
