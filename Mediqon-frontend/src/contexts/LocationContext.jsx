import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const CITIES = [
  { id: 'hyderabad', name: 'Hyderabad', label: '📍 Hyderabad', state: 'Telangana' },
  { id: 'delhi', name: 'Delhi', label: '📍 Delhi NCR', state: 'Delhi' },
  { id: 'mumbai', name: 'Mumbai', label: '📍 Mumbai', state: 'Maharashtra' },
  { id: 'chennai', name: 'Chennai', label: '📍 Chennai', state: 'Tamil Nadu' },
  { id: 'warangal', name: 'Warangal', label: '📍 Warangal', state: 'Telangana' },
  { id: 'bengaluru', name: 'Bengaluru', label: '📍 Bengaluru', state: 'Karnataka' },
];

export const CITY_DOCTORS = {
  hyderabad: [
    // Apollo Health City, Jubilee Hills
    {
      id: 'hyd-101',
      name: 'Dr. Pratap Chandra Rath',
      fullName: 'Dr. Pratap Chandra Rath',
      specialization: 'Cardiology',
      specialty: 'Senior Cardiologist',
      city: 'Hyderabad',
      hospital: { id: 'hosp-hyd-1', name: 'Apollo Health City, Jubilee Hills, Hyderabad' },
      fee: 1500,
      experience: 24,
      rating: 4.95,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrPratapChandraRath&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrPratapChandraRath&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'hyd-102',
      name: 'Dr. Lahiry Anup Kumar',
      fullName: 'Dr. Lahiry Anup Kumar',
      specialization: 'Dermatology',
      specialty: 'Consultant Dermatologist',
      city: 'Hyderabad',
      hospital: { id: 'hosp-hyd-1', name: 'Apollo Health City, Jubilee Hills, Hyderabad' },
      fee: 1200,
      experience: 16,
      rating: 4.88,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrLahiryAnupKumar&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrLahiryAnupKumar&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'hyd-103',
      name: 'Dr. K Surya Pavan Reddy',
      fullName: 'Dr. K Surya Pavan Reddy',
      specialization: 'Diabetes & Endocrinology',
      specialty: 'Endocrinologist',
      city: 'Hyderabad',
      hospital: { id: 'hosp-hyd-1', name: 'Apollo Health City, Jubilee Hills, Hyderabad' },
      fee: 1400,
      experience: 18,
      rating: 4.90,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrKSuryaPavanReddy&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrKSuryaPavanReddy&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'hyd-104',
      name: 'Dr. Somasekhar M',
      fullName: 'Dr. Somasekhar M',
      specialization: 'Nephrology',
      specialty: 'Senior Nephrologist',
      city: 'Hyderabad',
      hospital: { id: 'hosp-hyd-1', name: 'Apollo Health City, Jubilee Hills, Hyderabad' },
      fee: 1600,
      experience: 20,
      rating: 4.92,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrSomasekharM&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrSomasekharM&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'hyd-105',
      name: 'Dr. P Vijay Anand Reddy',
      fullName: 'Dr. P Vijay Anand Reddy',
      specialization: 'Oncology',
      specialty: 'Director & Senior Oncologist',
      city: 'Hyderabad',
      hospital: { id: 'hosp-hyd-1', name: 'Apollo Health City, Jubilee Hills, Hyderabad' },
      fee: 2000,
      experience: 26,
      rating: 4.98,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrPVijayAnandReddy&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrPVijayAnandReddy&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },

    // Yashoda Hospitals, Somajiguda
    {
      id: 'hyd-106',
      name: 'Dr. K. Venugopal',
      fullName: 'Dr. K. Venugopal',
      specialization: 'Cardiology',
      specialty: 'Senior Cardiologist',
      city: 'Hyderabad',
      hospital: { id: 'hosp-hyd-2', name: 'Yashoda Hospitals, Somajiguda, Hyderabad' },
      fee: 1300,
      experience: 19,
      rating: 4.89,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrKVenugopal&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrKVenugopal&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'hyd-107',
      name: 'Dr. Swetha P',
      fullName: 'Dr. Swetha P',
      specialization: 'Dermatology',
      specialty: 'Dermatologist',
      city: 'Hyderabad',
      hospital: { id: 'hosp-hyd-2', name: 'Yashoda Hospitals, Somajiguda, Hyderabad' },
      fee: 1100,
      experience: 12,
      rating: 4.86,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrSwethaP&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrSwethaP&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'hyd-108',
      name: 'Dr. Rakesh Kumar Sahay',
      fullName: 'Dr. Rakesh Kumar Sahay',
      specialization: 'Diabetes & Endocrinology',
      specialty: 'Senior Endocrinologist',
      city: 'Hyderabad',
      hospital: { id: 'hosp-hyd-2', name: 'Yashoda Hospitals, Somajiguda, Hyderabad' },
      fee: 1500,
      experience: 25,
      rating: 4.96,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrRakeshKumarSahay&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrRakeshKumarSahay&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'hyd-109',
      name: 'Dr. K. S. Nayak',
      fullName: 'Dr. K. S. Nayak',
      specialization: 'Nephrology',
      specialty: 'Chief Nephrologist',
      city: 'Hyderabad',
      hospital: { id: 'hosp-hyd-2', name: 'Yashoda Hospitals, Somajiguda, Hyderabad' },
      fee: 1700,
      experience: 22,
      rating: 4.93,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrKSNayak&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrKSNayak&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'hyd-110',
      name: 'Dr. G. Vamshi Krishna Reddy',
      fullName: 'Dr. G. Vamshi Krishna Reddy',
      specialization: 'Oncology',
      specialty: 'Consultant Medical Oncologist',
      city: 'Hyderabad',
      hospital: { id: 'hosp-hyd-2', name: 'Yashoda Hospitals, Somajiguda, Hyderabad' },
      fee: 1800,
      experience: 15,
      rating: 4.91,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrGVamshiKrishnaReddy&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrGVamshiKrishnaReddy&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },

    // CARE Hospitals, Banjara Hills
    {
      id: 'hyd-111',
      name: 'Dr. A. S. V. Narayana Rao',
      fullName: 'Dr. A. S. V. Narayana Rao',
      specialization: 'Cardiology',
      specialty: 'Senior Interventional Cardiologist',
      city: 'Hyderabad',
      hospital: { id: 'hosp-hyd-3', name: 'CARE Hospitals, Banjara Hills, Hyderabad' },
      fee: 1600,
      experience: 23,
      rating: 4.94,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrASVNarayanaRao&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrASVNarayanaRao&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'hyd-112',
      name: 'Dr. Bhavana Nukala',
      fullName: 'Dr. Bhavana Nukala',
      specialization: 'Dermatology',
      specialty: 'Consultant Dermatologist',
      city: 'Hyderabad',
      hospital: { id: 'hosp-hyd-3', name: 'CARE Hospitals, Banjara Hills, Hyderabad' },
      fee: 1200,
      experience: 11,
      rating: 4.87,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrBhavanaNukala&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrBhavanaNukala&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'hyd-113',
      name: 'Dr. Bipin Kumar Sethi',
      fullName: 'Dr. Bipin Kumar Sethi',
      specialization: 'Diabetes & Endocrinology',
      specialty: 'Chief Endocrinologist',
      city: 'Hyderabad',
      hospital: { id: 'hosp-hyd-3', name: 'CARE Hospitals, Banjara Hills, Hyderabad' },
      fee: 1800,
      experience: 28,
      rating: 4.97,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrBipinKumarSethi&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrBipinKumarSethi&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'hyd-114',
      name: 'Dr. Bharadwaj Batchu',
      fullName: 'Dr. Bharadwaj Batchu',
      specialization: 'Nephrology',
      specialty: 'Consultant Nephrologist',
      city: 'Hyderabad',
      hospital: { id: 'hosp-hyd-3', name: 'CARE Hospitals, Banjara Hills, Hyderabad' },
      fee: 1500,
      experience: 14,
      rating: 4.90,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrBharadwajBatchu&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrBharadwajBatchu&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'hyd-115',
      name: 'Dr. Jyothi A',
      fullName: 'Dr. Jyothi A',
      specialization: 'Oncology',
      specialty: 'Radiation & Medical Oncologist',
      city: 'Hyderabad',
      hospital: { id: 'hosp-hyd-3', name: 'CARE Hospitals, Banjara Hills, Hyderabad' },
      fee: 1700,
      experience: 17,
      rating: 4.92,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrJyothiA&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrJyothiA&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },

    // KIMS Hospitals, Secunderabad
    {
      id: 'hyd-116',
      name: 'Dr. B. Hyngridd',
      fullName: 'Dr. B. Hyngridd',
      specialization: 'Cardiology',
      specialty: 'Consultant Cardiologist',
      city: 'Hyderabad',
      hospital: { id: 'hosp-hyd-4', name: 'KIMS Hospitals, Minister Road, Secunderabad' },
      fee: 1400,
      experience: 16,
      rating: 4.88,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrBHyngridd&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrBHyngridd&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'hyd-117',
      name: 'Dr. V. Sunitha',
      fullName: 'Dr. V. Sunitha',
      specialization: 'Dermatology',
      specialty: 'Senior Dermatologist',
      city: 'Hyderabad',
      hospital: { id: 'hosp-hyd-4', name: 'KIMS Hospitals, Minister Road, Secunderabad' },
      fee: 1150,
      experience: 14,
      rating: 4.85,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrVSunitha&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrVSunitha&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },

    // AIG Hospitals, Gachibowli
    {
      id: 'hyd-118',
      name: 'Dr. Rajeev Menon',
      fullName: 'Dr. Rajeev Menon',
      specialization: 'Cardiology',
      specialty: 'Interventional Cardiologist',
      city: 'Hyderabad',
      hospital: { id: 'hosp-hyd-5', name: 'AIG Hospitals, Gachibowli, Hyderabad' },
      fee: 1600,
      experience: 18,
      rating: 4.93,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrRajeevMenon&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrRajeevMenon&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'hyd-119',
      name: 'Dr. D. Nageshwar Reddy',
      fullName: 'Dr. D. Nageshwar Reddy',
      specialization: 'Oncology',
      specialty: 'Chairman & Gastro-Oncology Specialist',
      city: 'Hyderabad',
      hospital: { id: 'hosp-hyd-5', name: 'AIG Hospitals, Gachibowli, Hyderabad' },
      fee: 2500,
      experience: 32,
      rating: 4.99,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrDNageshwarReddy&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrDNageshwarReddy&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    }
  ],

  delhi: [
    // Indraprastha Apollo Hospitals, Sarita Vihar
    {
      id: 'del-201',
      name: 'Dr. Gautam Naik',
      fullName: 'Dr. Gautam Naik',
      specialization: 'Cardiology',
      specialty: 'Senior Cardiologist',
      city: 'Delhi',
      hospital: { id: 'hosp-del-1', name: 'Indraprastha Apollo Hospitals, Sarita Vihar, New Delhi' },
      fee: 1700,
      experience: 21,
      rating: 4.93,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrGautamNaik&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrGautamNaik&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'del-202',
      name: 'Dr. Sanjeev Gulati',
      fullName: 'Dr. Sanjeev Gulati',
      specialization: 'Nephrology',
      specialty: 'Director & Senior Nephrologist',
      city: 'Delhi',
      hospital: { id: 'hosp-del-1', name: 'Indraprastha Apollo Hospitals, Sarita Vihar, New Delhi' },
      fee: 2000,
      experience: 25,
      rating: 4.96,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrSanjeevGulati&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrSanjeevGulati&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'del-203',
      name: 'Dr. Ramesh Sarin',
      fullName: 'Dr. Ramesh Sarin',
      specialization: 'Oncology',
      specialty: 'Senior Surgical Oncologist',
      city: 'Delhi',
      hospital: { id: 'hosp-del-1', name: 'Indraprastha Apollo Hospitals, Sarita Vihar, New Delhi' },
      fee: 2200,
      experience: 28,
      rating: 4.98,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrRameshSarin&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrRameshSarin&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },

    // Max Super Speciality Hospital, Saket
    {
      id: 'del-204',
      name: 'Dr. Balbir Singh',
      fullName: 'Dr. Balbir Singh',
      specialization: 'Cardiology',
      specialty: 'Chairman - Cardiac Sciences',
      city: 'Delhi',
      hospital: { id: 'hosp-del-2', name: 'Max Super Speciality Hospital, Saket, New Delhi' },
      fee: 2200,
      experience: 30,
      rating: 4.99,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrBalbirSingh&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrBalbirSingh&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'del-205',
      name: 'Dr. Ajita Bagai Kakkar',
      fullName: 'Dr. Ajita Bagai Kakkar',
      specialization: 'Dermatology',
      specialty: 'Senior Consultant Dermatologist',
      city: 'Delhi',
      hospital: { id: 'hosp-del-2', name: 'Max Super Speciality Hospital, Saket, New Delhi' },
      fee: 1400,
      experience: 16,
      rating: 4.89,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrAjitaBagaiKakkar&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrAjitaBagaiKakkar&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'del-206',
      name: 'Dr. Ambrish Mithal',
      fullName: 'Dr. Ambrish Mithal',
      specialization: 'Diabetes & Endocrinology',
      specialty: 'Chairman - Endocrinology & Diabetes',
      city: 'Delhi',
      hospital: { id: 'hosp-del-2', name: 'Max Super Speciality Hospital, Saket, New Delhi' },
      fee: 2500,
      experience: 32,
      rating: 4.99,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrAmbrishMithal&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrAmbrishMithal&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'del-207',
      name: 'Dr. Dinesh Khullar',
      fullName: 'Dr. Dinesh Khullar',
      specialization: 'Nephrology',
      specialty: 'Chairman - Nephrology & Renal Transplant',
      city: 'Delhi',
      hospital: { id: 'hosp-del-2', name: 'Max Super Speciality Hospital, Saket, New Delhi' },
      fee: 2100,
      experience: 26,
      rating: 4.95,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrDineshKhullar&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrDineshKhullar&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'del-208',
      name: 'Dr. SVS Deo',
      fullName: 'Dr. SVS Deo',
      specialization: 'Oncology',
      specialty: 'Head - Surgical Oncology',
      city: 'Delhi',
      hospital: { id: 'hosp-del-2', name: 'Max Super Speciality Hospital, Saket, New Delhi' },
      fee: 2300,
      experience: 27,
      rating: 4.97,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrSVSDeo&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrSVSDeo&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },

    // Fortis Escorts Heart Institute, Okhla Road
    {
      id: 'del-209',
      name: 'Dr. Anil Saxena',
      fullName: 'Dr. Anil Saxena',
      specialization: 'Cardiology',
      specialty: 'Executive Director - Cardiac Electrophysiology',
      city: 'Delhi',
      hospital: { id: 'hosp-del-3', name: 'Fortis Escorts Heart Institute, Okhla Road, New Delhi' },
      fee: 2000,
      experience: 28,
      rating: 4.96,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrAnilSaxena&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrAnilSaxena&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'del-210',
      name: 'Dr. Ajit Singh Narula',
      fullName: 'Dr. Ajit Singh Narula',
      specialization: 'Nephrology',
      specialty: 'Director - Nephrology',
      city: 'Delhi',
      hospital: { id: 'hosp-del-3', name: 'Fortis Escorts Heart Institute, Okhla Road, New Delhi' },
      fee: 1900,
      experience: 24,
      rating: 4.92,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrAjitSinghNarula&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrAjitSinghNarula&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },

    // BLK Max Super Speciality Hospital
    {
      id: 'del-211',
      name: 'Dr. Rajesh Kumar Jain',
      fullName: 'Dr. Rajesh Kumar Jain',
      specialization: 'Oncology',
      specialty: 'Senior Consultant - Surgical Oncology',
      city: 'Delhi',
      hospital: { id: 'hosp-del-4', name: 'BLK Max Super Speciality Hospital, Rajendra Place, New Delhi' },
      fee: 1800,
      experience: 20,
      rating: 4.91,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrRajeshKumarJain&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrRajeshKumarJain&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },

    // Holy Family Hospital
    {
      id: 'del-212',
      name: 'Dr. Amitabh Yaduvanshi',
      fullName: 'Dr. Amitabh Yaduvanshi',
      specialization: 'Cardiology',
      specialty: 'Head - Interventional Cardiology',
      city: 'Delhi',
      hospital: { id: 'hosp-del-5', name: 'Holy Family Hospital, Okhla Road, New Delhi' },
      fee: 1500,
      experience: 19,
      rating: 4.90,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrAmitabhYaduvanshi&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrAmitabhYaduvanshi&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'del-213',
      name: 'Dr. Gaurav Sahai',
      fullName: 'Dr. Gaurav Sahai',
      specialization: 'Nephrology',
      specialty: 'Consultant Nephrologist',
      city: 'Delhi',
      hospital: { id: 'hosp-del-5', name: 'Holy Family Hospital, Okhla Road, New Delhi' },
      fee: 1400,
      experience: 15,
      rating: 4.88,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrGauravSahai&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrGauravSahai&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'del-214',
      name: 'Dr. Durgatosh Pandey',
      fullName: 'Dr. Durgatosh Pandey',
      specialization: 'Oncology',
      specialty: 'Senior Consultant Oncologist',
      city: 'Delhi',
      hospital: { id: 'hosp-del-5', name: 'Holy Family Hospital, Okhla Road, New Delhi' },
      fee: 1700,
      experience: 22,
      rating: 4.94,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrDurgatoshPandey&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrDurgatoshPandey&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    }
  ],

  mumbai: [
    // Kokilaben Dhirubhai Ambani Hospital, Andheri West
    {
      id: 'mum-301',
      name: 'Dr. Pravin Kahale',
      fullName: 'Dr. Pravin Kahale',
      specialization: 'Cardiology',
      specialty: 'Consultant Cardiologist',
      city: 'Mumbai',
      hospital: { id: 'hosp-mum-1', name: 'Kokilaben Dhirubhai Ambani Hospital, Andheri West, Mumbai' },
      fee: 2000,
      experience: 20,
      rating: 4.94,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrPravinKahale&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrPravinKahale&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'mum-302',
      name: 'Dr. Jawaharlal Mansukhani',
      fullName: 'Dr. Jawaharlal Mansukhani',
      specialization: 'Dermatology',
      specialty: 'Senior Dermatologist',
      city: 'Mumbai',
      hospital: { id: 'hosp-mum-1', name: 'Kokilaben Dhirubhai Ambani Hospital, Andheri West, Mumbai' },
      fee: 1600,
      experience: 25,
      rating: 4.91,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrJawaharlalMansukhani&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrJawaharlalMansukhani&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'mum-303',
      name: 'Dr. Dheeraj Kapoor',
      fullName: 'Dr. Dheeraj Kapoor',
      specialization: 'Diabetes & Endocrinology',
      specialty: 'Head - Endocrinology',
      city: 'Mumbai',
      hospital: { id: 'hosp-mum-1', name: 'Kokilaben Dhirubhai Ambani Hospital, Andheri West, Mumbai' },
      fee: 1800,
      experience: 18,
      rating: 4.93,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrDheerajKapoor&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrDheerajKapoor&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'mum-304',
      name: 'Dr. Niranjan Kulkarni',
      fullName: 'Dr. Niranjan Kulkarni',
      specialization: 'Nephrology',
      specialty: 'Consultant Nephrologist',
      city: 'Mumbai',
      hospital: { id: 'hosp-mum-1', name: 'Kokilaben Dhirubhai Ambani Hospital, Andheri West, Mumbai' },
      fee: 1900,
      experience: 21,
      rating: 4.95,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrNiranjanKulkarni&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrNiranjanKulkarni&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'mum-305',
      name: 'Dr. Santanu Sen',
      fullName: 'Dr. Santanu Sen',
      specialization: 'Oncology',
      specialty: 'Consultant Pediatric Oncologist',
      city: 'Mumbai',
      hospital: { id: 'hosp-mum-1', name: 'Kokilaben Dhirubhai Ambani Hospital, Andheri West, Mumbai' },
      fee: 2100,
      experience: 19,
      rating: 4.96,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrSantanuSen&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrSantanuSen&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },

    // P. D. Hinduja Hospital, Mahim
    {
      id: 'mum-306',
      name: 'Dr. C. K. Ponde',
      fullName: 'Dr. C. K. Ponde',
      specialization: 'Cardiology',
      specialty: 'Director - Cardiology',
      city: 'Mumbai',
      hospital: { id: 'hosp-mum-2', name: 'P. D. Hinduja Hospital, Mahim, Mumbai' },
      fee: 2200,
      experience: 28,
      rating: 4.97,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrCKPonde&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrCKPonde&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },

    // Lilavati Hospital, Bandra West
    {
      id: 'mum-307',
      name: 'Dr. Vijay Bang',
      fullName: 'Dr. Vijay Bang',
      specialization: 'Cardiology',
      specialty: 'Senior Interventional Cardiologist',
      city: 'Mumbai',
      hospital: { id: 'hosp-mum-3', name: 'Lilavati Hospital & Research Centre, Bandra West, Mumbai' },
      fee: 2000,
      experience: 24,
      rating: 4.94,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrVijayBang&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrVijayBang&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },

    // Bombay Hospital, Marine Lines
    {
      id: 'mum-308',
      name: 'Dr. Satyavan Sharma',
      fullName: 'Dr. Satyavan Sharma',
      specialization: 'Cardiology',
      specialty: 'Head - Cardiology',
      city: 'Mumbai',
      hospital: { id: 'hosp-mum-4', name: 'Bombay Hospital, Marine Lines, Mumbai' },
      fee: 1800,
      experience: 30,
      rating: 4.98,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrSatyavanSharma&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrSatyavanSharma&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'mum-309',
      name: 'Dr. Deepak Parikh',
      fullName: 'Dr. Deepak Parikh',
      specialization: 'Dermatology',
      specialty: 'Senior Consultant Dermatologist',
      city: 'Mumbai',
      hospital: { id: 'hosp-mum-4', name: 'Bombay Hospital, Marine Lines, Mumbai' },
      fee: 1500,
      experience: 22,
      rating: 4.90,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrDeepakParikh&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrDeepakParikh&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'mum-310',
      name: 'Dr. Piya Ballani Thakkar',
      fullName: 'Dr. Piya Ballani Thakkar',
      specialization: 'Diabetes & Endocrinology',
      specialty: 'Consultant Endocrinologist',
      city: 'Mumbai',
      hospital: { id: 'hosp-mum-4', name: 'Bombay Hospital, Marine Lines, Mumbai' },
      fee: 1600,
      experience: 17,
      rating: 4.92,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrPiyaBallaniThakkar&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrPiyaBallaniThakkar&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'mum-311',
      name: 'Dr. A. L. Kirpalani',
      fullName: 'Dr. A. L. Kirpalani',
      specialization: 'Nephrology',
      specialty: 'Chief Nephrologist',
      city: 'Mumbai',
      hospital: { id: 'hosp-mum-4', name: 'Bombay Hospital, Marine Lines, Mumbai' },
      fee: 2100,
      experience: 32,
      rating: 4.99,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrALKirpalani&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrALKirpalani&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },

    // Tata Memorial Hospital, Parel (Oncology Specialist Hub)
    {
      id: 'mum-312',
      name: 'Dr. Sudeep Gupta',
      fullName: 'Dr. Sudeep Gupta',
      specialization: 'Oncology',
      specialty: 'Director & Senior Medical Oncologist',
      city: 'Mumbai',
      hospital: { id: 'hosp-mum-5', name: 'Tata Memorial Hospital, Parel, Mumbai' },
      fee: 2200,
      experience: 27,
      rating: 4.99,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrSudeepGupta&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrSudeepGupta&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    }
  ],

  chennai: [
    // Apollo Hospitals, Greams Road
    {
      id: 'chn-401',
      name: 'Dr. Y. Vijayachandra Reddy',
      fullName: 'Dr. Y. Vijayachandra Reddy',
      specialization: 'Cardiology',
      specialty: 'Senior Interventional Cardiologist',
      city: 'Chennai',
      hospital: { id: 'hosp-chn-1', name: 'Apollo Hospitals, Greams Road, Chennai' },
      fee: 1800,
      experience: 25,
      rating: 4.96,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrYVijayachandraReddy&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrYVijayachandraReddy&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'chn-402',
      name: 'Dr. Maya Vedamurthy',
      fullName: 'Dr. Maya Vedamurthy',
      specialization: 'Dermatology',
      specialty: 'Senior Consultant Dermatologist',
      city: 'Chennai',
      hospital: { id: 'hosp-chn-1', name: 'Apollo Hospitals, Greams Road, Chennai' },
      fee: 1400,
      experience: 22,
      rating: 4.92,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrMayaVedamurthy&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrMayaVedamurthy&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'chn-403',
      name: 'Dr. M. K. Mani',
      fullName: 'Dr. M. K. Mani',
      specialization: 'Nephrology',
      specialty: 'Chief Nephrologist',
      city: 'Chennai',
      hospital: { id: 'hosp-chn-1', name: 'Apollo Hospitals, Greams Road, Chennai' },
      fee: 2200,
      experience: 35,
      rating: 4.99,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrMKMani&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrMKMani&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },

    // Fortis Malar Hospital, Adyar
    {
      id: 'chn-404',
      name: 'Dr. Aarimuthusamy A',
      fullName: 'Dr. Aarimuthusamy A',
      specialization: 'Cardiology',
      specialty: 'Consultant Cardiologist',
      city: 'Chennai',
      hospital: { id: 'hosp-chn-2', name: 'Fortis Malar Hospital, Adyar, Chennai' },
      fee: 1500,
      experience: 17,
      rating: 4.89,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrAarimuthusamyA&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrAarimuthusamyA&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'chn-405',
      name: 'Dr. Amudha M',
      fullName: 'Dr. Amudha M',
      specialization: 'Dermatology',
      specialty: 'Consultant Dermatologist',
      city: 'Chennai',
      hospital: { id: 'hosp-chn-2', name: 'Fortis Malar Hospital, Adyar, Chennai' },
      fee: 1200,
      experience: 14,
      rating: 4.86,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrAmudhaM&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrAmudhaM&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },

    // Kauvery Hospital
    {
      id: 'chn-406',
      name: 'Dr. Manoj Sivaramakrishnan',
      fullName: 'Dr. Manoj Sivaramakrishnan',
      specialization: 'Cardiology',
      specialty: 'Consultant Interventional Cardiologist',
      city: 'Chennai',
      hospital: { id: 'hosp-chn-3', name: 'Kauvery Hospital, Chennai' },
      fee: 1600,
      experience: 16,
      rating: 4.91,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrManojSivaramakrishnan&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrManojSivaramakrishnan&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'chn-407',
      name: 'Dr. Vijay Kartik',
      fullName: 'Dr. Vijay Kartik',
      specialization: 'Dermatology',
      specialty: 'Consultant Dermatologist',
      city: 'Chennai',
      hospital: { id: 'hosp-chn-3', name: 'Kauvery Hospital, Chennai' },
      fee: 1300,
      experience: 13,
      rating: 4.88,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrVijayKartik&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrVijayKartik&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'chn-408',
      name: 'Dr. Rameez Raja B',
      fullName: 'Dr. Rameez Raja B',
      specialization: 'Diabetes & Endocrinology',
      specialty: 'Consultant Endocrinologist',
      city: 'Chennai',
      hospital: { id: 'hosp-chn-3', name: 'Kauvery Hospital, Chennai' },
      fee: 1400,
      experience: 12,
      rating: 4.87,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrRameezRajaB&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrRameezRajaB&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'chn-409',
      name: 'Dr. Balaji Kirushnan',
      fullName: 'Dr. Balaji Kirushnan',
      specialization: 'Nephrology',
      specialty: 'Consultant Nephrologist',
      city: 'Chennai',
      hospital: { id: 'hosp-chn-3', name: 'Kauvery Hospital, Chennai' },
      fee: 1500,
      experience: 15,
      rating: 4.90,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrBalajiKirushnan&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrBalajiKirushnan&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'chn-410',
      name: 'Dr. M. Mangala Devi',
      fullName: 'Dr. M. Mangala Devi',
      specialization: 'Oncology',
      specialty: 'Consultant Oncologist',
      city: 'Chennai',
      hospital: { id: 'hosp-chn-3', name: 'Kauvery Hospital, Chennai' },
      fee: 1700,
      experience: 18,
      rating: 4.93,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrMMangalaDevi&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrMMangalaDevi&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },

    // MGM Healthcare, Aminjikarai
    {
      id: 'chn-411',
      name: 'Dr. Madan Mohan B',
      fullName: 'Dr. Madan Mohan B',
      specialization: 'Cardiology',
      specialty: 'Senior Consultant Interventional Cardiologist',
      city: 'Chennai',
      hospital: { id: 'hosp-chn-4', name: 'MGM Healthcare, Aminjikarai, Chennai' },
      fee: 1900,
      experience: 22,
      rating: 4.95,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrMadanMohanB&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrMadanMohanB&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    }
  ],

  warangal: [
    // Apollo Reach NSR Hospital, Arepally
    {
      id: 'wgl-501',
      name: 'Dr. Phanindra Mothukri',
      fullName: 'Dr. Phanindra Mothukri',
      specialization: 'Cardiology',
      specialty: 'Consultant Cardiologist',
      city: 'Warangal',
      hospital: { id: 'hosp-wgl-1', name: 'Apollo Reach NSR Hospital, Arepally, Warangal' },
      fee: 1000,
      experience: 14,
      rating: 4.88,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrPhanindraMothukri&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrPhanindraMothukri&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'wgl-502',
      name: 'Dr. Ramu Damuluri',
      fullName: 'Dr. Ramu Damuluri',
      specialization: 'Oncology',
      specialty: 'Consultant Surgical Oncology',
      city: 'Warangal',
      hospital: { id: 'hosp-wgl-1', name: 'Apollo Reach NSR Hospital, Arepally, Warangal' },
      fee: 1200,
      experience: 16,
      rating: 4.91,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrRamuDamuluri&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrRamuDamuluri&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },

    // Jaya Hospital, Hanamkonda
    {
      id: 'wgl-503',
      name: 'Dr. A. Srinivas Kumar',
      fullName: 'Dr. A. Srinivas Kumar',
      specialization: 'Cardiology',
      specialty: 'Senior Cardiologist',
      city: 'Warangal',
      hospital: { id: 'hosp-wgl-2', name: 'Jaya Hospital, Hanamkonda, Warangal' },
      fee: 950,
      experience: 18,
      rating: 4.87,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrASrinivasKumar&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrASrinivasKumar&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'wgl-504',
      name: 'Dr. V. Deepak Shodan',
      fullName: 'Dr. V. Deepak Shodan',
      specialization: 'Dermatology',
      specialty: 'Consultant Dermatologist',
      city: 'Warangal',
      hospital: { id: 'hosp-wgl-2', name: 'Jaya Hospital, Hanamkonda, Warangal' },
      fee: 800,
      experience: 11,
      rating: 4.84,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrVDeepakShodan&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrVDeepakShodan&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'wgl-505',
      name: 'Dr. SriRamulu',
      fullName: 'Dr. SriRamulu',
      specialization: 'Nephrology',
      specialty: 'Consultant Nephrologist',
      city: 'Warangal',
      hospital: { id: 'hosp-wgl-2', name: 'Jaya Hospital, Hanamkonda, Warangal' },
      fee: 1100,
      experience: 20,
      rating: 4.90,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrSriRamulu&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrSriRamulu&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },

    // Rohini Super Speciality Hospital, Subedari
    {
      id: 'wgl-506',
      name: 'Dr. C. Mamatha Reddy',
      fullName: 'Dr. C. Mamatha Reddy',
      specialization: 'Cardiology',
      specialty: 'Consultant Cardiologist',
      city: 'Warangal',
      hospital: { id: 'hosp-wgl-3', name: 'Rohini Super Speciality Hospital, Subedari, Warangal' },
      fee: 900,
      experience: 15,
      rating: 4.86,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrCMamathaReddy&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrCMamathaReddy&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },

    // Samraksha Super Speciality Hospital
    {
      id: 'wgl-507',
      name: 'Dr. B. Vikram',
      fullName: 'Dr. B. Vikram',
      specialization: 'Cardiology',
      specialty: 'Cardiologist & Physician',
      city: 'Warangal',
      hospital: { id: 'hosp-wgl-4', name: 'Samraksha Super Speciality Hospital, Narsampet Road, Warangal' },
      fee: 850,
      experience: 12,
      rating: 4.82,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrBVikram&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrBVikram&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },

    // Guardian Multi Speciality Hospital
    {
      id: 'wgl-508',
      name: 'Dr. N. Ramesh',
      fullName: 'Dr. N. Ramesh',
      specialization: 'General Medicine',
      specialty: 'Senior Physician & Consultant',
      city: 'Warangal',
      hospital: { id: 'hosp-wgl-5', name: 'Guardian Multi Speciality Hospital, Warangal' },
      fee: 800,
      experience: 17,
      rating: 4.85,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrNRamesh&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrNRamesh&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    }
  ],

  bengaluru: [
    // Manipal Hospitals, Old Airport Road
    {
      id: 'blr-601',
      name: 'Dr. B. S. Chakrapani',
      fullName: 'Dr. B. S. Chakrapani',
      specialization: 'Cardiology',
      specialty: 'Senior Consultant Cardiologist',
      city: 'Bengaluru',
      hospital: { id: 'hosp-blr-1', name: 'Manipal Hospitals, Old Airport Road, Bengaluru' },
      fee: 1800,
      experience: 23,
      rating: 4.94,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrBSChakrapani&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrBSChakrapani&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'blr-602',
      name: 'Dr. Sachith Abraham',
      fullName: 'Dr. Sachith Abraham',
      specialization: 'Dermatology',
      specialty: 'Consultant Dermatologist',
      city: 'Bengaluru',
      hospital: { id: 'hosp-blr-1', name: 'Manipal Hospitals, Old Airport Road, Bengaluru' },
      fee: 1400,
      experience: 16,
      rating: 4.89,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrSachithAbraham&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrSachithAbraham&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'blr-603',
      name: 'Dr. Mohan Y. Badagandi',
      fullName: 'Dr. Mohan Y. Badagandi',
      specialization: 'Diabetes & Endocrinology',
      specialty: 'Senior Endocrinologist',
      city: 'Bengaluru',
      hospital: { id: 'hosp-blr-1', name: 'Manipal Hospitals, Old Airport Road, Bengaluru' },
      fee: 1700,
      experience: 21,
      rating: 4.93,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrMohanYBadagandi&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrMohanYBadagandi&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'blr-604',
      name: 'Dr. R. Sanjay Rampure',
      fullName: 'Dr. R. Sanjay Rampure',
      specialization: 'Nephrology',
      specialty: 'Consultant Nephrologist',
      city: 'Bengaluru',
      hospital: { id: 'hosp-blr-1', name: 'Manipal Hospitals, Old Airport Road, Bengaluru' },
      fee: 1900,
      experience: 22,
      rating: 4.95,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrRSanjayRampure&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrRSanjayRampure&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'blr-605',
      name: 'Dr. Poonam Patil',
      fullName: 'Dr. Poonam Patil',
      specialization: 'Oncology',
      specialty: 'Consultant Medical Oncologist',
      city: 'Bengaluru',
      hospital: { id: 'hosp-blr-1', name: 'Manipal Hospitals, Old Airport Road, Bengaluru' },
      fee: 2000,
      experience: 18,
      rating: 4.96,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrPoonamPatil&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrPoonamPatil&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },

    // Aster CMI Hospital, Hebbal
    {
      id: 'blr-606',
      name: 'Prof. Dr. Nagamalesh U M',
      fullName: 'Prof. Dr. Nagamalesh U M',
      specialization: 'Cardiology',
      specialty: 'Director - Cardiology & Heart Failure',
      city: 'Bengaluru',
      hospital: { id: 'hosp-blr-2', name: 'Aster CMI Hospital, Hebbal, Bengaluru' },
      fee: 2100,
      experience: 26,
      rating: 4.98,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=ProfDrNagamaleshUM&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=ProfDrNagamaleshUM&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'blr-607',
      name: 'Dr. Girish S. Shetkar',
      fullName: 'Dr. Girish S. Shetkar',
      specialization: 'Oncology',
      specialty: 'Consultant Head & Neck Oncology',
      city: 'Bengaluru',
      hospital: { id: 'hosp-blr-2', name: 'Aster CMI Hospital, Hebbal, Bengaluru' },
      fee: 1800,
      experience: 17,
      rating: 4.92,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrGirishSShetkar&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrGirishSShetkar&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },

    // Fortis Hospital, Bannerghatta Road
    {
      id: 'blr-608',
      name: 'Dr. Ashwin Kodliwadmath',
      fullName: 'Dr. Ashwin Kodliwadmath',
      specialization: 'Cardiology',
      specialty: 'Consultant Interventional Cardiologist',
      city: 'Bengaluru',
      hospital: { id: 'hosp-blr-3', name: 'Fortis Hospital, Bannerghatta Road, Bengaluru' },
      fee: 1700,
      experience: 19,
      rating: 4.91,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrAshwinKodliwadmath&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrAshwinKodliwadmath&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'blr-609',
      name: 'Dr. Anusha N D',
      fullName: 'Dr. Anusha N D',
      specialization: 'Diabetes & Endocrinology',
      specialty: 'Consultant Endocrinologist',
      city: 'Bengaluru',
      hospital: { id: 'hosp-blr-3', name: 'Fortis Hospital, Bannerghatta Road, Bengaluru' },
      fee: 1500,
      experience: 14,
      rating: 4.88,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrAnushaND&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrAnushaND&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'blr-610',
      name: 'Dr. Mallikarjuna Hunasaghatta Mallapa',
      fullName: 'Dr. Mallikarjuna Hunasaghatta Mallapa',
      specialization: 'Nephrology',
      specialty: 'Senior Nephrologist',
      city: 'Bengaluru',
      hospital: { id: 'hosp-blr-3', name: 'Fortis Hospital, Bannerghatta Road, Bengaluru' },
      fee: 1850,
      experience: 23,
      rating: 4.94,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrMallikarjunaHunasaghattaMallapa&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrMallikarjunaHunasaghattaMallapa&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },

    // Narayana Health City, Bommasandra
    {
      id: 'blr-611',
      name: 'Dr. Devi Shetty',
      fullName: 'Dr. Devi Shetty',
      specialization: 'Cardiology',
      specialty: 'Chairman & Chief Cardiac Surgeon',
      city: 'Bengaluru',
      hospital: { id: 'hosp-blr-4', name: 'Narayana Health City, Bommasandra, Bengaluru' },
      fee: 2500,
      experience: 35,
      rating: 4.99,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrDeviShetty&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrDeviShetty&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },

    // Apollo Hospitals, Seshadripuram
    {
      id: 'blr-612',
      name: 'Dr. B. C. Srinivas',
      fullName: 'Dr. B. C. Srinivas',
      specialization: 'Cardiology',
      specialty: 'Senior Consultant - Cardiac Sciences',
      city: 'Bengaluru',
      hospital: { id: 'hosp-blr-5', name: 'Apollo Hospitals, Seshadripuram, Bengaluru' },
      fee: 1900,
      experience: 25,
      rating: 4.95,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrBCSrinivas&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrBCSrinivas&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'blr-613',
      name: 'Dr. Surendra VHH',
      fullName: 'Dr. Surendra VHH',
      specialization: 'Dermatology',
      specialty: 'Senior Consultant Dermatologist',
      city: 'Bengaluru',
      hospital: { id: 'hosp-blr-5', name: 'Apollo Hospitals, Seshadripuram, Bengaluru' },
      fee: 1400,
      experience: 20,
      rating: 4.90,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrSurendraVHH&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrSurendraVHH&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'blr-614',
      name: 'Dr. Dwarakanath C. S',
      fullName: 'Dr. Dwarakanath C. S',
      specialization: 'Diabetes & Endocrinology',
      specialty: 'Chief Endocrinologist',
      city: 'Bengaluru',
      hospital: { id: 'hosp-blr-5', name: 'Apollo Hospitals, Seshadripuram, Bengaluru' },
      fee: 1800,
      experience: 27,
      rating: 4.96,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrDwarakanathCS&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrDwarakanathCS&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    },
    {
      id: 'blr-615',
      name: 'Dr. Vasantha Kumar R. S',
      fullName: 'Dr. Vasantha Kumar R. S',
      specialization: 'Nephrology',
      specialty: 'Senior Nephrologist',
      city: 'Bengaluru',
      hospital: { id: 'hosp-blr-5', name: 'Apollo Hospitals, Seshadripuram, Bengaluru' },
      fee: 1750,
      experience: 22,
      rating: 4.93,
      photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrVasanthaKumarRS&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DrVasanthaKumarRS&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'
    }
  ]
};

export function LocationProvider({ children }) {
  const [cityId, setCityId] = useState(() => {
    return localStorage.getItem('mediqon_city') || 'hyderabad';
  });

  useEffect(() => {
    localStorage.setItem('mediqon_city', cityId);
  }, [cityId]);

  const currentCityObj = CITIES.find(c => c.id === cityId) || CITIES[0];
  const cityDoctors = CITY_DOCTORS[cityId] || CITY_DOCTORS.hyderabad;

  const changeCity = (newCityId) => {
    if (CITY_DOCTORS[newCityId]) {
      setCityId(newCityId);
      window.dispatchEvent(new CustomEvent('city-changed', { detail: newCityId }));
    }
  };

  return (
    <LocationContext.Provider value={{ cityId, currentCity: currentCityObj, cityDoctors, changeCity, CITIES }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
}
