import image1 from "../public/assets/images/dr-green.png";
import image2 from "../public/assets/images/dr-cameron.png";
import image3 from "../public/assets/images/dr-livingston.png";
import image4 from "../public/assets/images/dr-peter.png";
import image5 from "../public/assets/images/dr-powell.png";
import image6 from "../public/assets/images/dr-remirez.png";
import image7 from "../public/assets/images/dr-lee.png";
import image8 from "../public/assets/images/dr-cruz.png";
import image9 from "../public/assets/images/dr-sharma.png";

import scheduledIcon from "../public/assets/icons/check.svg";
import pendingIcon from "../public/assets/icons/pending.svg";
import cancelledIcon from "../public/assets/icons/cancelled.svg";

export const GenderOptions = ["male", "female", "other"];

export const PatientFormDefaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  birthDate: new Date(Date.now()),
  gender: "Male" as Gender,
  address: "",
  occupation: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  primaryPhysician: "",
  insuranceProvider: "",
  insurancePolicyNumber: "",
  allergies: "",
  currentMedication: "",
  familyMedicalHistory: "",
  pastMedicalHistory: "",
  identificationType: "Birth Certificate",
  identificationNumber: "",
  identificationDocument: [],
  treatmentConsent: false,
  disclosureConsent: false,
  privacyConsent: false,
};

export const IdentificationTypes = [
  "Birth Certificate",
  "Driver's License",
  "Medical Insurance Card/Policy",
  "Military ID Card",
  "National Identity Card",
  "Passport",
  "Resident Alien Card (Green Card)",
  "Social Security Card",
  "State ID Card",
  "Student ID Card",
  "Voter ID Card",
];

export const Doctors = [
  {
    image: image1,
    name: "John Green",
  },
  {
    image: image2,
    name: "Leila Cameron",
  },
  {
    image: image3,
    name: "David Livingston",
  },
  {
    image: image4,
    name: "Evan Peter",
  },
  {
    image: image5,
    name: "Jane Powell",
  },
  {
    image: image6,
    name: "Alex Ramirez",
  },
  {
    image: image7,
    name: "Jasmine Lee",
  },
  {
    image: image8,
    name: "Alyana Cruz",
  },
  {
    image: image9,
    name: "Hardik Sharma",
  },
];

export const StatusIcon = {
  APPROVED: scheduledIcon,
  SCHEDULED: pendingIcon,
  CANCELED: cancelledIcon,
};

export const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "India",
  "China",
  "Japan",
  "Brazil",
  "South Africa",
  "Mexico",
  "Italy",
  "Spain",
  "Russia",
  "Nigeria",
  // Add more countries as needed
];
